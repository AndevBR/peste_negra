// Busca do glossário: funções puras (testadas em tests/unit/glossario.test.mjs).

export const LIMITE_BUSCA = 60;

/** Normaliza texto para comparação: minúsculas, sem acentos e espaços simples (opcionalmente limitado). */
export function normalizar(texto, limite = Infinity) {
  return String(texto ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limite);
}

/** Filtra termos pelo texto buscado (no termo e na definição) e pela categoria. */
export function filtrarTermos(termos, busca = '', categoria = 'todas') {
  const alvo = normalizar(busca, LIMITE_BUSCA);
  return termos
    .filter((t) => categoria === 'todas' || t.categoria === categoria)
    .filter((t) => !alvo || normalizar(t.termo).includes(alvo) || normalizar(t.definicao).includes(alvo))
    .sort((a, b) => {
      // termos cujo nome começa com a busca aparecem primeiro
      const pa = alvo && normalizar(a.termo).startsWith(alvo) ? 0 : 1;
      const pb = alvo && normalizar(b.termo).startsWith(alvo) ? 0 : 1;
      return pa - pb || a.termo.localeCompare(b.termo, 'pt-BR');
    });
}

/**
 * Divide `texto` em trechos marcando as ocorrências da busca (ignorando acentos),
 * para destacar com <mark> sem usar innerHTML.
 * @returns {{ texto: string, destaque: boolean }[]}
 */
export function trechosDestacados(texto, busca) {
  const alvo = normalizar(busca, LIMITE_BUSCA);
  if (!alvo) return [{ texto, destaque: false }];
  // normaliza caractere a caractere para manter o alinhamento com o texto original
  const simples = [...texto].map((c) => c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()).join('');
  if (simples.length !== texto.length) return [{ texto, destaque: false }];
  const partes = [];
  let i = 0;
  for (;;) {
    const achou = simples.indexOf(alvo, i);
    if (achou < 0) break;
    if (achou > i) partes.push({ texto: texto.slice(i, achou), destaque: false });
    partes.push({ texto: texto.slice(achou, achou + alvo.length), destaque: true });
    i = achou + alvo.length;
  }
  if (i < texto.length) partes.push({ texto: texto.slice(i), destaque: false });
  return partes;
}
