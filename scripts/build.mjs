// Gera a versão de produção em dist/.
//
// Uso:
//   npm run build                                   → dist/ sem URL pública (QR detecta o endereço sozinho)
//   npm run build -- --url https://usuario.github.io/peste_negra/
//   SITE_URL=https://... npm run build
//
// Com a URL pública, o build também:
//   - preenche SITE_PUBLICO em assets/js/config.js (QR Code);
//   - adiciona link canônico e metadados Open Graph absolutos;
//   - gera sitemap.xml e robots.txt apontando para o sitemap;
//   - define <base> na página 404 (necessário para o GitHub Pages servir a 404 em qualquer subpasta).
// Em qualquer caso, verifica se todos os arquivos referenciados pelas páginas existem.
import { cp, mkdir, readFile, rm, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, relative, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { enderecoEhPublico } from '../assets/js/modules/qr-endereco.js';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const PAGINAS = ['index.html', 'quiz.html', 'glossario.html', 'fontes.html', '404.html'];
const ITENS = [...PAGINAS, 'site.webmanifest', 'assets', 'jogos'];
const NO_SITEMAP = ['', 'quiz.html', 'glossario.html', 'fontes.html', 'jogos/jornada-medieval/'];

function lerArgumentos(argv) {
  const args = { url: process.env.SITE_URL || '', saida: 'dist' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--url') args.url = argv[++i] || '';
    else if (argv[i] === '--saida') args.saida = argv[++i] || 'dist';
  }
  return args;
}

export function normalizarUrl(url) {
  if (!url) return '';
  const u = new URL(url);
  if (!u.pathname.endsWith('/')) u.pathname += '/';
  u.search = ''; u.hash = '';
  return u.href;
}

const escaparAtributo = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function metadadosAbsolutos(html, pagina, url) {
  const caminho = pagina === 'index.html' ? '' : pagina;
  const canonica = new URL(caminho, url).href;
  const imagem = new URL('assets/images/og-image.jpg', url).href;
  const tags = [
    pagina === '404.html' ? '' : `<link rel="canonical" href="${escaparAtributo(canonica)}">`,
    `<meta property="og:url" content="${escaparAtributo(canonica)}">`,
    `<meta property="og:image" content="${escaparAtributo(imagem)}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta name="twitter:image" content="${escaparAtributo(imagem)}">`,
  ].filter(Boolean).join('\n  ');
  return html.replace('<!-- SEO:ABSOLUTO -->', tags);
}

/** Extrai referências locais (src, href) de um HTML. */
export function referenciasLocais(html) {
  const refs = new Set();
  for (const m of html.matchAll(/\s(?:src|href)="([^"]+)"/g)) {
    const v = m[1];
    if (/^(?:[a-z]+:|\/\/|#|data:)/i.test(v)) continue;
    refs.add(v.split('#')[0].split('?')[0]);
  }
  refs.delete('');
  return [...refs];
}

async function listarArquivos(dir) {
  const saida = [];
  for (const nome of await readdir(dir)) {
    const caminho = join(dir, nome);
    if ((await stat(caminho)).isDirectory()) saida.push(...await listarArquivos(caminho));
    else saida.push(caminho);
  }
  return saida;
}

export async function construir({ url = '', saida = 'dist' } = {}) {
  const urlPublica = normalizarUrl(url);
  if (urlPublica && !enderecoEhPublico(urlPublica)) {
    throw new Error(`A URL "${urlPublica}" não é um endereço HTTPS público. O QR Code não deve apontar para localhost ou redes privadas.`);
  }
  const destino = resolve(RAIZ, saida);
  await rm(destino, { recursive: true, force: true });
  await mkdir(destino, { recursive: true });
  for (const item of ITENS) await cp(join(RAIZ, item), join(destino, item), { recursive: true });
  await writeFile(join(destino, '.nojekyll'), '');

  for (const pagina of PAGINAS) {
    const arquivo = join(destino, pagina);
    let html = await readFile(arquivo, 'utf8');
    html = urlPublica ? metadadosAbsolutos(html, pagina, urlPublica) : html.replace('<!-- SEO:ABSOLUTO -->\n', '');
    if (pagina === '404.html' && urlPublica) {
      html = html.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n  <base href="${escaparAtributo(new URL(urlPublica).pathname)}">`);
    }
    await writeFile(arquivo, html);
  }

  const configArq = join(destino, 'assets/js/config.js');
  if (urlPublica) {
    const config = await readFile(configArq, 'utf8');
    const novo = config.replace(/export const SITE_PUBLICO = '[^']*';/, `export const SITE_PUBLICO = '${urlPublica.replace(/'/g, '%27')}';`);
    if (novo === config) throw new Error('Não encontrei SITE_PUBLICO em assets/js/config.js.');
    await writeFile(configArq, novo);
    const hoje = new Date().toISOString().slice(0, 10);
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${NO_SITEMAP.map((c) => `  <url><loc>${new URL(c, urlPublica).href}</loc><lastmod>${hoje}</lastmod></url>`).join('\n')}\n</urlset>\n`;
    await writeFile(join(destino, 'sitemap.xml'), sitemap);
    await writeFile(join(destino, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', urlPublica).href}\n`);
  } else {
    await writeFile(join(destino, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  }

  // verificações: JSON válido e nenhuma referência local quebrada
  const problemas = [];
  for (const arq of (await listarArquivos(join(destino, 'assets/data'))).filter((a) => a.endsWith('.json'))) {
    try { JSON.parse(await readFile(arq, 'utf8')); } catch (e) { problemas.push(`JSON inválido: ${relative(destino, arq)} (${e.message})`); }
  }
  for (const pagina of PAGINAS) {
    const html = await readFile(join(destino, pagina), 'utf8');
    for (const ref of referenciasLocais(html)) {
      if (pagina === '404.html' && urlPublica) continue; // usa <base>; verificada pelas outras páginas
      const alvo = join(destino, dirname(pagina), decodeURI(ref));
      const existe = existsSync(alvo) && ((await stat(alvo)).isFile() || existsSync(join(alvo, 'index.html')));
      if (!existe && !ref.startsWith('./#') && ref !== './') problemas.push(`${pagina}: referência quebrada "${ref}"`);
    }
  }
  // imagens citadas nos dados (personagens)
  const { personagens } = JSON.parse(await readFile(join(destino, 'assets/data/personagens.json'), 'utf8'));
  for (const p of personagens) for (const img of [p.imagem, p.imagemJogo].filter(Boolean)) {
    if (!existsSync(join(destino, img))) problemas.push(`personagens.json: imagem ausente "${img}"`);
  }
  if (problemas.length) throw new Error('Problemas encontrados no build:\n- ' + problemas.join('\n- '));

  const arquivos = await listarArquivos(destino);
  return { destino, urlPublica, arquivos: arquivos.map((a) => posix.normalize(relative(destino, a).split('\\').join('/'))) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = lerArgumentos(process.argv.slice(2));
  construir(args)
    .then(({ destino, urlPublica, arquivos }) => {
      console.log(`✔ Build concluído em ${relative(process.cwd(), destino) || destino} (${arquivos.length} arquivos).`);
      console.log(urlPublica ? `  URL pública: ${urlPublica}` : '  Sem URL pública: o QR Code detectará o endereço quando publicado em HTTPS.');
    })
    .catch((erro) => { console.error('✖', erro.message); process.exit(1); });
}
