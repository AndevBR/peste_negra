// Painel modal reutilizável baseado em <dialog> (foco preso, Esc fecha e o foco
// volta para o elemento que abriu o painel).
import { el } from './dom.js';

let dialogo, titulo, corpo, origem = null;

function preparar() {
  if (dialogo) return true;
  dialogo = document.getElementById('painel');
  if (!dialogo) return false;
  titulo = document.getElementById('painel-titulo');
  corpo = document.getElementById('painel-corpo');
  dialogo.querySelector('[data-fechar]').addEventListener('click', fecharPainel);
  // clique no fundo escurecido fecha o painel
  dialogo.addEventListener('click', (evento) => { if (evento.target === dialogo) fecharPainel(); });
  dialogo.addEventListener('close', () => { if (origem && document.contains(origem)) origem.focus(); origem = null; });
  return true;
}

export function abrirPainel(textoTitulo, conteudo) {
  if (!preparar()) return;
  origem = document.activeElement;
  titulo.textContent = textoTitulo;
  corpo.replaceChildren(...conteudo);
  corpo.scrollTop = 0;
  if (typeof dialogo.showModal === 'function') dialogo.showModal();
  else dialogo.setAttribute('open', '');
  dialogo.querySelector('[data-fechar]').focus();
}

export function fecharPainel() {
  if (!dialogo) return;
  if (typeof dialogo.close === 'function') dialogo.close();
  else { dialogo.removeAttribute('open'); dialogo.dispatchEvent(new Event('close')); }
}

/** Parágrafo "Fontes: A; B" com links para a página de referências. */
export function linhaDeFontes(ids, fontes, prefixo = '') {
  if (!ids || !ids.length) {
    return el('p', { classe: 'dialogo__fontes', texto: 'Informação de caráter histórico geral, sem referência específica listada neste site.' });
  }
  const p = el('p', { classe: 'dialogo__fontes' }, ['Fontes: ']);
  ids.forEach((id, i) => {
    const f = fontes.get(id);
    if (!f) return;
    if (i) p.append('; ');
    p.append(el('a', { href: `${prefixo}fontes.html#${id}`, texto: f.autor.split(' — ')[0] }));
  });
  return p;
}
