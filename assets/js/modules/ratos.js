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

  let ultimo = -Infinity, correndo = false;
  const observador = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting || correndo) continue;
      const agora = performance.now();
      if (agora - ultimo < INTERVALO_MINIMO || Math.random() > CHANCE) continue;
      ultimo = agora;
      correr(e.target);
    }
  }, { threshold: 1 });
  trilhas.forEach((t) => observador.observe(t));

  function correr(trilha) {
    correndo = true;
    const largura = trilha.clientWidth;
    const paraDireita = Math.random() < 0.5;
    const rato = el('div', { classe: `rato${paraDireita ? '' : ' rato--esquerda'}` });
    trilha.append(rato);
    const inicio = paraDireita ? -140 : largura + 20, fim = paraDireita ? largura + 20 : -140;
    const velocidade = 210 + Math.random() * 90; // px/s
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
    animacao.finished.then(() => { rato.remove(); correndo = false; }).catch(() => { rato.remove(); correndo = false; });
  }
}
