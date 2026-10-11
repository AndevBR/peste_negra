// Ponto de entrada: inicia apenas os módulos usados pela página atual.
import { iniciarNavegacao } from './modules/navegacao.js';
import { iniciarRevelar, iniciarParallax, iniciarParticulas } from './modules/efeitos.js';

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
  iniciarNavegacao();
  iniciarRevelar();
  iniciarParallax();
  iniciarParticulas();
  for (const [seletor, carregar] of modulos) {
    const raiz = document.querySelector(seletor);
    if (!raiz) continue;
    carregar()
      .then((iniciarModulo) => iniciarModulo(raiz))
      .catch((erro) => console.error(`Falha ao iniciar ${seletor}:`, erro));
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
else iniciar();
