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
    await expect(abertura).toHaveClass(/fase-5/, { timeout: 12000 });
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

  test('o vídeo da abertura toca e para no último quadro', async ({ page }) => {
    await page.goto('');
    const video = page.locator('.abertura__video');
    await expect(video).toHaveAttribute('src', /assets\/video\/abertura(-pequeno)?\.(mp4|webm)$/);
    expect(await video.evaluate((v) => v.loop)).toBe(false);
    await expect(video).toHaveCSS('pointer-events', 'none');
    // o vídeo avança e chega ao fim (fica parado no último quadro)
    await expect.poll(() => video.evaluate((v) => v.currentTime), { timeout: 8000 }).toBeGreaterThan(1);
    await expect.poll(() => video.evaluate((v) => v.ended), { timeout: 16000 }).toBe(true);
    // pular a abertura pausa o vídeo
    await page.getByRole('button', { name: 'Pular introdução' }).click();
    expect(await video.evaluate((v) => v.paused)).toBe(true);
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

  test('o som vem ligado; o visitante desliga e religa pelo botão', async ({ page }) => {
    await page.goto('');
    const video = page.locator('.abertura__video');
    const som = page.locator('[data-som]');
    await expect(som).toHaveAttribute('aria-pressed', 'true');
    await expect(som).toHaveAccessibleName('Desativar som');
    // se o navegador segurou o som, o primeiro toque fora do botão o libera
    await page.locator('.abertura__texto').click({ position: { x: 5, y: 5 }, force: true });
    await expect.poll(() => video.evaluate((v) => v.muted)).toBe(false);
    await som.click();
    await expect(som).toHaveAttribute('aria-pressed', 'false');
    await expect(som).toHaveAccessibleName('Ativar som');
    expect(await video.evaluate((v) => v.muted)).toBe(true);
    // clicar em outro lugar não religa o som desligado pelo visitante
    await page.locator('.abertura__texto').click({ position: { x: 5, y: 5 }, force: true });
    expect(await video.evaluate((v) => v.muted)).toBe(true);
    await som.click();
    await expect(som).toHaveAttribute('aria-pressed', 'true');
    expect(await video.evaluate((v) => v.muted)).toBe(false);
  });

  test('com redução de movimento mostra a cena final sem animação nem vídeo', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('');
    const abertura = page.locator('[data-abertura]');
    await expect(abertura).toHaveClass(/instantanea/);
    await expect(page.getByRole('button', { name: 'Descubra o que foi a Peste Negra' })).toBeFocused();
    // sem vídeo em movimento: aparece a imagem final, com o Doutor já parado
    const video = page.locator('.abertura__video');
    await expect(video).toHaveAttribute('poster', /abertura-fim\.webp$/);
    await page.waitForTimeout(1000);
    expect(await video.evaluate((v) => v.paused && !v.getAttribute('src'))).toBe(true);
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
    await page.goto('');
    const trilha = page.locator('#historia [data-trilha-rato]');
    await trilha.scrollIntoViewIfNeeded();
    const rato = trilha.locator('.rato').first();
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

  testSemAbertura('andam sem parar: ao sair por um lado, voltam andando para o outro', async ({ page }) => {
    await page.goto('');
    const trilha = page.locator('#historia [data-trilha-rato]');
    await trilha.scrollIntoViewIfNeeded();
    const rato = trilha.locator('.rato');
    await expect(rato).toHaveCount(1);
    await expect(rato).toHaveClass(/rato--(direita|esquerda)/);
    // a imagem do rato carrega e a animação de passos está rodando
    expect(await rato.evaluate((r) => getComputedStyle(r).animationName)).toBe('passo');
    // ao terminar a travessia, o mesmo rato troca de sentido e começa a voltar na hora
    const [antes, depois, rodando] = await rato.evaluate(async (r) => {
      const anda = () => r.getAnimations().find((a) => !(a instanceof CSSAnimation));
      const antes = r.className;
      anda().finish();
      await new Promise((ok) => setTimeout(ok, 100));
      return [antes, r.className, anda()?.playState];
    });
    expect(depois).not.toBe(antes);
    expect(rodando).toBe('running');
    await expect(trilha.locator('.rato')).toHaveCount(1);
  });

  testSemAbertura('ficam desativados com redução de movimento', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('');
    await expect(page.locator('#historia [data-trilha-rato]')).toBeHidden();
    await page.evaluate(() => document.getElementById('cotidiano').scrollIntoView());
    await page.waitForTimeout(1500);
    await expect(page.locator('.rato')).toHaveCount(0);
    await expect(page.locator('.trilha-rato--lateral')).toBeHidden();
  });
});
