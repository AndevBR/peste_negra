// Ponto de entrada: inicia a abertura, o menu e apenas os módulos usados pela página atual.
import { iniciarAbertura } from './modules/abertura.js';
import { iniciarNavegacao } from './modules/navegacao.js';
import { iniciarRevelar, iniciarParallax, iniciarParticulas } from './modules/efeitos.js';
import { iniciarRatos } from './modules/ratos.js';

document.documentElement.classList.add('js');

const modulos = [
  ['[data-linha-do-tempo]', () => import('./modules/linha-do-tempo.js').then((m) => m.iniciarLinhaDoTempo)],
  ['[data-personagens]', () => import('./modules/personagens.js').then((m) => m.iniciarPersonagens)],
  ['[data-mitos]', () => import('./modules/mitos.js').then((m) => m.iniciarMitos)],
  ['[data-abas]', () => import('./modules/abas.js').then((m) => m.iniciarAbas)],
  ['[data-mapa]', () => import('./modules/mapa.js').then((m) => m.iniciarMapa)],
  ['[data-qr]', () => import('./modules/qr.js').then((m) => m.iniciarQr)],
  ['[data-quiz]', () => import('./modules/quiz.js').then((m) => m.iniciarQuiz)],
  ['[data-glossario]', () => import('./modules/glossario.js').then((m) => m.iniciarGlossario)],
  ['[data-fontes]', () => import('./modules/fontes.js').then((m) => m.iniciarFontes)],
];

function iniciar() {
  const abertura = iniciarAbertura();
  iniciarNavegacao();
  document.querySelector('[data-rever-abertura]')?.addEventListener('click', () => {
    if (abertura) abertura.abrir();
    else location.href = './?abertura=1';
  });
  iniciarRevelar();
  iniciarParallax();
  iniciarParticulas();
  iniciarRatos();
  const carregando = [];
  for (const [seletor, carregar] of modulos) {
    const raiz = document.querySelector(seletor);
    if (!raiz) continue;
    carregando.push(carregar()
      .then((iniciarModulo) => iniciarModulo(raiz))
      .catch((erro) => console.error(`Falha ao iniciar ${seletor}:`, erro)));
  }
  manterAncora(Promise.all(carregando));
}

// Quem chega por um link direto (ex.: ./#jogos) deve parar na seção certa mesmo depois que
// o conteúdo carregado dos arquivos JSON aumentar a altura das seções anteriores.
function manterAncora(pronto) {
  const alvo = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!alvo) return;
  let rolouSozinho = false;
  const marcar = () => { rolouSozinho = true; };
  ['wheel', 'touchstart', 'keydown'].forEach((ev) => window.addEventListener(ev, marcar, { once: true, passive: true }));
  pronto.then(() => requestAnimationFrame(() => { if (!rolouSozinho) alvo.scrollIntoView({ block: 'start', behavior: 'instant' }); }));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();
