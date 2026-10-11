import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  embaralhar, validarBanco, sortearQuestoes, prepararQuestao, criarSessao,
  questaoAtual, responder, avancar, terminou, pontuacao,
} from '../../assets/js/modules/quiz-motor.js';

const banco = JSON.parse(readFileSync(new URL('../../assets/data/quiz.json', import.meta.url)));
// gerador pseudoaleatório determinístico (mulberry32) para testes reproduzíveis
const semente = (s) => () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

test('o banco real é válido, tem pelo menos 30 questões e 10 por sessão', () => {
  assert.equal(banco.porSessao, 10);
  assert.ok(banco.questoes.length >= 30, `apenas ${banco.questoes.length} questões`);
  assert.equal(validarBanco(banco.questoes, banco.porSessao), true);
});

test('cada questão tem exatamente uma resposta correta e 4 alternativas distintas', () => {
  for (const q of banco.questoes) {
    assert.equal(q.alternativas.length, 4, q.id);
    assert.equal(new Set(q.alternativas.map((a) => a.toLowerCase())).size, 4, q.id);
    assert.ok(Number.isInteger(q.correta) && q.correta >= 0 && q.correta < 4, q.id);
  }
});

test('validarBanco rejeita bancos malformados', () => {
  const ok = { id: 'a', pergunta: 'P?', alternativas: ['x', 'y'], correta: 0, explicacao: 'E' };
  assert.throws(() => validarBanco([ok], 2), /pelo menos 2/);
  assert.throws(() => validarBanco([ok, { ...ok }], 2), /repetido/);
  assert.throws(() => validarBanco([ok, { ...ok, id: 'b', correta: 5 }], 2), /correta inválida/);
  assert.throws(() => validarBanco([ok, { ...ok, id: 'b', alternativas: ['x', 'x'] }], 2), /repetidas/);
  assert.throws(() => validarBanco([ok, { ...ok, id: 'b', explicacao: ' ' }], 2), /explicação/);
});

test('embaralhar preserva os elementos e não altera a lista original', () => {
  const original = [1, 2, 3, 4, 5, 6];
  const r = embaralhar(original, semente(7));
  assert.deepEqual([...r].sort(), original);
  assert.deepEqual(original, [1, 2, 3, 4, 5, 6]);
});

test('uma sessão tem exatamente 10 questões distintas', () => {
  for (let s = 1; s <= 50; s++) {
    const sessao = criarSessao(banco.questoes, 10, [], semente(s));
    assert.equal(sessao.questoes.length, 10);
    assert.equal(new Set(sessao.questoes.map((q) => q.id)).size, 10);
  }
});

test('sessões consecutivas não repetem perguntas enquanto houver perguntas novas', () => {
  let vistas = [];
  const usadas = new Set();
  const sessoesSemRepetir = Math.floor(banco.questoes.length / 10);
  for (let i = 0; i < sessoesSemRepetir; i++) {
    const r = sortearQuestoes(banco.questoes, 10, vistas, semente(100 + i));
    for (const q of r.selecionadas) { assert.ok(!usadas.has(q.id), `repetiu ${q.id} na sessão ${i + 1}`); usadas.add(q.id); }
    vistas = r.vistas;
  }
  // banco esgotado: a próxima sessão ainda tem 10 questões distintas
  const r = sortearQuestoes(banco.questoes, 10, vistas, semente(999));
  assert.equal(new Set(r.selecionadas.map((q) => q.id)).size, 10);
  // e prioriza as que ainda não tinham saído
  const restantes = banco.questoes.filter((q) => !usadas.has(q.id)).map((q) => q.id);
  for (const id of restantes) assert.ok(r.selecionadas.some((q) => q.id === id), `${id} deveria ter prioridade`);
});

test('histórico com ids desconhecidos é ignorado', () => {
  const r = sortearQuestoes(banco.questoes, 10, ['inexistente', '<script>'], semente(3));
  assert.equal(r.selecionadas.length, 10);
  assert.ok(!r.vistas.includes('inexistente'));
});

test('prepararQuestao embaralha as alternativas mantendo a resposta correta', () => {
  for (let s = 1; s <= 30; s++) {
    for (const q of banco.questoes) {
      const p = prepararQuestao(q, semente(s));
      assert.equal(p.alternativas[p.correta], q.alternativas[q.correta]);
      assert.deepEqual([...p.alternativas].sort(), [...q.alternativas].sort());
    }
  }
});

test('a pontuação é calculada pelas respostas registradas', () => {
  const sessao = criarSessao(banco.questoes, 10, [], semente(42));
  const esperado = [];
  while (!terminou(sessao)) {
    const q = questaoAtual(sessao);
    const acertar = sessao.indice % 3 !== 0; // acerta 6 de 10 (erra índices 0, 3, 6, 9)
    const escolha = acertar ? q.correta : (q.correta + 1) % q.alternativas.length;
    const r = responder(sessao, escolha);
    assert.equal(r.acertou, acertar);
    esperado.push(acertar);
    assert.equal(responder(sessao, q.correta), null, 'não pode responder duas vezes');
    assert.equal(avancar(sessao), true);
  }
  assert.deepEqual(pontuacao(sessao), { acertos: 6, total: 10, percentual: 60 });
  assert.equal(esperado.filter(Boolean).length, 6);
});

test('respostas inválidas são ignoradas e não é possível pular uma questão', () => {
  const sessao = criarSessao(banco.questoes, 10, [], semente(5));
  assert.equal(avancar(sessao), false);
  assert.equal(responder(sessao, -1), null);
  assert.equal(responder(sessao, 99), null);
  assert.equal(responder(sessao, '1'), null);
  assert.equal(sessao.respostas.length, 0);
});
