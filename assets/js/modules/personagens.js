// Galeria de personagens: cada cartão abre um painel com contexto, limitações e curiosidades.
import { el } from './dom.js';
import { carregarDados, mostrarErro, mapaDeFontes } from './dados.js';
import { abrirPainel, linhaDeFontes } from './painel.js';

export async function iniciarPersonagens(lista) {
  try {
    const [{ personagens }, fontes] = await Promise.all([carregarDados('personagens'), mapaDeFontes()]);
    const ORIGEM = { jogo: 'Do jogo Jornada Medieval', arte: 'Reconstrução artística', sombra: 'Retrato em sombra' };
    lista.replaceChildren(...personagens.map((p, i) => el('li', { classe: i === 0 ? 'galeria__destaque' : null }, [
      el('button', {
        classe: 'cartao cartao--interativo personagem', type: 'button', 'aria-haspopup': 'dialog', dados: { personagem: p.id },
        onclick: () => abrirPersonagem(p, fontes),
      }, [
        el('span', { classe: `personagem__imagem${p.tipoImagem === 'sombra' ? ' personagem__imagem--cobrir' : ''}` }, [
          el('img', { src: p.imagem, alt: '', width: 240, height: 300, loading: 'lazy' }),
        ]),
        el('span', { classe: 'personagem__texto' }, [
          el('span', { classe: 'personagem__origem', texto: ORIGEM[p.tipoImagem] || '' }),
          el('span', { classe: 'personagem__nome', texto: p.nome }),
          el('span', { classe: 'personagem__resumo', texto: p.resumo }),
          el('span', { classe: 'linha__mais', texto: 'Conhecer', 'aria-hidden': 'true' }),
        ]),
      ]),
    ])));
  } catch (erro) {
    mostrarErro(lista, erro);
  }
}

function abrirPersonagem(p, fontes) {
  abrirPainel(p.nome, [
    el('p', {}, [el('span', { classe: 'selo', texto: p.periodo })]),
    el('img', { classe: 'dialogo__imagem', src: p.imagem, alt: '', width: 240, height: 300 }),
    ...p.contexto.map((t) => el('p', { texto: t })),
    el('h3', { texto: 'Limites da época' }),
    el('p', { texto: p.limitacoes }),
    el('h3', { texto: 'Curiosidades' }),
    el('ul', {}, p.curiosidades.map((c) => el('li', { texto: c }))),
    el('p', { classe: 'nota' }, [el('span', {}, [el('strong', { texto: 'Representação: ' }), `${p.estilizacao} ${p.legendaImagem ? `(${p.legendaImagem}.)` : ''}`])]),
    p.imagemJogo ? el('div', { classe: 'jogo-sprite' }, [
      el('img', { src: p.imagemJogo, alt: `${p.nome} como aparece no jogo Jornada Medieval`, width: 96, height: 150, loading: 'lazy' }),
      el('span', {}, ['Este personagem aparece no jogo ', el('a', { href: 'jogos/jornada-medieval/', texto: 'A Peste Negra — Jornada Medieval' }), '.']),
    ]) : null,
    linhaDeFontes(p.fontes, fontes),
  ]);
}
