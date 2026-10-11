// Decide para qual endereço público o QR Code deve apontar (testado em tests/unit/qr.test.mjs).
// O QR Code só é gerado para endereços HTTPS públicos: nunca para localhost, IPs privados,
// arquivos locais ou ambientes de desenvolvimento.

const HOSTS_PRIVADOS = [
  /^localhost$/i, /\.localhost$/i, /\.local$/i, /\.internal$/i, /\.test$/i,
  /^127\./, /^10\./, /^192\.168\./, /^172\.(1[6-9]|2\d|3[01])\./, /^169\.254\./, /^0\./,
  /^\[?::1\]?$/, /^\[?f[cd][0-9a-f]{2}:/i, /^\[?fe80:/i,
];

export function enderecoEhPublico(url) {
  let u;
  try { u = new URL(url); } catch { return false; }
  if (u.protocol !== 'https:') return false;
  if (u.username || u.password) return false;
  return !HOSTS_PRIVADOS.some((r) => r.test(u.hostname));
}

/**
 * @param {string} configurado SITE_PUBLICO de config.js ('' = detectar)
 * @param {string} paginaAtual location.href
 * @param {string} baseDoSite URL da raiz do site (diretório de index.html)
 * @param {string} destino caminho relativo à raiz (ex.: 'jogos/jornada-medieval/')
 * @returns {{ url: string|null, motivo: string }}
 */
export function resolverEnderecoQr(configurado, paginaAtual, baseDoSite, destino = '') {
  const base = (configurado || '').trim() || baseDoSite;
  if (!configurado && !enderecoEhPublico(paginaAtual)) {
    return { url: null, motivo: 'local' };
  }
  let alvo;
  try { alvo = new URL(destino, base.endsWith('/') ? base : `${base}/`).href; } catch { return { url: null, motivo: 'invalido' }; }
  if (!enderecoEhPublico(alvo)) return { url: null, motivo: 'invalido' };
  return { url: alvo, motivo: configurado ? 'configurado' : 'detectado' };
}
