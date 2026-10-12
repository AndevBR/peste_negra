// Abertura cinematográfica e elementos ambientais (ratos).
import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { test as testSemAbertura, vigiar } from './ajuda.mjs';

const test = base; // aqui a abertura NÃO é pulada automaticamente

test.describe('abertura cinematográfica', () => {
  test('mostra a sequência, o título e o botão, e leva ao site principal', async ({ page }) => {
    const v = vigiar(page);
    await page.goto('');
    const abertura = page.locator('[data-abertura]');
    await expect(abertura).toBeVisible();
    await expect(page.locator('body')).toHaveClass(/abertura-ativa/);
    // o conteúdo por trás fica inacessível enquanto a abertura está aberta
    expect(await page.locator('.pagina').evaluate((el) => el.inert)).toBe(true);
    // a sequência avança por fases até mostrar o botão principal
    await expect(abertura).toHaveClass(/fase-3/, { timeout: 6000 });
    const entrar = page.getByRole('button', { name: 'Descubra o que foi a Peste Negra' });
    await expect(entrar).toBeVisible();
    await expect(abertura).toHaveClass(/fase-5/, { timeout: 10000 });
    await expect(entrar).toHaveCSS('opacity', '1');
    await expect(abertura.locator('.abertura__titulo')).toContainText('A PESTE NEGRA');
    await entrar.click();
    await expect(abertura).toBeHidden({ timeout: 3000 });
    await expect(page.locator('body')).not.toHaveClass(/abertura-ativa/);
    expect(await page.locator('.pagina').evaluate((el) => el.inert)).toBe(false);
    await expect(page.locator('#titulo-principal')).toBeInViewport();
    await expect(page.locator('#titulo-principal')).toBeFocused();
    expect(v.problemas).toEqual([]);
  });

  test('pode ser pulada imediatamente pelo botão ou pela tecla Esc', async ({ page, context }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Pular introdução' }).click();
    await expect(page.locator('[data-abertura]')).toBeHidden();
    await expect(page.locator('#titulo-principal')).toBeFocused();

    const outra = await context.browser().newPage();
    await outra.goto(page.url());
    await expect(outra.locator('[data-abertura]')).toBeVisible();
    await outra.keyboard.press('Escape');
    await expect(outra.locator('[data-abertura]')).toBeHidden();
    await outra.close();
  });

  test('não se repete na mesma sessão, mas pode ser revista pelo menu', async ({ page, isMobile }) => {
    await page.goto('');
    await page.getByRole('button', { name: 'Pular introdução' }).click();
    await page.reload();
    await expect(page.locator('[data-abertura]')).toBeHidden();
    if (isMobile) await page.locator('.lateral__abrir').click();
    await page.getByRole('button', { name: 'Rever a abertura' }).click();
    await expect(page.locator('[data-abertura]')).toBeVisible();
  });

  test('não aparece quando o visitante chega por um link direto para uma seção', async ({ page }) => {
    await page.goto('#jogos');
    await expect(page.locator('[data-abertura]')).toBeHidden();
    await expect(page.locator('#titulo-jogos')).toBeInViewport();
  });

  test('não toca som sozinha; o som só é criado depois de o visitante ativar', async ({ page }) => {
    await page.addInitScript(() => {
      window.__contextosDeAudio = 0;
      const Original = window.AudioContext;
      window.AudioContext = class extends Original { constructor(...a) { super(...a); window.__contextosDeAudio++; } };
    });
    await page.goto('');
    await page.waitForTimeout(2500);
    expect(await page.evaluate(() => window.__contextosDeAudio)).toBe(0);
    expect(await page.locator('audio, video').count()).toBe(0);
    const som = page.locator('[data-som]');
    await expect(som).toHaveAttribute('aria-pressed', 'false');
    await som.click();
    await expect(som).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => window.__contextosDeAudio)).toBe(1);
    await som.click();
    await expect(som).toHaveAttribute('aria-pressed', 'false');
  });

  test('com redução de movimento mostra a cena final sem animação nem relâmpagos', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('');
    const abertura = page.locator('[data-abertura]');
    await expect(abertura).toHaveClass(/instantanea/);
    await expect(page.getByRole('button', { name: 'Descubra o que foi a Peste Negra' })).toBeFocused();
    await page.waitForTimeout(2000);
    await expect(abertura).not.toHaveClass(/relampago/);
  });

  test('os relâmpagos são clarões isolados (nunca mais de um por segundo)', async ({ page }) => {
    await page.goto('');
    const inicios = await page.evaluate(() => new Promise((ok) => {
      const raiz = document.querySelector('[data-abertura]');
      const marcas = [];
      let antes = false; // registra só o início de cada relâmpago (classe ausente → presente)
      new MutationObserver(() => { const agora = raiz.classList.contains('relampago'); if (agora && !antes) marcas.push(performance.now()); antes = agora; }).observe(raiz, { attributes: true, attributeFilter: ['class'] });
      setTimeout(() => ok(marcas), 9000);
    }));
    expect(inicios.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < inicios.length; i++) expect(inicios[i] - inicios[i - 1]).toBeGreaterThan(1000);
  });

  test('não tem violações de acessibilidade detectáveis', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('');
    const r = await new AxeBuilder({ page }).include('[data-abertura]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(r.violations.map((x) => `${x.id}: ${x.nodes.map((n) => n.target).join(',')}`)).toEqual([]);
  });
});

testSemAbertura.describe('ratos ambientais', () => {
  testSemAbertura('atravessam as faixas entre seções sem bloquear cliques', async ({ page }) => {
    await page.goto('?ratos=sempre');
    const trilha = page.locator('[data-trilha-rato]').first();
    await trilha.scrollIntoViewIfNeeded();
    const rato = page.locator('.rato').first();
    await expect(rato).toBeAttached({ timeout: 8000 });
    await expect(rato).toHaveCSS('pointer-events', 'none');
    await expect(trilha).toHaveCSS('pointer-events', 'none');
    expect(await rato.getAttribute('aria-hidden') ?? await trilha.getAttribute('aria-hidden')).toBe('true');
    // um clique no ponto onde está o rato atinge o que estiver por baixo, nunca o rato
    const caixa = await rato.boundingBox();
    if (caixa) {
      const alvo = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.className || '', { x: caixa.x + caixa.width / 2, y: caixa.y + caixa.height / 2 });
      expect(String(alvo)).not.toContain('rato');
    }
    // a faixa fica abaixo do conteúdo da seção (não atravessa textos nem botões)
    const secao = page.locator('#historia');
    const ultimoConteudo = await secao.locator('.mapa__aviso').boundingBox();
    const faixa = await trilha.boundingBox();
    expect(faixa.y).toBeGreaterThanOrEqual(ultimoConteudo.y + ultimoConteudo.height);
  });

  testSemAbertura('ficam desativados com redução de movimento', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('?ratos=sempre');
    await expect(page.locator('[data-trilha-rato]').first()).toBeHidden();
    await page.evaluate(() => document.getElementById('cotidiano').scrollIntoView());
    await page.waitForTimeout(1500);
    await expect(page.locator('.rato')).toHaveCount(0);
  });
});
