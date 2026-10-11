import { test, expect } from '@playwright/test';
import { PAGINAS, vigiar, rolarTudo, semImagensQuebradas } from './ajuda.mjs';

test.describe('carregamento e integridade', () => {
  for (const pagina of PAGINAS) {
    test(`"${pagina || 'index.html'}" carrega sem erros, sem imagens quebradas e sem recursos externos`, async ({ page }) => {
      const v = vigiar(page);
      await page.goto(pagina);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('footer')).toContainText('Criado por Anderson Carapeto © 2026');
      await rolarTudo(page);
      await semImagensQuebradas(page);
      await page.waitForTimeout(300);
      expect(v.problemas).toEqual([]);
      expect(v.externas, 'o site não deve depender de recursos externos').toEqual([]);
    });
  }

  test('todos os links internos respondem com sucesso', async ({ page, request }) => {
    const links = new Set();
    for (const pagina of PAGINAS) {
      await page.goto(pagina);
      const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.href));
      hrefs.filter((h) => h.startsWith(new URL(page.url()).origin)).forEach((h) => links.add(h.split('#')[0]));
    }
    expect(links.size).toBeGreaterThan(4);
    for (const link of links) {
      const r = await request.get(link);
      expect(r.status(), link).toBe(200);
    }
  });

  test('âncoras internas da página inicial apontam para seções existentes', async ({ page }) => {
    await page.goto('');
    const alvos = await page.$$eval('a[href^="#"], a[href^="./#"]', (as) => as.map((a) => a.getAttribute('href').replace('./', '')));
    for (const alvo of new Set(alvos)) {
      if (alvo === '#') continue;
      await expect(page.locator(alvo), alvo).toHaveCount(1);
    }
  });

  test('a página 404 é exibida para endereços inexistentes', async ({ page }) => {
    const r = await page.goto('nao-existe.html');
    expect(r.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText('Página não encontrada');
  });

  test('metadados de SEO e acessibilidade estão presentes', async ({ page }) => {
    await page.goto('');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page).toHaveTitle(/Peste Negra/);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toMatch(/Peste Negra/);
    expect(await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content')).toContain("script-src 'self'");
    await expect(page.locator('h1')).toHaveCount(1);
    // toda imagem tem atributo alt (vazio para imagens decorativas)
    expect(await page.locator('img:not([alt])').count()).toBe(0);
  });
});

