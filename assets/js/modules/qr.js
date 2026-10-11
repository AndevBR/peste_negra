// QR Code da seção "Leve a experiência com você".
// Gerado no navegador com a biblioteca qrcode-generator (MIT, incluída em assets/vendor).
import qrcode from '../../vendor/qrcode-generator/qrcode.mjs';
import { SITE_PUBLICO, QR_DESTINO } from '../config.js';
import { resolverEnderecoQr } from './qr-endereco.js';
import { el } from './dom.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

export function svgDoQr(texto, rotulo) {
  const qr = qrcode(0, 'M');
  qr.addData(texto);
  qr.make();
  const n = qr.getModuleCount(), margem = 4, lado = n + margem * 2;
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${lado} ${lado}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', rotulo);
  svg.setAttribute('shape-rendering', 'crispEdges');
  const fundo = document.createElementNS(SVG_NS, 'rect');
  fundo.setAttribute('width', lado); fundo.setAttribute('height', lado); fundo.setAttribute('fill', '#ffffff');
  let d = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.isDark(y, x)) d += `M${x + margem} ${y + margem}h1v1h-1z`;
  const modulos = document.createElementNS(SVG_NS, 'path');
  modulos.setAttribute('d', d); modulos.setAttribute('fill', '#1d1917');
  svg.append(fundo, modulos);
  return svg;
}

export function iniciarQr(raiz) {
  const caixa = raiz.querySelector('[data-qr-codigo]');
  const textoUrl = raiz.querySelector('[data-qr-url]');
  const link = raiz.querySelector('[data-qr-link]');
  const baseDoSite = new URL('../../../', import.meta.url).href; // raiz do site
  const { url, motivo } = resolverEnderecoQr(SITE_PUBLICO, location.href, baseDoSite, QR_DESTINO);
  caixa.dataset.qrEstado = motivo;
  if (!url) {
    caixa.replaceChildren(el('p', {
      classe: 'qr__pendente',
      texto: motivo === 'local'
        ? 'O QR Code será gerado quando o site estiver publicado em um endereço público (HTTPS). Em ambiente local ele fica desativado para não apontar para um endereço que só funciona neste computador.'
        : 'O endereço público configurado é inválido. Corrija SITE_PUBLICO em assets/js/config.js.',
    }));
    return;
  }
  caixa.replaceChildren(svgDoQr(url, `QR Code que abre ${url}`));
  caixa.dataset.qrUrl = url;
  textoUrl.textContent = url;
  link.href = url;
}
