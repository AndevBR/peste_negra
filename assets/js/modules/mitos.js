// Mitos e verdades: o visitante pensa na resposta e depois a revela.
// O veredito usa texto e ícone, não só cor.
import { el, icone } from './dom.js';
import { carregarDados, mostrarErro, mapaDeFontes } from './dados.js';
import { linhaDeFontes } from './painel.js';

const VEREDITOS = {
  verdade: { texto: 'Verdade', icone: 'certo' },
  mito: { texto: 'Mito', icone: 'errado' },
  'em parte': { texto: 'Em parte', icone: 'em-parte' },
};

export async function iniciarMitos(lista) {
  try {
    const [{ afirmacoes }, fontes] = await Promise.all([carregarDados('mitos'), mapaDeFontes()]);
    lista.replaceChildren(...afirmacoes.map((a) => cartao(a, fontes)));
  } catch (erro) {
    mostrarErro(lista, erro);
  }
}

function cartao(a, fontes) {
  const v = VEREDITOS[a.veredito];
  const idResposta = `mito-${a.id}`;
  const resposta = el('div', { classe: 'mito__resposta', id: idResposta, hidden: true }, [
    el('span', { classe: `veredito veredito--${a.veredito.replace(' ', '-')}` }, [icone(v.icone), v.texto]),
    el('p', { texto: a.explicacao }),
    linhaDeFontes(a.fontes, fontes),
  ]);
  const botao = el('button', {
    classe: 'btn btn--contorno btn--pequeno mito__botao', type: 'button',
    'aria-expanded': 'false', 'aria-controls': idResposta,
  }, [icone('olho'), 'Revelar resposta']);
  botao.addEventListener('click', () => {
    const abrir = resposta.hidden;
    resposta.hidden = !abrir;
    botao.setAttribute('aria-expanded', String(abrir));
    botao.lastChild.textContent = abrir ? 'Ocultar resposta' : 'Revelar resposta';
  });
  return el('li', {}, [el('article', { classe: 'cartao mito', dados: { mito: a.id } }, [
    el('p', { classe: 'mito__afirmacao', texto: `“${a.afirmacao}”` }),
    botao,
    resposta,
  ])]);
}
