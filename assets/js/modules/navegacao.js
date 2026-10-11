// Menu principal: abre e fecha no celular, fecha com Esc, com clique fora ou ao escolher um link.
export function iniciarNavegacao() {
  const botao = document.querySelector('.nav__botao');
  const painel = document.getElementById('menu-principal');
  if (!botao || !painel) return;

  const abrir = (sim) => {
    botao.setAttribute('aria-expanded', String(sim));
    painel.classList.toggle('aberto', sim);
  };
  const aberto = () => botao.getAttribute('aria-expanded') === 'true';

  botao.addEventListener('click', () => abrir(!aberto()));
  painel.addEventListener('click', (evento) => { if (evento.target.closest('a')) abrir(false); });
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && aberto()) { abrir(false); botao.focus(); }
  });
  document.addEventListener('click', (evento) => {
    if (aberto() && !painel.contains(evento.target) && !botao.contains(evento.target)) abrir(false);
  });
  window.matchMedia('(min-width: 1241px)').addEventListener('change', (m) => { if (m.matches) abrir(false); });

  // destaca a página atual
  const atual = location.pathname.split('/').pop() || 'index.html';
  painel.querySelectorAll('a').forEach((a) => {
    const destino = a.getAttribute('href');
    if (destino === atual) a.setAttribute('aria-current', 'page');
  });
}
