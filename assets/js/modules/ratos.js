// Ratos que andam sem parar nas faixas do fim de cada capítulo e no menu lateral: quando
// um sai da tela por um lado, volta andando para o outro, sem intervalo. São apenas
// decoração: não recebem cliques (pointer-events: none), ficam fora do texto, só se
// movem quando a faixa está visível e são desativados com redução de movimento,
// economia de dados ou pouca memória.
import { el, reduzirMovimento } from './dom.js';

// os pés avançam ~0,72 da altura do rato a cada passo (1 s), então o deslocamento
// acompanha esse ritmo e o rato não "patina" no chão
const PASSO_POR_ALTURA = 0.72;

export function iniciarRatos() {
  const trilhas = [...document.querySelectorAll('[data-trilha-rato]')];
  if (!trilhas.length || reduzirMovimento() || !('IntersectionObserver' in window)) return;
  if (navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory < 2)) return;

  const caminhadas = new Map(); // trilha → { rato, animacao, visivel }

  function andar(trilha, paraDireita, inicioAleatorio = false) {
    const c = caminhadas.get(trilha);
    c.animacao?.cancel(); // não acumula animações antigas no elemento
    c.rato.className = `rato rato--${paraDireita ? 'direita' : 'esquerda'}`;
    const largura = trilha.clientWidth, w = c.rato.offsetWidth;
    const velocidade = c.rato.offsetHeight * PASSO_POR_ALTURA; // px/s
    const de = paraDireita ? -w : largura, ate = paraDireita ? largura : -w;
    const duracao = Math.max(1000, ((largura + w) / velocidade) * 1000);
    c.animacao = c.rato.animate([{ transform: `translateX(${de}px)` }, { transform: `translateX(${ate}px)` }], { duration: duracao, easing: 'linear', fill: 'both' });
    if (inicioAleatorio) c.animacao.currentTime = duracao * (0.15 + Math.random() * 0.5);
    if (!c.visivel || document.hidden) c.animacao.pause();
    // saiu por um lado: vira e volta andando pelo mesmo lado, para o outro
    c.animacao.onfinish = () => andar(trilha, !paraDireita);
  }

  const observador = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      let c = caminhadas.get(e.target);
      if (e.isIntersecting && !c) {
        c = { rato: el('div', { classe: 'rato' }), animacao: null, visivel: true };
        e.target.append(c.rato);
        caminhadas.set(e.target, c);
        andar(e.target, Math.random() < 0.5, true);
        continue;
      }
      if (!c) continue;
      c.visivel = e.isIntersecting;
      if (c.visivel && !document.hidden) c.animacao.play(); else c.animacao.pause();
    }
  });
  trilhas.forEach((t) => observador.observe(t));

  document.addEventListener('visibilitychange', () => {
    caminhadas.forEach((c) => (document.hidden || !c.visivel ? c.animacao.pause() : c.animacao.play()));
  });
}
