import { readFileSync } from 'node:fs';
import { test, expect, vigiar, CAMINHO_JSQR } from './ajuda.mjs';

test.describe('quiz', () => {
  async function jogarSessao(page, estrategia) {
    let acertosEsperados = 0;
    const ids = [];
    for (let i = 1; i <= 10; i++) {
      await expect(page.locator('[data-quiz-contador]')).toHaveText(`Pergunta ${i} de 10`);
      ids.push(await page.locator('#quiz-pergunta').textContent());
      const alternativas = page.locator('.alternativa');
      await expect(alternativas).toHaveCount(4);
      await alternativas.nth(estrategia(i)).click();
      await expect(page.locator('.feedback')).toBeVisible();
      if (await page.locator('.feedback--certo').count()) acertosEsperados++;
      // exatamente uma alternativa é marcada como correta, com texto além da cor
      await expect(page.locator('.alternativa--certa')).toHaveCount(1);
      await expect(page.locator('.alternativa--certa')).toContainText('Correta');
      await expect(alternativas.first()).toBeDisabled();
      await page.locator('[data-quiz-proximo]').click();
    }
    return { acertosEsperados, ids };
  }

  test('apresenta exatamente 10 perguntas, calcula a pontuação e reinicia com novas perguntas', async ({ page }) => {
    const v = vigiar(page);
    await page.goto('quiz.html');
    const primeira = await jogarSessao(page, () => 0);
    await expect(page.locator('[data-quiz-resultado]')).toBeVisible();
    await expect(page.locator('[data-quiz-placar]')).toHaveText(`${primeira.acertosEsperados} / 10`);
    expect(new Set(primeira.ids).size).toBe(10);

    await page.locator('[data-quiz-reiniciar]').click();
    const segunda = await jogarSessao(page, (i) => i % 4);
    await expect(page.locator('[data-quiz-placar]')).toHaveText(`${segunda.acertosEsperados} / 10`);
    // a segunda sessão usa perguntas que não saíram na primeira
    expect(segunda.ids.filter((p) => primeira.ids.includes(p))).toEqual([]);
    expect(v.problemas).toEqual([]);
  });

  test('a pontuação não pode ser alterada clicando de novo em outra alternativa', async ({ page }) => {
    await page.goto('quiz.html');
    await page.locator('.alternativa').first().click();
    const antes = await page.locator('.feedback').getAttribute('class');
    await page.locator('.alternativa').nth(1).click({ force: true });
    expect(await page.locator('.feedback').getAttribute('class')).toBe(antes);
    expect(await page.locator('.alternativa--errada').count()).toBeLessThanOrEqual(1);
  });

  test('o quiz pode ser respondido só com o teclado', async ({ page }) => {
    await page.goto('quiz.html');
    await expect(page.locator('#quiz-pergunta')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('.alternativa').first()).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-quiz-proximo]')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-quiz-contador]')).toHaveText('Pergunta 2 de 10');
  });
});

test.describe('glossário', () => {
  test('pesquisa por palavra, ignora acentos e filtra por categoria', async ({ page }) => {
    await page.goto('glossario.html');
    const termos = page.locator('.termo');
    await expect(termos.first()).toBeVisible();
    const total = await termos.count();
    expect(total).toBeGreaterThanOrEqual(10);

    await page.fill('#busca-termo', 'pulga');
    await expect(page.locator('[data-termo="Pulga"]')).toBeVisible();
    await expect(page.locator('[data-termo="Pulga"] mark').first()).toHaveText(/pulga/i);
    expect(await termos.count()).toBeLessThan(total);

    await page.fill('#busca-termo', 'bacteria');
    await expect(page.locator('[data-termo="Bactéria"]')).toBeVisible();

    await page.fill('#busca-termo', '');
    await page.locator('[data-categoria="Sociedade"]').click();
    await expect(page.locator('[data-categoria="Sociedade"]')).toHaveAttribute('aria-pressed', 'true');
    const categorias = await page.locator('.termo .selo').allTextContents();
    expect(categorias.length).toBeGreaterThan(0);
    expect(new Set(categorias)).toEqual(new Set(['Sociedade']));

    await page.locator('[data-categoria="todas"]').click();
    await page.fill('#busca-termo', 'zzzz');
    await expect(page.locator('[data-glossario-status]')).toContainText('Nenhum termo encontrado');
    await expect(termos).toHaveCount(0);
    await page.locator('[data-glossario-limpar]').click();
    await expect(termos).toHaveCount(total);
  });

  test('texto com HTML na busca é tratado como texto comum', async ({ page }) => {
    const v = vigiar(page);
    await page.goto('glossario.html?q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E');
    await expect(page.locator('#busca-termo')).toHaveValue('<img src=x onerror=alert(1)>');
    expect(await page.locator('.termos img').count()).toBe(0);
    expect(v.problemas).toEqual([]);
  });
});

