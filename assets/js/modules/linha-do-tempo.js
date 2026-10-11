// Linha do tempo: marcos em um trilho rolável; cada marco abre um painel com a explicação completa.
import { el } from './dom.js';
import { carregarDados, mostrarErro, mapaDeFontes } from './dados.js';
import { abrirPainel, linhaDeFontes } from './painel.js';

export async function iniciarLinhaDoTempo(raiz) {
  const trilho = raiz.querySelector('[data-linha-trilho]');
  try {
    const [{ marcos }, fontes] = await Promise.all([carregarDados('linha-do-tempo'), mapaDeFontes()]);
    trilho.replaceChildren(...marcos.map((m) => el('li', { classe: 'linha__item' }, [
      el('button', {
        classe: 'cartao cartao--interativo linha__marco', type: 'button',
        'aria-haspopup': 'dialog', dados: { marco: m.id },
        onclick: () => abrirMarco(m, fontes),
      }, [
        el('span', { classe: 'linha__data', texto: m.data }),
        el('span', { classe: 'linha__titulo', texto: m.titulo }),
        el('span', { classe: 'linha__resumo', texto: m.resumo }),
        el('span', { classe: 'linha__mais', texto: 'Ler mais', 'aria-hidden': 'true' }),
      ]),
    ])));
    controles(raiz, trilho);
  } catch (erro) {
    mostrarErro(trilho, erro);
  }
}

function abrirMarco(m, fontes) {
  abrirPainel(`${m.data} — ${m.titulo}`, [
    el('p', {}, [el('span', { classe: 'selo', texto: m.categoria })]),
    ...m.detalhes.map((t) => el('p', { texto: t })),
    el('p', { classe: 'nota' }, [el('span', {}, [el('strong', { texto: 'Natureza da informação: ' }), m.natureza])]),
    linhaDeFontes(m.fontes, fontes),
  ]);
}

function controles(raiz, trilho) {
  const anterior = raiz.querySelector('[data-linha-anterior]');
  const proximo = raiz.querySelector('[data-linha-proximo]');
  const passo = () => Math.max(trilho.clientWidth * 0.8, 240);
  const atualizar = () => {
    anterior.disabled = trilho.scrollLeft <= 4;
    proximo.disabled = trilho.scrollLeft + trilho.clientWidth >= trilho.scrollWidth - 4;
  };
  anterior.addEventListener('click', () => trilho.scrollBy({ left: -passo(), behavior: 'smooth' }));
  proximo.addEventListener('click', () => trilho.scrollBy({ left: passo(), behavior: 'smooth' }));
  trilho.addEventListener('scroll', atualizar, { passive: true });
  window.addEventListener('resize', atualizar);
  // teclado: ao focar um marco fora da área visível, o navegador já rola o trilho
  atualizar();
}
