// Relógio compartilhado: um único requestAnimationFrame alimenta todas as animações da
// página (chuva, caminhada do Doutor...). Para sozinho quando ninguém o usa, e o intervalo
// entre quadros é limitado, então uma aba escondida (sem quadros) apenas pausa as animações.
const ouvintes = new Set();
let quadro = 0, anterior = 0;

function passo(agora) {
  const dt = anterior ? Math.min(0.05, (agora - anterior) / 1000) : 0.016;
  anterior = agora;
  for (const fn of [...ouvintes]) fn(dt, agora);
  quadro = ouvintes.size ? requestAnimationFrame(passo) : 0;
  if (!quadro) anterior = 0;
}

/** Chama fn(dt, agora) a cada quadro. Devolve a função que cancela. */
export function aCadaQuadro(fn) {
  ouvintes.add(fn);
  if (!quadro) quadro = requestAnimationFrame(passo);
  return () => ouvintes.delete(fn);
}
