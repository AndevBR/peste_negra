// Efeitos visuais: entrada das seções na rolagem, parallax do cenário e partículas de poeira.
// Tudo é desativado quando o sistema pede redução de movimento.
import { reduzirMovimento } from './dom.js';

export function iniciarRevelar() {
  const alvos = document.querySelectorAll('.revelar');
  if (!alvos.length) return;
  if (reduzirMovimento() || !('IntersectionObserver' in window)) {
    alvos.forEach((a) => a.classList.add('visivel'));
    return;
  }
  const observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (entrada.isIntersecting) { entrada.target.classList.add('visivel'); observador.unobserve(entrada.target); }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  alvos.forEach((a) => observador.observe(a));
}

export function iniciarParallax() {
  const hero = document.querySelector('.hero');
  const camadas = hero ? [...hero.querySelectorAll('[data-profundidade]')] : [];
  if (!camadas.length || reduzirMovimento()) return;

  let rolagem = 0, mouseX = 0, pendente = false;
  const aplicar = () => {
    pendente = false;
    for (const camada of camadas) {
      const p = Number(camada.dataset.profundidade);
      camada.style.transform = `translate3d(${(-mouseX * p * 30).toFixed(1)}px, ${(rolagem * p).toFixed(1)}px, 0) scale(1.06)`;
    }
  };
  const agendar = () => { if (!pendente) { pendente = true; requestAnimationFrame(aplicar); } };
  window.addEventListener('scroll', () => { rolagem = Math.min(window.scrollY, hero.offsetHeight); agendar(); }, { passive: true });
  if (window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => { mouseX = e.clientX / window.innerWidth - 0.5; agendar(); });
  }
  aplicar();
}

export function iniciarParticulas() {
  const tela = document.querySelector('.hero__particulas');
  if (!tela || reduzirMovimento()) return;
  const ctx = tela.getContext('2d');
  if (!ctx) return;
  let largura = 0, altura = 0, particulas = [], ativo = true, quadro = 0;

  const ajustar = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    largura = tela.clientWidth; altura = tela.clientHeight;
    tela.width = largura * dpr; tela.height = altura * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const total = Math.round(Math.min(46, largura / 26));
    particulas = Array.from({ length: total }, () => nova(true));
  };
  const nova = (inicio) => ({
    x: Math.random() * largura,
    y: inicio ? Math.random() * altura : altura + 10,
    r: 0.6 + Math.random() * 1.8,
    vy: 6 + Math.random() * 14,
    fase: Math.random() * Math.PI * 2,
    folha: Math.random() < 0.12,
  });

  let anterior = performance.now();
  const desenhar = (agora) => {
    const dt = Math.min(0.05, (agora - anterior) / 1000); anterior = agora;
    ctx.clearRect(0, 0, largura, altura);
    for (const p of particulas) {
      p.y -= p.vy * dt; p.fase += dt * 0.8;
      const x = p.x + Math.sin(p.fase) * 14;
      if (p.y < -10) Object.assign(p, nova(false));
      if (p.folha) {
        ctx.save(); ctx.translate(x, p.y); ctx.rotate(p.fase);
        ctx.fillStyle = 'rgba(150, 110, 60, .55)';
        ctx.beginPath(); ctx.ellipse(0, 0, p.r * 2.6, p.r * 1.2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = `rgba(255, 226, 170, ${0.25 + p.r / 6})`;
        ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    if (ativo) quadro = requestAnimationFrame(desenhar);
  };

  // pausa a animação quando o cenário sai da tela
  new IntersectionObserver(([e]) => {
    const visivel = e.isIntersecting;
    if (visivel && !ativo) { ativo = true; anterior = performance.now(); quadro = requestAnimationFrame(desenhar); }
    else if (!visivel) { ativo = false; cancelAnimationFrame(quadro); }
  }).observe(tela);

  window.addEventListener('resize', ajustar);
  ajustar();
  quadro = requestAnimationFrame(desenhar);
}
