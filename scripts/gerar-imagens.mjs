// Gera imagens raster a partir das ilustrações SVG e do próprio jogo, usando o Chromium do Playwright:
// - assets/images/games/jornada-capa.webp  (captura real do jogo)
// - assets/images/og-image.jpg              (imagem de compartilhamento 1200x630)
// - assets/images/icons/favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png
//
// Uso: npm run images   (requer as dependências de desenvolvimento instaladas)
import { chromium } from '@playwright/test';
import { iniciarServidor } from './serve.mjs';

const PORTA = 8199;
const BASE = `http://127.0.0.1:${PORTA}/`;
const servidor = await iniciarServidor({ raiz: '.', porta: PORTA });
const navegador = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

async function capturar(pagina, caminho, opcoes = {}) {
  await pagina.screenshot({ path: caminho, ...opcoes });
  console.log('✔', caminho);
}

try {
  // capa do jogo: inicia uma partida de 1 jogador e captura o tabuleiro
  const jogo = await navegador.newPage({ viewport: { width: 960, height: 600 }, deviceScaleFactor: 1 });
  await jogo.goto(`${BASE}jogos/jornada-medieval/`);
  await jogo.click('#m-botoes button');
  await jogo.waitForTimeout(1500);
  const png = await jogo.screenshot();
  const conversor = await navegador.newPage({ viewport: { width: 960, height: 600 } });
  await conversor.goto(BASE);
  const webp = await conversor.evaluate(async (base64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${base64}`;
    await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    return c.toDataURL('image/webp', 0.82).split(',')[1];
  }, png.toString('base64'));
  const { writeFileSync } = await import('node:fs');
  writeFileSync('assets/images/games/jornada-capa.webp', Buffer.from(webp, 'base64'));
  console.log('✔ assets/images/games/jornada-capa.webp');

  // imagem de compartilhamento (Open Graph)
  const og = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
  await og.goto(BASE + 'scripts/og-modelo.html');
  await og.waitForTimeout(600);
  await capturar(og, 'assets/images/og-image.jpg', { type: 'jpeg', quality: 84 });

  // ícones
  for (const [lado, nome] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'icon-512.png']]) {
    const p = await navegador.newPage({ viewport: { width: lado, height: lado } });
    await p.goto(BASE + 'assets/images/icons/favicon.svg');
    await capturar(p, `assets/images/icons/${nome}`, { omitBackground: true });
  }
} finally {
  await navegador.close();
  servidor.close();
}
