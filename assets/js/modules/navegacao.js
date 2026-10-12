// Menu lateral: fixo no computador (pode ser recolhido), gaveta no celular e tablet.
// Destaca a página atual e, na página inicial, a seção visível durante a rolagem.
const CHAVE_RECOLHIDO = 'peste-negra:menu-recolhido';
const ler = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const gravar = (k, v) => { try { localStorage.setItem(k, v); } catch { /* indisponível */ } };

export function iniciarNavegacao() {
  const lateral = document.getElementById('menu-lateral');
  if (!lateral) return;
  const abrirBtn = document.querySelector('.lateral__abrir');
  const veu = document.querySelector('.lateral__veu');
  const recolherBtn = lateral.querySelector('[data-recolher]');
  const movel = window.matchMedia('(max-width: 960px)');
  const html = document.documentElement;

  // ---- recolher / expandir (computador) ----
  const aplicarRecolhido = (sim) => {
    html.classList.toggle('lateral-recolhida', sim);
    recolherBtn?.setAttribute('aria-expanded', String(!sim));
    const rotulo = recolherBtn?.querySelector('.lateral__rotulo');
    if (rotulo) rotulo.textContent = sim ? 'Expandir menu' : 'Recolher menu';
    recolherBtn?.setAttribute('aria-label', sim ? 'Expandir menu' : 'Recolher menu');
  };
  aplicarRecolhido(ler(CHAVE_RECOLHIDO) === '1');
  recolherBtn?.addEventListener('click', () => {
    const sim = !html.classList.contains('lateral-recolhida');
    aplicarRecolhido(sim); gravar(CHAVE_RECOLHIDO, sim ? '1' : '0');
  });

  // ---- gaveta (celular e tablet) ----
  const aberta = () => lateral.classList.contains('aberta');
  const abrirGaveta = (sim, devolverFoco = true) => {
    lateral.classList.toggle('aberta', sim);
    abrirBtn?.setAttribute('aria-expanded', String(sim));
    if (movel.matches) lateral.inert = !sim;
    if (sim) { veu.hidden = false; requestAnimationFrame(() => veu.classList.add('visivel')); lateral.querySelector('a, button')?.focus(); }
    else { veu.classList.remove('visivel'); setTimeout(() => { if (!aberta()) veu.hidden = true; }, 320); if (devolverFoco) abrirBtn?.focus(); }
  };
  const ajustarModo = () => {
    if (movel.matches) { lateral.inert = !aberta(); }
    else { lateral.inert = false; if (aberta()) abrirGaveta(false, false); }
  };
  abrirBtn?.addEventListener('click', () => abrirGaveta(!aberta()));
  veu?.addEventListener('click', () => abrirGaveta(false));
  lateral.addEventListener('click', (e) => { if (movel.matches && e.target.closest('a')) abrirGaveta(false, false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && aberta()) abrirGaveta(false); });
  movel.addEventListener('change', ajustarModo);
  ajustarModo();

  // ---- página atual ----
  const paginaAtual = location.pathname.split('/').pop() || 'index.html';
  const links = [...lateral.querySelectorAll('.lateral__link')];
  links.forEach((a) => { if (a.dataset.pagina === paginaAtual) a.setAttribute('aria-current', 'page'); });

  // ---- seção visível (página inicial) ----
  const porSecao = new Map(links.filter((a) => a.dataset.secao).map((a) => [a.dataset.secao, a]));
  const secoes = [...porSecao.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (!secoes.length || !('IntersectionObserver' in window)) return;
  const marcar = (id) => porSecao.forEach((a, chave) => { if (chave === id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
  const observador = new IntersectionObserver((entradas) => {
    const visiveis = entradas.filter((e) => e.isIntersecting);
    if (visiveis.length) marcar(visiveis[0].target.id);
  }, { rootMargin: '-40% 0px -55% 0px' });
  secoes.forEach((s) => observador.observe(s));
}
