// Auditoria automática de acessibilidade (axe-core) com regras WCAG 2.0, 2.1 e 2.2 níveis A e AA.
// Ferramentas automáticas encontram parte dos problemas; a revisão manual continua necessária.
import AxeBuilder from '@axe-core/playwright';
import { test, expect, rolarTudo } from './ajuda.mjs';

const REGRAS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const pagina of ['', 'quiz.html', 'glossario.html', 'fontes.html', '404.html']) {
  test(`"${pagina || 'index.html'}" não tem violações WCAG A/AA detectáveis`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' }); // conteúdo visível sem esperar animações
    await page.goto(pagina);
    await rolarTudo(page);
    await page.waitForLoadState('networkidle');
    const resultado = await new AxeBuilder({ page }).withTags(REGRAS).analyze();
    const resumo = resultado.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
    expect(resumo).toEqual([]);
  });
}

test('painel modal aberto não tem violações', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('');
  await page.locator('[data-personagem="flagelante"]').click();
  const resultado = await new AxeBuilder({ page }).include('#painel').withTags(REGRAS).analyze();
  expect(resultado.violations.map((v) => v.id)).toEqual([]);
});

test('quiz respondido (feedback de acerto e erro) não tem violações', async ({ page }) => {
  await page.goto('quiz.html');
  await page.locator('.alternativa').first().click();
  const resultado = await new AxeBuilder({ page }).include('[data-quiz]').withTags(REGRAS).analyze();
  expect(resultado.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(',')}`)).toEqual([]);
});
