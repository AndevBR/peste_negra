// Servidor estático mínimo para desenvolvimento e testes (sem dependências).
// Uso: npm start            → http://localhost:8080
//      PORT=3000 npm start
//      node scripts/serve.mjs dist   (serve a pasta gerada pelo build)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.webmanifest': 'application/manifest+json',
};

export function iniciarServidor({ raiz = '.', porta = 8080, host = '127.0.0.1' } = {}) {
  const base = resolve(raiz);
  const servidor = createServer(async (req, res) => {
    try {
      const caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let arquivo = normalize(join(base, caminho));
      if (arquivo !== base && !arquivo.startsWith(base + sep)) { res.writeHead(403).end('Proibido'); return; }
      let info = await stat(arquivo).catch(() => null);
      if (info?.isDirectory()) {
        if (!caminho.endsWith('/')) { res.writeHead(301, { Location: caminho + '/' }).end(); return; }
        arquivo = join(arquivo, 'index.html'); info = await stat(arquivo).catch(() => null);
      }
      if (!info) {
        // como no GitHub Pages: usa o 404.html mais próximo do caminho pedido (site em subdiretório)
        let pagina404 = 'Não encontrado';
        for (let dir = dirname(arquivo); dir.startsWith(base); dir = dirname(dir)) {
          const conteudo = await readFile(join(dir, '404.html')).catch(() => null);
          if (conteudo) { pagina404 = conteudo; break; }
          if (dir === base) break;
        }
        res.writeHead(404, { 'Content-Type': TIPOS['.html'] }).end(pagina404); return;
      }
      res.writeHead(200, {
        'Content-Type': TIPOS[extname(arquivo).toLowerCase()] || 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache',
      });
      res.end(await readFile(arquivo));
    } catch (erro) {
      res.writeHead(500).end('Erro interno');
      console.error(erro);
    }
  });
  return new Promise((ok) => servidor.listen(porta, host, () => ok(servidor)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const raiz = process.argv[2] || '.';
  const porta = Number(process.env.PORT) || 8080;
  iniciarServidor({ raiz, porta }).then(() => console.log(`Servindo "${raiz}" em http://localhost:${porta}/  (Ctrl+C para parar)`));
}
