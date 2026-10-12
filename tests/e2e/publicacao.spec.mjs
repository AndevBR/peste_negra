// Simula a publicação no GitHub Pages: gera o build de produção com uma URL pública
// e serve o resultado em um subdiretório (/peste_negra/), como faz o GitHub Pages.
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { construir } from '../../scripts/build.mjs';
import { iniciarServidor } from '../../scripts/serve.mjs';
import { test, expect, vigiar, rolarTudo, semImagensQuebradas } from './ajuda.mjs';

const URL_PUBLICA = 'https://exemplo.github.io/peste_negra/';
let pasta, servidor, base;

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({}, info) => {
  pasta = mkdtempSync(join(tmpdir(), 'peste-pages-'));
  await construir({ url: URL_PUBLICA, saida: join(pasta, 'peste_negra') });
  const porta = 4300 + info.parallelIndex + (info.project.name === 'celular' ? 50 : 0);
  servidor = await iniciarServidor({ raiz: pasta, porta });
  base = `http://127.0.0.1:${porta}/peste_negra/`;
});

test.afterAll(async () => {
  servidor?.close();
  if (pasta) rmSync(pasta, { recursive: true, force: true });
});

for (const pagina of ['', 'quiz.html', 'glossario.html', 'fontes.html', 'jogos/jornada-medieval/']) {
  test(`build publicado em subdiretório: "${pagina || 'index.html'}" funciona`, async ({ page }) => {
    const v = vigiar(page);
    await page.goto(base + pagina);
    await rolarTudo(page);
    await semImagensQuebradas(page);
    expect(v.problemas).toEqual([]);
    expect(v.externas).toEqual([]);
  });
}

test('build publicado: QR Code do jogo presente e metadados são absolutos', async ({ page }) => {
  await page.goto(base);
  await expect(page.locator('[data-qr-codigo] img')).toHaveAttribute('src', 'assets/images/qr-jogo.webp');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', URL_PUBLICA);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${URL_PUBLICA}assets/images/og-image.jpg`);
  const robots = await page.request.get(base + 'robots.txt');
  expect(await robots.text()).toContain(`Sitemap: ${URL_PUBLICA}sitemap.xml`);
  expect((await page.request.get(base + 'sitemap.xml')).status()).toBe(200);
});

test('build publicado: a página 404 funciona em qualquer profundidade', async ({ page }) => {
  const v = vigiar(page);
  const r = await page.goto(base + 'uma/pasta/que/nao/existe');
  expect(r.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Página não encontrada');
  await semImagensQuebradas(page);
  // o único erro aceitável é o próprio 404 do endereço inexistente
  const esperado = (p) => p.endsWith('/uma/pasta/que/nao/existe') || p.includes('status of 404');
  expect(v.problemas.filter((p) => !esperado(p))).toEqual([]);
  expect(v.problemas.filter((p) => p.startsWith('HTTP')).length).toBe(1);
  await page.getByRole('link', { name: 'Voltar ao início' }).click();
  await expect(page).toHaveURL(base);
});