test.describe('fontes', () => {
  test('lista as referências com título, autor, assunto e link externo seguro', async ({ page }) => {
    await page.goto('fontes.html');
    const refs = page.locator('.referencia');
    await expect(refs.first()).toBeVisible();
    expect(await refs.count()).toBeGreaterThanOrEqual(15);
    const links = page.locator('.referencia a');
    for (const link of await links.all()) {
      expect(await link.getAttribute('href')).toMatch(/^https:\/\//);
      expect(await link.getAttribute('rel')).toContain('noopener');
    }
  });
});

test.describe('QR Code', () => {
  test('o QR Code do jogo aparece e abre o endereço público do jogo', async ({ page, context }) => {
    const esperado = 'https://andevbr.github.io/peste_negra/jogos/jornada-medieval/';
    await page.goto('');
    const img = page.locator('[data-qr-codigo] img');
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((i) => i.complete && i.naturalWidth)).toBe(304);
    await expect(img).toHaveAttribute('alt', /QR Code do Jogo da Peste Negra/);
    await expect(page.locator('[data-qr-url]')).toHaveText(esperado.replace('https://', ''));
    await expect(page.locator('[data-qr-link]')).toHaveAttribute('href', 'jogos/jornada-medieval/');

    // decodifica o QR Code como a câmera do celular faria
    const png = await img.screenshot();
    const decodificador = await context.newPage();
    await decodificador.setContent('<canvas></canvas>');
    await decodificador.addScriptTag({ content: readFileSync(CAMINHO_JSQR, 'utf8') });
    const texto = await decodificador.evaluate(async (b64) => {
      const im = new Image(); im.src = `data:image/png;base64,${b64}`; await im.decode();
      const c = document.querySelector('canvas'); c.width = im.width; c.height = im.height;
      const g = c.getContext('2d'); g.drawImage(im, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height);
      return window.jsQR(d.data, d.width, d.height)?.data ?? null;
    }, png.toString('base64'));
    expect(texto).toBe(esperado);
  });
});

test.describe('jogo de tabuleiro', () => {
  test('abre a partir do site, inicia uma partida e lança o dado', async ({ page }) => {
    const v = vigiar(page);
    await page.goto('');
    await page.locator('.jogo__acoes').getByRole('link', { name: /Jogar agora/ }).click();
    await expect(page).toHaveURL(/jogos\/jornada-medieval\/$/);
    await expect(page).toHaveTitle(/Jornada Medieval/);
    await expect(page.locator('#menu')).toBeVisible();
    await page.locator('#m-botoes button').first().click();
    // passo 2: o jogador escolhe o personagem (são 10)
    await expect(page.locator('#m-lista .cartao')).toHaveCount(10);
    await page.locator('#m-lista .cartao').first().click();
    await expect(page.locator('#menu')).toBeHidden();
    await expect(page.locator('#tela')).toBeVisible();
    const box = await page.locator('#tela').boundingBox();
    expect(box.width).toBeGreaterThan(100);
    await page.locator('#lancar').click();
    await expect(page.locator('#ultimo')).toHaveText(/^[1-6]$/, { timeout: 5000 });
    // o jogo expõe sua API de testes: 60 casas + início e chegada, perguntas e cartas
    const info = await page.evaluate(() => ({ casas: window.jornada.CASAS.length, perguntas: window.jornada.PERGUNTAS.length, cartas: window.jornada.CARTAS.length }));
    expect(info).toEqual({ casas: 62, perguntas: info.perguntas, cartas: 25 });
    expect(info.perguntas).toBeGreaterThanOrEqual(30);
    // as cartas de Sorte ou Revés (arquivos externos, carregados sob demanda) aparecem
    await page.evaluate(() => { window.jornada.iniciar(1); window.jornada.proximaCarta = 'reves2'; window.jornada.ir(4); window.jornada.forcar.push(2); });
    await expect(page.locator('#lancar')).toBeEnabled({ timeout: 8000 });
    await page.locator('#lancar').click();
    await expect(page.locator('#carta')).toBeVisible({ timeout: 15000 });
    await expect.poll(() => page.locator('#c-img').evaluate((i) => i.complete && i.naturalWidth)).toBe(600);
    expect(v.problemas).toEqual([]);
    expect(v.externas).toEqual([]);
  });

  test('o jogo é leve o bastante para celulares (menos de 1 MB na abertura)', async ({ request }) => {
    const r = await request.get('jogos/jornada-medieval/');
    expect((await r.body()).length).toBeLessThan(1024 * 1024);
  });

  test('o jogo tem link de volta para o site', async ({ page }) => {
    await page.goto('jogos/jornada-medieval/');
    await page.locator('.m-voltar a').click();
    await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/);
    await expect(page.locator('#titulo-principal')).toBeVisible();
  });
});
