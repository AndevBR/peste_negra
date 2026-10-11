// Mapa da disseminação: pontos clicáveis e animação cronológica.
import { el, reduzirMovimento } from './dom.js';
import { carregarDados, mostrarErro } from './dados.js';

export async function iniciarMapa(raiz) {
  const camada = raiz.querySelector('[data-mapa-pontos]');
  const info = raiz.querySelector('[data-mapa-info]');
  const botao = raiz.querySelector('[data-mapa-animar]');
  const ano = raiz.querySelector('[data-mapa-ano]');
  let dados;
  try { dados = await carregarDados('mapa'); } catch (erro) { mostrarErro(info, erro); botao.hidden = true; return; }

  // lista de cidades: controle equivalente aos pontos, com alvos de toque confortáveis
  const lista = el('ul', { classe: 'mapa__cidades', 'aria-label': 'Cidades do mapa, em ordem cronológica' });
  raiz.querySelector('.mapa__controles').after(lista);
  const celular = window.matchMedia('(max-width: 640px)');

  const pontos = dados.cidades.map((c) => {
    const ponto = el('button', {
      classe: 'mapa__ponto', type: 'button', 'aria-pressed': 'false',
      'aria-label': `${c.nome}: ${c.data}`, dados: { cidade: c.id },
    });
    ponto.style.left = `${(c.x / dados.largura) * 100}%`;
    ponto.style.top = `${(c.y / dados.altura) * 100}%`;
    const rotulo = el('span', { classe: 'mapa__rotulo', texto: c.nome, 'aria-hidden': 'true' });
    rotulo.style.left = ponto.style.left; rotulo.style.top = ponto.style.top;
    ponto.addEventListener('click', () => mostrar(c, ponto));
    camada.append(ponto, rotulo);
    const botao = el('button', { classe: 'abas__aba', type: 'button', 'aria-pressed': 'false', dados: { cidadeLista: c.id }, texto: c.nome });
    botao.addEventListener('click', () => mostrar(c, ponto));
    lista.append(el('li', {}, [botao]));
    return ponto;
  });
  const botoesLista = [...lista.querySelectorAll('button')];

  // no celular os pontos ficam muito próximos: viram apenas indicação visual e a lista assume a interação
  const ajustarPontos = () => pontos.forEach((p) => {
    if (celular.matches) { p.tabIndex = -1; p.setAttribute('aria-hidden', 'true'); }
    else { p.removeAttribute('tabindex'); p.removeAttribute('aria-hidden'); }
  });
  celular.addEventListener('change', ajustarPontos);
  ajustarPontos();

  function mostrar(c, ponto) {
    pontos.forEach((p, i) => {
      const ativo = p === ponto;
      p.setAttribute('aria-pressed', String(ativo)); p.classList.toggle('ativo', ativo);
      botoesLista[i].setAttribute('aria-pressed', String(ativo));
    });
    info.replaceChildren(el('h3', { texto: `${c.nome} — ${c.data}` }), el('p', { texto: c.texto }));
  }

  let temporizador = null;
  botao.addEventListener('click', () => {
    clearTimeout(temporizador);
    const intervalo = reduzirMovimento() ? 0 : 900;
    pontos.forEach((p) => p.classList.add('apagado'));
    let i = 0;
    const passo = () => {
      const c = dados.cidades[i];
      pontos[i].classList.remove('apagado');
      mostrar(c, pontos[i]);
      ano.textContent = c.data;
      i += 1;
      if (i < pontos.length) temporizador = setTimeout(passo, intervalo);
      else { ano.textContent = `${dados.cidades[0].data} → ${c.data}`; }
    };
    passo();
  });
}
