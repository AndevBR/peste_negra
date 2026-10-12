// Abertura cinematográfica: sequência em tempo real (camadas, névoa, chuva e relâmpagos)
// que apresenta o Doutor da Peste e leva ao site. Pode ser pulada a qualquer momento
// (botão ou Esc), não toca som sem permissão e respeita a redução de movimento.
import { reduzirMovimento } from './dom.js';
import { criarSom } from './abertura-som.js';

const CHAVE = 'peste-negra:abertura-vista';
const lerVista = () => { try { return sessionStorage.getItem(CHAVE) === '1'; } catch { return false; } };
const marcarVista = () => { try { sessionStorage.setItem(CHAVE, '1'); } catch { /* sem armazenamento: tudo bem */ } };

export function iniciarAbertura() {
  const raiz = document.querySelector('[data-abertura]');
  if (!raiz) return null;
  const fundo = [document.querySelector('.pagina'), document.querySelector('.lateral'), document.querySelector('.lateral__abrir')].filter(Boolean);
  const botaoEntrar = raiz.querySelector('[data-entrar]');
  const botaoPular = raiz.querySelector('[data-pular]');
  const botaoSom = raiz.querySelector('[data-som]');
  const chuva = criarChuva(raiz.querySelector('.abertura__chuva'));
  const som = criarSom();
  let temporizadores = [];
  let aberta = false;

  const agendar = (ms, fn) => temporizadores.push(setTimeout(fn, ms));
  const limparTempos = () => { temporizadores.forEach(clearTimeout); temporizadores = []; };

  function relampago() {
    if (reduzirMovimento()) return;
    raiz.classList.remove('relampago');
    void raiz.offsetWidth; // reinicia a animação
    raiz.classList.add('relampago');
    agendar(1600, () => raiz.classList.remove('relampago'));
    som.trovao(500 + Math.random() * 900);
  }

  function relampagosAmbientes() {
    agendar(9000 + Math.random() * 7000, () => { if (aberta) { relampago(); relampagosAmbientes(); } });
  }

  function abrir() {
    aberta = true;
    raiz.hidden = false;
    raiz.className = 'abertura';
    document.body.classList.add('abertura-ativa');
    fundo.forEach((el) => { el.inert = true; });
    if (reduzirMovimento()) {
      raiz.classList.add('instantanea', 'fase-1', 'fase-2', 'fase-3', 'fase-4', 'fase-5');
      botaoEntrar.focus();
      return;
    }
    botaoPular.focus();
    chuva.iniciar();
    agendar(250, () => raiz.classList.add('fase-1'));
    agendar(1500, relampago);
    agendar(2500, () => raiz.classList.add('fase-2'));
    agendar(3700, () => { relampago(); raiz.classList.add('fase-3'); });
    agendar(6300, () => raiz.classList.add('fase-4'));
    agendar(7800, () => { raiz.classList.add('fase-5'); if (raiz.contains(document.activeElement) || document.activeElement === document.body) botaoEntrar.focus({ preventScroll: true }); relampagosAmbientes(); });
  }

  function fechar({ animar = true } = {}) {
    if (!aberta && raiz.hidden) return;
    aberta = false;
    marcarVista();
    limparTempos();
    som.desligar();
    const concluir = () => {
      chuva.parar();
      raiz.hidden = true;
      raiz.className = 'abertura';
      document.body.classList.remove('abertura-ativa');
      fundo.forEach((el) => { el.inert = false; });
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('titulo-principal')?.setAttribute('tabindex', '-1');
      document.getElementById('titulo-principal')?.focus({ preventScroll: true });
    };
    if (animar && !reduzirMovimento()) { raiz.classList.add('saindo'); setTimeout(concluir, 1050); }
    else concluir();
  }

  botaoEntrar.addEventListener('click', () => fechar());
  botaoPular.addEventListener('click', () => fechar({ animar: false }));
  raiz.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); fechar({ animar: false }); } });
  botaoSom.addEventListener('click', () => {
    const ligado = som.alternar();
    botaoSom.setAttribute('aria-pressed', String(ligado));
    botaoSom.querySelector('[data-som-rotulo]').textContent = ligado ? 'Desativar som' : 'Ativar som';
    botaoSom.setAttribute('aria-label', ligado ? 'Desativar som ambiente' : 'Ativar som ambiente');
    botaoSom.querySelector('use').setAttribute('href', botaoSom.querySelector('use').getAttribute('href').replace(/#.*/, ligado ? '#som' : '#sem-som'));
  });

  // a abertura não aparece se o visitante já a viu nesta sessão, se chegou por um link
  // direto para uma seção (#jogos, por exemplo) ou se pediu ?abertura=0
  const parametros = new URLSearchParams(location.search);
  const pular = lerVista() || (location.hash && location.hash !== '#inicio') || parametros.get('abertura') === '0';
  if (pular && parametros.get('abertura') !== '1') { raiz.hidden = true; fundo.forEach((el) => { el.inert = false; }); }
  else abrir();

  return { abrir, fechar };
}

// chuva leve desenhada em canvas (menos gotas em telas pequenas)
function criarChuva(tela) {
  const ctx = tela?.getContext('2d');
  let gotas = [], quadro = 0, ativo = false, largura = 0, altura = 0, anterior = 0;
  const ajustar = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    largura = tela.clientWidth; altura = tela.clientHeight;
    tela.width = largura * dpr; tela.height = altura * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const total = Math.round(Math.min(320, (largura * altura) / 5200));
    gotas = Array.from({ length: total }, () => ({ x: Math.random() * largura, y: Math.random() * altura, v: 700 + Math.random() * 500, c: 10 + Math.random() * 16, a: 0.08 + Math.random() * 0.18 }));
  };
  const desenhar = (agora) => {
    const dt = Math.min(0.05, (agora - anterior) / 1000 || 0.016); anterior = agora;
    ctx.clearRect(0, 0, largura, altura);
    ctx.lineWidth = 1;
    for (const g of gotas) {
      g.y += g.v * dt; g.x -= g.v * dt * 0.12;
      if (g.y > altura) { g.y = -20; g.x = Math.random() * (largura + 100); }
      ctx.strokeStyle = `rgba(190, 205, 230, ${g.a})`;
      ctx.beginPath(); ctx.moveTo(g.x, g.y); ctx.lineTo(g.x + g.c * 0.12, g.y - g.c); ctx.stroke();
    }
    if (ativo) quadro = requestAnimationFrame(desenhar);
  };
  return {
    iniciar() { if (!ctx || ativo || reduzirMovimento()) return; ativo = true; ajustar(); window.addEventListener('resize', ajustar); quadro = requestAnimationFrame(desenhar); },
    parar() { ativo = false; cancelAnimationFrame(quadro); window.removeEventListener('resize', ajustar); },
  };
}
