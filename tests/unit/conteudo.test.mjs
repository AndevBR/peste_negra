// Integridade do conteúdo: referências existentes, campos obrigatórios e temas exigidos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const ler = (n) => JSON.parse(readFileSync(new URL(`../../assets/data/${n}.json`, import.meta.url)));
const raiz = new URL('../../', import.meta.url);
const { fontes } = ler('fontes');
const idsFontes = new Set(fontes.map((f) => f.id));

test('todas as fontes têm título, autor, assunto e endereço HTTPS', () => {
  assert.equal(idsFontes.size, fontes.length, 'ids de fontes repetidos');
  for (const f of fontes) {
    for (const campo of ['titulo', 'autor', 'assunto', 'tipo', 'ano']) assert.ok(f[campo], `${f.id}: falta ${campo}`);
    assert.match(f.url, /^https:\/\/[^\s]+$/, f.id);
  }
});

test('o conteúdo cita apenas fontes cadastradas', () => {
  const citacoes = [
    ...ler('linha-do-tempo').marcos.flatMap((m) => m.fontes.map((id) => [m.id, id])),
    ...ler('personagens').personagens.flatMap((p) => p.fontes.map((id) => [p.id, id])),
    ...ler('mitos').afirmacoes.flatMap((a) => a.fontes.map((id) => [a.id, id])),
    ...ler('quiz').questoes.flatMap((q) => q.fontes.map((id) => [q.id, id])),
    ...ler('mapa').fontes.map((id) => ['mapa', id]),
  ];
  for (const [origem, id] of citacoes) assert.ok(idsFontes.has(id), `${origem} cita fonte inexistente "${id}"`);
});

test('a linha do tempo tem marcos completos', () => {
  const { marcos } = ler('linha-do-tempo');
  assert.ok(marcos.length >= 10);
  for (const m of marcos) for (const c of ['id', 'data', 'titulo', 'resumo', 'categoria', 'natureza']) assert.ok(m[c], `${m.id}: ${c}`);
  for (const m of marcos) assert.ok(m.detalhes.length > 0, m.id);
});

test('a galeria inclui os personagens obrigatórios, com imagens existentes', () => {
  const { personagens } = ler('personagens');
  const ids = personagens.map((p) => p.id);
  for (const id of ['doutor-da-peste', 'flagelante', 'erveira', 'cirurgiao-barbeiro', 'medico-universitario', 'apotecario', 'cuidadora', 'religioso', 'comerciante', 'coveiro']) {
    assert.ok(ids.includes(id), `falta ${id}`);
  }
  for (const p of personagens) {
    assert.ok(existsSync(new URL(p.imagem, raiz)), `${p.id}: ${p.imagem}`);
    if (p.imagemJogo) assert.ok(existsSync(new URL(p.imagemJogo, raiz)), `${p.id}: ${p.imagemJogo}`);
    assert.ok(p.estilizacao && p.limitacoes && p.curiosidades.length, p.id);
  }
});

test('mitos e verdades inclui as afirmações exigidas e vereditos válidos', () => {
  const { afirmacoes } = ler('mitos');
  const textos = afirmacoes.map((a) => a.afirmacao);
  for (const trecho of ['causada por uma bactéria', 'sempre usavam máscaras com bico', 'conhecia os mecanismos', 'Todas as regiões europeias', 'desapareceu completamente']) {
    assert.ok(textos.some((t) => t.includes(trecho)), `falta afirmação: ${trecho}`);
  }
  for (const a of afirmacoes) assert.ok(['verdade', 'mito', 'em parte'].includes(a.veredito), a.id);
});

test('as cidades do mapa estão dentro da área desenhada', () => {
  const mapa = ler('mapa');
  for (const c of mapa.cidades) {
    assert.ok(c.x >= 0 && c.x <= mapa.largura && c.y >= 0 && c.y <= mapa.altura, c.id);
  }
});
