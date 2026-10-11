import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizar, filtrarTermos, trechosDestacados } from '../../assets/js/modules/glossario-busca.js';

const { termos, categorias } = JSON.parse(readFileSync(new URL('../../assets/data/glossario.json', import.meta.url)));

test('normalizar remove acentos, símbolos e espaços extras e limita o tamanho', () => {
  assert.equal(normalizar('  Bactéria   PNEUMÔNICA '), 'bacteria pneumonica');
  assert.equal(normalizar('<script>alert(1)</script>'), 'script alert 1 script');
  assert.equal(normalizar('a'.repeat(200), 60).length, 60);
  assert.equal(normalizar('a'.repeat(200)).length, 200);
  assert.equal(normalizar(null), '');
});

test('contém os termos obrigatórios', () => {
  const nomes = termos.map((t) => t.termo);
  for (const t of ['Yersinia pestis', 'Peste bubônica', 'Peste pneumônica', 'Pandemia', 'Quarentena', 'Apotecário', 'Flagelante', 'Cirurgião-barbeiro', 'Vetor', 'Epidemiologia']) {
    assert.ok(nomes.includes(t), `falta ${t}`);
  }
  for (const t of termos) assert.ok(categorias.includes(t.categoria), `${t.termo}: categoria ${t.categoria}`);
});

test('a busca ignora acentos e maiúsculas e procura também na definição', () => {
  assert.ok(filtrarTermos(termos, 'BACTERIA').some((t) => t.termo === 'Bactéria'));
  assert.ok(filtrarTermos(termos, 'apotecario').some((t) => t.termo === 'Apotecário'));
  assert.ok(filtrarTermos(termos, '40 dias').some((t) => t.termo === 'Quarentena'));
});

test('termos que começam com a busca aparecem primeiro', () => {
  const r = filtrarTermos(termos, 'peste');
  assert.ok(r[0].termo.startsWith('Peste'));
});

test('o filtro por categoria funciona e combina com a busca', () => {
  const ciencia = filtrarTermos(termos, '', 'Ciência');
  assert.ok(ciencia.length > 0 && ciencia.every((t) => t.categoria === 'Ciência'));
  assert.equal(filtrarTermos(termos, 'flagelante', 'Ciência').length, 0);
  assert.equal(filtrarTermos(termos, 'xyzxyz').length, 0);
  assert.equal(filtrarTermos(termos, '').length, termos.length);
});

test('trechosDestacados marca as ocorrências preservando o texto original', () => {
  const partes = trechosDestacados('Bactéria e bacteriófago', 'bacteria');
  assert.equal(partes.map((p) => p.texto).join(''), 'Bactéria e bacteriófago');
  assert.deepEqual(partes.filter((p) => p.destaque).map((p) => p.texto), ['Bactéria']);
  assert.deepEqual(trechosDestacados('Pulga e pulgão', 'PULGA').filter((p) => p.destaque).map((p) => p.texto), ['Pulga', 'pulgã']);
  assert.deepEqual(trechosDestacados('abc', ''), [{ texto: 'abc', destaque: false }]);
});
