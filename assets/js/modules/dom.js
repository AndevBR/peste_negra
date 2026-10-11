// Utilidades de DOM. Todo texto é inserido com textContent (nunca innerHTML),
// o que impede a injeção de HTML a partir dos arquivos de dados.

const ICONES = new URL('../../images/icons/icones.svg', import.meta.url).pathname;
const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Cria um elemento.
 * @param {string} tag
 * @param {Record<string, any>} [atributos] — `classe`, `texto`, `dados` (dataset) e atributos comuns
 * @param {(Node|string|null|undefined|false)[]} [filhos]
 */
export function el(tag, atributos = {}, filhos = []) {
  const no = document.createElement(tag);
  for (const [chave, valor] of Object.entries(atributos)) {
    if (valor === undefined || valor === null || valor === false) continue;
    if (chave === 'classe') no.className = valor;
    else if (chave === 'texto') no.textContent = valor;
    else if (chave === 'dados') Object.assign(no.dataset, valor);
    else if (chave.startsWith('on') && typeof valor === 'function') no.addEventListener(chave.slice(2), valor);
    else no.setAttribute(chave, valor === true ? '' : String(valor));
  }
  for (const filho of [].concat(filhos)) {
    if (filho === null || filho === undefined || filho === false) continue;
    no.append(filho instanceof Node ? filho : document.createTextNode(String(filho)));
  }
  return no;
}

/** Ícone do sprite assets/images/icons/icones.svg */
export function icone(nome) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'icone');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `${ICONES}#${nome}`);
  svg.append(use);
  return svg;
}

export function limpar(no) {
  while (no.firstChild) no.firstChild.remove();
}

export const reduzirMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