test.describe('página inicial', () => {
  test('o Doutor da Peste aparece na abertura com os botões principais', async ({ page }) => {
    await page.goto('');
    await expect(page.locator('.hero__doutor img')).toBeVisible();
    await expect(page.getByRole('link', { name: /Explorar a história/ })).toBeInViewport();
    await expect(page.getByRole('link', { name: /Jogar agora/ }).first()).toBeInViewport();
  });

  test('"Explorar a história" leva à seção de história e "Jogar agora" à área de jogos', async ({ page }) => {
    await page.goto('');
    await page.getByRole('link', { name: /Explorar a história/ }).click();
    await expect(page).toHaveURL(/#historia$/);
    await expect(page.locator('#titulo-historia')).toBeInViewport();
    await page.goto('');
    await page.locator('.hero__acoes').getByRole('link', { name: /Jogar agora/ }).click();
    await expect(page).toHaveURL(/#jogos$/);
    await expect(page.locator('#titulo-jogos')).toBeInViewport();
  });

  test('a linha do tempo abre a explicação de cada marco', async ({ page }) => {
    await page.goto('');
    const marcos = page.locator('[data-marco]');
    await expect(marcos).toHaveCount(16);
    await page.locator('[data-marco="ragusa"]').click();
    const dialogo = page.locator('#painel');
    await expect(dialogo).toBeVisible();
    await expect(dialogo.locator('h2')).toHaveText('1377 — Nasce a quarentena');
    await expect(dialogo).toContainText('quaranta giorni');
    await page.keyboard.press('Escape');
    await expect(dialogo).toBeHidden();
    await expect(page.locator('[data-marco="ragusa"]')).toBeFocused();
  });

  test('os botões de navegação da linha do tempo rolam o trilho', async ({ page }) => {
    await page.goto('');
    const trilho = page.locator('[data-linha-trilho]');
    await expect(page.locator('[data-marco]').first()).toBeVisible();
    const anterior = page.locator('[data-linha-anterior]');
    await expect(anterior).toBeDisabled();
    await page.locator('[data-linha-proximo]').click();
    await expect.poll(() => trilho.evaluate((t) => t.scrollLeft)).toBeGreaterThan(0);
    await expect(anterior).toBeEnabled();
  });

  test('cada cartão de personagem abre o conteúdo correto', async ({ page }) => {
    await page.goto('');
    const cartoes = page.locator('[data-personagem]');
    await expect(cartoes).toHaveCount(10);
    const ids = await cartoes.evaluateAll((els) => els.map((e) => e.dataset.personagem));
    for (const id of ids) {
      const cartao = page.locator(`[data-personagem="${id}"]`);
      const nome = (await cartao.locator('.personagem__nome').textContent()).trim();
      await cartao.click();
      await expect(page.locator('#painel h2')).toHaveText(nome);
      await expect(page.locator('#painel')).toContainText('Limites da época');
      await page.locator('#painel [data-fechar]').click();
      await expect(page.locator('#painel')).toBeHidden();
    }
  });

  test('mitos e verdades revela a resposta com texto, não só com cor', async ({ page }) => {
    await page.goto('');
    const mito = page.locator('[data-mito="mascaras"]');
    const botao = mito.getByRole('button', { name: /Revelar resposta/ });
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await botao.click();
    await expect(mito.locator('.veredito')).toHaveText('Mito');
    await expect(mito).toContainText('século XVII');
    await expect(mito.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  test('as abas da vida cotidiana funcionam com mouse e teclado', async ({ page }) => {
    await page.goto('');
    await page.getByRole('tab', { name: 'Mercados e comércio' }).click();
    await expect(page.locator('#painel-mercado')).toBeVisible();
    await expect(page.locator('#painel-moradias')).toBeHidden();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Alimentação' })).toBeFocused();
    await expect(page.locator('#painel-alimentacao')).toBeVisible();
    await page.keyboard.press('End');
    await expect(page.locator('#painel-familias')).toBeVisible();
  });

  test('o mapa mostra informações da cidade escolhida e anima a disseminação', async ({ page, isMobile }) => {
    await page.goto('');
    await page.locator('[data-cidade-lista="messina"]').click();
    await expect(page.locator('[data-mapa-info]')).toContainText('Messina — Outubro de 1347');
    await expect(page.locator('[data-cidade-lista="messina"]')).toHaveAttribute('aria-pressed', 'true');
    if (!isMobile) {
      await page.locator('[data-cidade="paris"]').click();
      await expect(page.locator('[data-mapa-info]')).toContainText('Paris — Verão de 1348');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('[data-mapa-animar]').click();
    await expect(page.locator('[data-mapa-info]')).toContainText('Novgorod');
  });
});

test.describe('navegação e responsividade', () => {
  test('o menu móvel abre e fecha', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'apenas no celular');
    await page.goto('');
    const botao = page.locator('.nav__botao');
    await expect(page.locator('#menu-principal a').first()).toBeHidden();
    await botao.click();
    await expect(botao).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#menu-principal').getByRole('link', { name: 'Personagens' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await expect(botao).toBeFocused();
    await botao.click();
    await page.locator('#menu-principal').getByRole('link', { name: 'Personagens' }).click();
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
    await expect(page).toHaveURL(/#personagens$/);
  });

  test('no computador o menu fica sempre visível', async ({ page, isMobile }) => {
    test.skip(isMobile, 'apenas no computador');
    await page.goto('');
    await expect(page.locator('.nav__botao')).toBeHidden();
    await expect(page.locator('#menu-principal').getByRole('link', { name: 'Linha do tempo' })).toBeVisible();
  });

  for (const pagina of PAGINAS) {
    test(`"${pagina || 'index.html'}" não tem rolagem horizontal`, async ({ page }) => {
      await page.goto(pagina);
      await rolarTudo(page);
      const [rolagem, janela] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
      expect(rolagem).toBeLessThanOrEqual(janela);
    });
  }

  test('a navegação por teclado começa pelo link "Pular para o conteúdo" e tem foco visível', async ({ page }) => {
    await page.goto('');
    await page.keyboard.press('Tab');
    const pular = page.getByRole('link', { name: 'Pular para o conteúdo' });
    await expect(pular).toBeFocused();
    await expect(pular).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#conteudo$/);
    // o próximo elemento focável recebe contorno de foco
    await page.locator('[data-marco]').first().focus();
    const contorno = await page.locator('[data-marco]').first().evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(contorno).not.toBe('none');
  });

  test('com redução de movimento, o conteúdo aparece sem animação', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('');
    await expect(page.locator('#historia .revelar').first()).toHaveCSS('opacity', '1');
  });
});
