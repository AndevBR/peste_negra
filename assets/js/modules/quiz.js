// Interface do quiz (quiz.html). As regras ficam em quiz-motor.js.
import { el, icone } from './dom.js';
import { carregarDados, mostrarErro, mapaDeFontes } from './dados.js';
import { linhaDeFontes } from './painel.js';
import { criarSessao, questaoAtual, responder, avancar, terminou, pontuacao, mensagemFinal } from './quiz-motor.js';

// Guarda apenas os ids das perguntas já vistas (nenhum dado pessoal), para variar as sessões.
const CHAVE = 'peste-negra:quiz:vistas';
const lerVistas = () => { try { const v = JSON.parse(localStorage.getItem(CHAVE)); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; } catch { return []; } };
const salvarVistas = (v) => { try { localStorage.setItem(CHAVE, JSON.stringify(v)); } catch { /* armazenamento indisponível: o quiz funciona igual */ } };

export async function iniciarQuiz(raiz) {
  const palco = raiz.querySelector('[data-quiz-palco]');
  let banco, fontes;
  try {
    [banco, fontes] = await Promise.all([carregarDados('quiz'), mapaDeFontes()]);
  } catch (erro) { mostrarErro(palco, erro); return; }

  let sessao;
  const novaSessao = () => {
    sessao = criarSessao(banco.questoes, banco.porSessao, lerVistas());
    salvarVistas(sessao.historico);
    mostrarQuestao();
  };

  function mostrarQuestao() {
    const q = questaoAtual(sessao);
    const n = sessao.indice + 1, total = sessao.questoes.length;
    const barra = el('div', { classe: 'progresso__barra' });
    barra.style.width = `${(sessao.indice / total) * 100}%`;

    const lista = el('ol', { classe: 'quiz__alternativas', type: 'A' });
    const botoes = q.alternativas.map((texto, i) => {
      const b = el('button', { classe: 'alternativa', type: 'button', dados: { indice: i } }, [
        el('span', { classe: 'alternativa__letra', texto: 'ABCD'[i] ?? String(i + 1), 'aria-hidden': 'true' }),
        el('span', { classe: 'alternativa__texto', texto }),
        el('span', { classe: 'alternativa__estado' }),
      ]);
      b.addEventListener('click', () => escolher(i));
      lista.append(el('li', {}, [b]));
      return b;
    });
    const area = el('div', { 'aria-live': 'polite', dados: { quizFeedback: '' } });

    function escolher(i) {
      const r = responder(sessao, i);
      if (!r) return;
      botoes.forEach((b, k) => {
        b.disabled = true;
        const estado = b.querySelector('.alternativa__estado');
        if (k === r.correta) { b.classList.add('alternativa--certa'); estado.replaceChildren(icone('certo'), ' Correta'); }
        else if (k === i) { b.classList.add('alternativa--errada'); estado.replaceChildren(icone('errado'), ' Sua resposta'); }
      });
      barra.style.width = `${(n / total) * 100}%`;
      const ultima = n === total;
      const proximo = el('button', { classe: 'btn', type: 'button', dados: { quizProximo: '' } }, [ultima ? 'Ver resultado' : 'Próxima pergunta', icone('seta-direita')]);
      proximo.addEventListener('click', () => { avancar(sessao); terminou(sessao) ? mostrarResultado() : mostrarQuestao(); });
      area.replaceChildren(
        el('div', { classe: `feedback ${r.acertou ? 'feedback--certo' : 'feedback--errado'}` }, [
          el('p', { classe: 'feedback__titulo' }, [icone(r.acertou ? 'certo' : 'errado'), r.acertou ? 'Resposta certa!' : `Resposta errada. A correta é a letra ${'ABCD'[r.correta]}.`]),
          el('p', { texto: q.explicacao }),
          linhaDeFontes(q.fontes, fontes),
        ]),
        el('div', { classe: 'quiz__rodape' }, [proximo]),
      );
      proximo.focus();
    }

    const titulo = el('h2', { classe: 'quiz__pergunta', id: 'quiz-pergunta', tabindex: '-1', texto: q.pergunta });
    palco.replaceChildren(el('div', { classe: 'cartao quiz__cartao' }, [
      el('div', { classe: 'quiz__topo' }, [
        el('span', { dados: { quizContador: '' }, texto: `Pergunta ${n} de ${total}` }),
        el('span', { texto: `Acertos: ${pontuacao(sessao).acertos}` }),
      ]),
      el('div', { classe: 'progresso', role: 'progressbar', 'aria-label': 'Progresso do quiz', 'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-valuenow': String(sessao.indice) }, [barra]),
      titulo,
      lista,
      area,
    ]));
    titulo.focus({ preventScroll: true });
    if (sessao.indice > 0) raiz.scrollIntoView({ block: 'start' });
  }

  function mostrarResultado() {
    const p = pontuacao(sessao);
    const revisao = el('ol', {}, sessao.questoes.map((q, i) => {
      const r = sessao.respostas[i];
      return el('li', {}, [
        el('strong', { texto: r.acertou ? 'Acertou: ' : 'Errou: ' }), q.pergunta, ' — ',
        el('em', { texto: `resposta correta: ${q.alternativas[q.correta]}` }),
      ]);
    }));
    const deNovo = el('button', { classe: 'btn', type: 'button', dados: { quizReiniciar: '' } }, [icone('reiniciar'), 'Jogar novamente']);
    deNovo.addEventListener('click', novaSessao);
    const titulo = el('h2', { tabindex: '-1', texto: 'Resultado' });
    palco.replaceChildren(el('div', { classe: 'cartao quiz__cartao resultado', dados: { quizResultado: '' } }, [
      el('img', { src: 'assets/images/cinema/doutor-luz-pequeno.webp', alt: '', width: 320, height: 560 }),
      titulo,
      el('p', { classe: 'resultado__placar', dados: { quizPlacar: '' }, texto: `${p.acertos} / ${p.total}` }),
      el('p', { texto: `Você acertou ${p.acertos} de ${p.total} perguntas (${p.percentual}%).` }),
      el('p', { texto: mensagemFinal(p) }),
      el('div', { classe: 'resultado__acoes' }, [
        deNovo,
        el('a', { classe: 'btn btn--contorno', href: './#historia' }, ['Revisar o conteúdo']),
        el('a', { classe: 'btn btn--ouro', href: 'jogos/jornada-medieval/' }, [icone('dado'), 'Jogar o tabuleiro']),
      ]),
      el('details', { classe: 'resultado__revisao' }, [el('summary', { texto: 'Ver respostas corretas' }), revisao]),
    ]));
    titulo.focus();
  }

  novaSessao();
}
