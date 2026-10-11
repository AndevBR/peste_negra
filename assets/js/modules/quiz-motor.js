// Motor do quiz: regras puras, sem acesso ao DOM (testado em tests/unit/quiz-motor.test.mjs).
//
// Regras:
// - cada sessão tem exatamente `porSessao` questões distintas;
// - as questões ainda não vistas pelo visitante têm prioridade, para que sessões
//   seguidas usem perguntas diferentes enquanto houver perguntas novas no banco;
// - a ordem das alternativas é embaralhada, e a resposta correta é guardada pelo índice
//   embaralhado — a pontuação é calculada aqui, nunca a partir de dados da página.

/** Embaralhamento de Fisher–Yates. `aleatorio` permite testes determinísticos. */
export function embaralhar(lista, aleatorio = Math.random) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Verifica se o banco de questões está bem formado. Lança erro descritivo se não estiver. */
export function validarBanco(questoes, porSessao) {
  if (!Array.isArray(questoes)) throw new Error('O banco de questões deve ser uma lista.');
  if (questoes.length < porSessao) throw new Error(`O banco precisa de pelo menos ${porSessao} questões.`);
  const ids = new Set();
  for (const q of questoes) {
    if (!q.id || ids.has(q.id)) throw new Error(`Questão com id ausente ou repetido: ${q.id}`);
    ids.add(q.id);
    if (typeof q.pergunta !== 'string' || !q.pergunta.trim()) throw new Error(`Questão ${q.id} sem enunciado.`);
    if (!Array.isArray(q.alternativas) || q.alternativas.length < 2) throw new Error(`Questão ${q.id} precisa de alternativas.`);
    if (new Set(q.alternativas).size !== q.alternativas.length) throw new Error(`Questão ${q.id} tem alternativas repetidas.`);
    if (!Number.isInteger(q.correta) || q.correta < 0 || q.correta >= q.alternativas.length) throw new Error(`Questão ${q.id} com resposta correta inválida.`);
    if (typeof q.explicacao !== 'string' || !q.explicacao.trim()) throw new Error(`Questão ${q.id} sem explicação.`);
  }
  return true;
}

/**
 * Sorteia as questões de uma sessão.
 * @param {object[]} questoes banco completo
 * @param {number} porSessao quantidade por sessão
 * @param {string[]} vistas ids já apresentados ao visitante (mais antigos primeiro)
 * @returns {{ selecionadas: object[], vistas: string[] }} questões e histórico atualizado
 */
export function sortearQuestoes(questoes, porSessao, vistas = [], aleatorio = Math.random) {
  const idsValidos = new Set(questoes.map((q) => q.id));
  let historico = vistas.filter((id) => idsValidos.has(id));
  const jaVistas = new Set(historico);
  const novas = embaralhar(questoes.filter((q) => !jaVistas.has(q.id)), aleatorio);

  let selecionadas = novas.slice(0, porSessao);
  if (selecionadas.length < porSessao) {
    // banco esgotado: completa com as vistas há mais tempo e recomeça o ciclo
    const porId = new Map(questoes.map((q) => [q.id, q]));
    const antigas = historico.map((id) => porId.get(id)).slice(0, porSessao - selecionadas.length);
    selecionadas = embaralhar(selecionadas.concat(antigas), aleatorio);
    historico = [];
  }
  const idsSessao = selecionadas.map((q) => q.id);
  historico = historico.filter((id) => !idsSessao.includes(id)).concat(idsSessao);
  return { selecionadas, vistas: historico };
}

/** Prepara uma questão para exibição, com alternativas embaralhadas. */
export function prepararQuestao(questao, aleatorio = Math.random) {
  const ordem = embaralhar(questao.alternativas.map((_, i) => i), aleatorio);
  return {
    id: questao.id,
    pergunta: questao.pergunta,
    alternativas: ordem.map((i) => questao.alternativas[i]),
    correta: ordem.indexOf(questao.correta),
    explicacao: questao.explicacao,
    fontes: questao.fontes || [],
  };
}

/** Cria o estado de uma sessão de quiz. */
export function criarSessao(questoes, porSessao, vistas = [], aleatorio = Math.random) {
  validarBanco(questoes, porSessao);
  const { selecionadas, vistas: historico } = sortearQuestoes(questoes, porSessao, vistas, aleatorio);
  return {
    questoes: selecionadas.map((q) => prepararQuestao(q, aleatorio)),
    indice: 0,
    respostas: [], // { id, escolhida, correta, acertou }
    historico,
  };
}

export const questaoAtual = (sessao) => sessao.questoes[sessao.indice] || null;
export const terminou = (sessao) => sessao.indice >= sessao.questoes.length;

/** Registra a resposta da questão atual. Respostas repetidas ou inválidas são ignoradas. */
export function responder(sessao, escolhida) {
  const q = questaoAtual(sessao);
  if (!q || sessao.respostas.length > sessao.indice) return null;
  if (!Number.isInteger(escolhida) || escolhida < 0 || escolhida >= q.alternativas.length) return null;
  const registro = { id: q.id, escolhida, correta: q.correta, acertou: escolhida === q.correta };
  sessao.respostas.push(registro);
  return registro;
}

/** Avança para a próxima questão (somente depois de responder a atual). */
export function avancar(sessao) {
  if (sessao.respostas.length <= sessao.indice) return false;
  sessao.indice += 1;
  return true;
}

export function pontuacao(sessao) {
  const acertos = sessao.respostas.filter((r) => r.acertou).length;
  const total = sessao.questoes.length;
  return { acertos, total, percentual: total ? Math.round((acertos / total) * 100) : 0 };
}

export function mensagemFinal({ percentual }) {
  if (percentual === 100) return 'Perfeito! Você é digno de um tratado de medicina… do século XXI.';
  if (percentual >= 70) return 'Excelente! Você conhece bem a história da Peste Negra.';
  if (percentual >= 40) return 'Bom trabalho! Revise algumas seções do site e tente de novo.';
  return 'A jornada está só começando. Explore o site e tente novamente!';
}
