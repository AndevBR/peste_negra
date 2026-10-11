// Utilidades compartilhadas pelos testes de navegador.
import { expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';

export const PAGINAS = ['', 'quiz.html', 'glossario.html', 'fontes.html'];
export const CAMINHO_JSQR = fileURLToPath(new URL('../../node_modules/jsqr/dist/jsQR.js', import.meta.url));

/** Registra erros de console, erros de página, respostas >= 400 e requisições externas. */
export function vigiar(page) {
  const problemas = [];
  const externas = [];
  page.on('console', (m) => { if (m.type() === 'error') problemas.push(`console: ${m.text()}`); });
  page.on('pageerror', (e) => problemas.push(`pageerror: ${e.message}`));
  page.on('response', (r) => { if (r.status() >= 400) problemas.push(`HTTP ${r.status()}: ${r.url()}`); });
  page.on('request', (r) => {
    const url = new URL(r.url());
    if (!['127.0.0.1', 'localhost'].includes(url.hostname) && !url.protocol.startsWith('data')) externas.push(r.url());
  });
  return { problemas, externas };
}

/** Rola a página inteira para carregar imagens com lazy loading. */
export async function rolarTudo(page) {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
    window.scrollTo(0, 0);
  });
}

/** Verifica que todas as imagens visíveis carregaram (nenhuma imagem quebrada). */
export async function semImagensQuebradas(page) {
  await page.waitForLoadState('networkidle');
  const quebradas = await page.evaluate(() => [...document.images]
    .filter((img) => img.getAttribute('src')) // imagens ainda sem src (ex.: carta oculta do jogo) não contam
    .filter((img) => img.loading !== 'lazy' || img.complete)
    .filter((img) => !img.complete || img.naturalWidth === 0)
    .map((img) => img.currentSrc || img.src));
  expect(quebradas, 'imagens quebradas').toEqual([]);
}
