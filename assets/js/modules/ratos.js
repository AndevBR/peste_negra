// Ratos que atravessam ocasionalmente as faixas vazias no fim de algumas seções.
// São apenas decoração: não recebem cliques (pointer-events: none), ficam fora do texto
// e são desativados com redução de movimento, economia de dados ou pouca memória.
import { el, reduzirMovimento } from './dom.js';

// ?ratos=sempre faz um rato aparecer em toda faixa visível (usado nos testes automáticos)
const SEMPRE = new URLSearchParams(location.search).get('ratos') === 'sempre';
const INTERVALO_MINIMO = SEMPRE ? 0 : 12000;
const CHANCE = SEMPRE ? 1 : 0.55;

export function iniciarRatos() {
  const trilhas = [...document.querySelectorAll('[data-trilha-rato]')];
  if (!trilhas.length || reduzirMovimento() || !('IntersectionObserver' in window)) return;
  if (navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory < 2)) return;

  // poucos de cada vez: no máximo 2 ao mesmo tempo (1 no celular), um por faixa
  const celular = matchMedia('(max-width: 760px)').matches;
  const MAXIMO = celular ? 1 : 2;
  const ativos = new Set();
  let ultimo = -Infinity;
  document.addEventListener('visibilitychange', () => ativos.forEach((a) => (document.hidden ? a.pause() : a.play())));
  const observador = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting || ativos.size >= MAXIMO || e.target.dataset.ocupada) continue;
      const agora = performance.now();
      if (agora - ultimo < INTERVALO_MINIMO || Math.random() > CHANCE) continue;
      ultimo = agora;
      correr(e.target);
    }
  }, { threshold: 1 });
  trilhas.forEach((t) => observador.observe(t));

  function correr(trilha) {
    trilha.dataset.ocupada = '1';
    const largura = trilha.clientWidth;
    const paraDireita = Math.random() < 0.5;
    const rato = el('div', { classe: `rato${paraDireita ? '' : ' rato--esquerda'}` });
    const tamanho = (celular ? 0.68 : 0.75) + Math.random() * 0.25; // ratos de tamanhos diferentes
    rato.style.width = `${Math.round(130 * tamanho)}px`;
    rato.style.height = `${Math.round(45 * tamanho)}px`;
    rato.style.animationDuration = `${(0.34 + Math.random() * 0.1).toFixed(2)}s`;
    trilha.append(rato);
    const inicio = paraDireita ? -140 : largura + 20, fim = paraDireita ? largura + 20 : -140;
    const velocidade = (190 + Math.random() * 110) * tamanho; // px/s
    const duracao = (Math.abs(fim - inicio) / velocidade) * 1000;
    const pausa = Math.random() < 0.6; // às vezes para no meio, como quem fareja
    const espelho = paraDireita ? '' : ' scaleX(-1)';
    const quadros = pausa
      ? [
          { transform: `translateX(${inicio}px)${espelho}`, opacity: 0, offset: 0 },
          { transform: `translateX(${inicio + (fim - inicio) * 0.05}px)${espelho}`, opacity: 1, offset: 0.04 },
          { transform: `translateX(${inicio + (fim - inicio) * 0.42}px)${espelho}`, opacity: 1, offset: 0.36 },
          { transform: `translateX(${inicio + (fim - inicio) * 0.44}px)${espelho}`, opacity: 1, offset: 0.52 },
          { transform: `translateX(${inicio + (fim - inicio) * 0.95}px)${espelho}`, opacity: 1, offset: 0.95 },
          { transform: `translateX(${fim}px)${espelho}`, opacity: 0, offset: 1 },
        ]
      : [
          { transform: `translateX(${inicio}px)${espelho}`, opacity: 0 },
          { transform: `translateX(${inicio + (fim - inicio) * 0.05}px)${espelho}`, opacity: 1, offset: 0.05 },
          { transform: `translateX(${inicio + (fim - inicio) * 0.94}px)${espelho}`, opacity: 1, offset: 0.94 },
          { transform: `translateX(${fim}px)${espelho}`, opacity: 0 },
        ];
    const total = pausa ? duracao * 1.25 : duracao;
    const animacao = rato.animate(quadros, { duration: total, easing: 'linear', fill: 'forwards' });
    if (pausa) {
      setTimeout(() => rato.classList.add('parado'), total * 0.37);
      setTimeout(() => rato.classList.remove('parado'), total * 0.51);
    }
    ativos.add(animacao);
    const terminar = () => { rato.remove(); ativos.delete(animacao); delete trilha.dataset.ocupada; };
    animacao.finished.then(terminar, terminar);
  }
}
