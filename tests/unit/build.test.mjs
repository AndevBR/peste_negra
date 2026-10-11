import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { construir, normalizarUrl, referenciasLocais } from '../../scripts/build.mjs';

test('normalizarUrl acrescenta a barra final e remove consulta e âncora', () => {
  assert.equal(normalizarUrl('https://x.github.io/peste_negra?a=1#b'), 'https://x.github.io/peste_negra/');
  assert.equal(normalizarUrl(''), '');
});

test('referenciasLocais ignora links externos, âncoras e data:', () => {
  const html = '<a href="https://x.com">x</a><img src="a.svg"><a href="#topo">t</a><img src="data:image/png;base64,AA"><a href="quiz.html?x=1#y">q</a>';
  assert.deepEqual(referenciasLocais(html).sort(), ['a.svg', 'quiz.html']);
});

test('o build com URL pública injeta QR, metadados, sitemap e robots', async () => {
  const pasta = mkdtempSync(join(tmpdir(), 'peste-build-'));
  try {
    const { destino } = await construir({ url: 'https://exemplo.github.io/peste_negra', saida: pasta });
    const config = readFileSync(join(destino, 'assets/js/config.js'), 'utf8');
    assert.match(config, /SITE_PUBLICO = 'https:\/\/exemplo\.github\.io\/peste_negra\/'/);
    const index = readFileSync(join(destino, 'index.html'), 'utf8');
    assert.match(index, /<link rel="canonical" href="https:\/\/exemplo\.github\.io\/peste_negra\/">/);
    assert.match(index, /og:image" content="https:\/\/exemplo\.github\.io\/peste_negra\/assets\/images\/og-image\.jpg"/);
    assert.ok(!index.includes('SEO:ABSOLUTO'));
    assert.match(readFileSync(join(destino, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/exemplo\.github\.io\/peste_negra\/sitemap\.xml/);
    assert.match(readFileSync(join(destino, 'sitemap.xml'), 'utf8'), /jogos\/jornada-medieval\//);
    assert.match(readFileSync(join(destino, '404.html'), 'utf8'), /<base href="\/peste_negra\/">/);
    assert.ok(existsSync(join(destino, 'jogos/jornada-medieval/index.html')));
    assert.ok(existsSync(join(destino, '.nojekyll')));
    assert.ok(!existsSync(join(destino, 'scripts')) && !existsSync(join(destino, 'node_modules')));
  } finally {
    rmSync(pasta, { recursive: true, force: true });
  }
});

test('o build recusa URL de localhost ou rede privada', async () => {
  await assert.rejects(construir({ url: 'http://localhost:8080/', saida: join(tmpdir(), 'nao-usar') }), /HTTPS público/);
  await assert.rejects(construir({ url: 'https://192.168.0.2/', saida: join(tmpdir(), 'nao-usar') }), /HTTPS público/);
});
