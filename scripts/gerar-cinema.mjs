// Rasteriza a arte cinematográfica (scripts/arte/cinema.mjs) em WebP, em dois tamanhos.
// Uso: npm run cinema   (requer as dependências de desenvolvimento instaladas)
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { ceu, rua, doutor, ratoQuadro, LARG, ALT, DOUTOR_VB, RATO } from './arte/cinema.mjs';

const SAIDA = new URL('../assets/images/cinema/', import.meta.url);
mkdirSync(SAIDA, { recursive: true });
const navegador = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

async function rasterizar(nome, svg, largura, altura, qualidade = 0.82) {
  const pagina = await navegador.newPage({ viewport: { width: largura, height: altura } });
  const fundo = 'background:transparent';
  await pagina.setContent(`<html><body style="margin:0;${fundo}"><img id="i" style="display:block;width:${largura}px;height:${altura}px" src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"></body></html>`);
  await pagina.waitForFunction(() => document.getElementById('i').complete);
  await pagina.waitForTimeout(300);
  const png = await pagina.screenshot({ omitBackground: true });
  const webp = await pagina.evaluate(async ({ b64, q }) => {
    const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    return c.toDataURL('image/webp', q).split(',')[1];
  }, { b64: png.toString('base64'), q: qualidade });
  const buf = Buffer.from(webp, 'base64');
  writeFileSync(new URL(nome, SAIDA), buf);
  console.log('✔', nome, `${(buf.length / 1024).toFixed(0)} KB`);
  await pagina.close();
}

try {
  for (const v of ['noite', 'relampago']) {
    await rasterizar(`ceu-${v}.webp`, ceu(v), LARG, ALT, 0.7);
    await rasterizar(`ceu-${v}-pequeno.webp`, ceu(v), 1280, 720, 0.7);
    await rasterizar(`rua-${v}.webp`, rua(v), LARG, ALT, 0.8);
    await rasterizar(`rua-${v}-pequeno.webp`, rua(v), 1280, 720, 0.8);
  }
  for (const v of ['silhueta', 'luz']) {
    await rasterizar(`doutor-${v}.webp`, doutor(v), DOUTOR_VB.w, DOUTOR_VB.h, 0.86);
    await rasterizar(`doutor-${v}-pequeno.webp`, doutor(v), 320, 560, 0.86);
  }
  // folha de quadros do rato (6 quadros lado a lado, em 2x para telas de alta densidade)
  const quadros = Array.from({ length: RATO.quadros }, (_, i) => ratoQuadro(i));
  const folha = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${RATO.w * RATO.quadros} ${RATO.h}">${quadros.map((q, i) => `<image x="${i * RATO.w}" y="0" width="${RATO.w}" height="${RATO.h}" href="data:image/svg+xml;base64,${Buffer.from(q).toString('base64')}"/>`).join('')}</svg>`;
  await rasterizar('rato-quadros.webp', folha, RATO.w * RATO.quadros * 0.8, RATO.h * 0.8, 0.85);
} finally {
  await navegador.close();
}
