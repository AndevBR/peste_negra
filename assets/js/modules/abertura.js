// Abertura cinematográfica: sequência em tempo real (camadas, névoa, chuva e relâmpagos)
// que apresenta o Doutor da Peste e leva ao site. Pode ser pulada a qualquer momento
// (botão ou Esc), não toca som sem permissão e respeita a redução de movimento.
import { reduzirMovimento } from './dom.js';
import { criarSom } from './abertura-som.js';
import { aCadaQuadro } from './relogio.js';

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
  const caminhada = criarCaminhada(raiz.querySelector('.abertura__doutor'), raiz.querySelector('.abertura__cidade'), raiz);
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
    agendar(2500, () => { raiz.classList.add('fase-2'); caminhada.iniciar(5000); });
    agendar(3700, () => { relampago(); raiz.classList.add('fase-3'); });
    agendar(6300, () => raiz.classList.add('fase-4'));
    agendar(7800, () => { raiz.classList.add('fase-5'); if (raiz.contains(document.activeElement) || document.activeElement === document.body) botaoEntrar.focus({ preventScroll: true }); relampagosAmbientes(); });
  }

  function fechar({ animar = true } = {}) {
    if (!aberta && raiz.hidden) return;
    aberta = false;
    marcarVista();
    limparTempos();
    caminhada.parar();
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
  let gotas = [], cancelar = null, largura = 0, altura = 0;
  const ajustar = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    largura = tela.clientWidth; altura = tela.clientHeight;
    tela.width = largura * dpr; tela.height = altura * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const total = Math.round(Math.min(320, (largura * altura) / 5200));
    gotas = Array.from({ length: total }, () => ({ x: Math.random() * largura, y: Math.random() * altura, v: 700 + Math.random() * 500, c: 10 + Math.random() * 16, a: 0.08 + Math.random() * 0.18 }));
  };
  const desenhar = (dt) => {
    ctx.clearRect(0, 0, largura, altura);
    ctx.lineWidth = 1;
    for (const g of gotas) {
      g.y += g.v * dt; g.x -= g.v * dt * 0.12;
      if (g.y > altura) { g.y = -20; g.x = Math.random() * (largura + 100); }
      ctx.strokeStyle = `rgba(190, 205, 230, ${g.a})`;
      ctx.beginPath(); ctx.moveTo(g.x, g.y); ctx.lineTo(g.x + g.c * 0.12, g.y - g.c); ctx.stroke();
    }
  };
  return {
    iniciar() { if (!ctx || cancelar || reduzirMovimento()) return; ajustar(); window.addEventListener('resize', ajustar); cancelar = aCadaQuadro(desenhar); },
    parar() { cancelar?.(); cancelar = null; window.removeEventListener('resize', ajustar); },
  };
}

// Caminhada do Doutor: ele surge pequeno no ponto de fuga da rua e vem até a câmera.
// A posição segue a perspectiva (tamanho ∝ 1/distância), o quadro da folha de sprites
// avança conforme a distância percorrida (os pés não deslizam) e, ao desacelerar, ele
// dá o último passo e para de frente, com o cajado no chão (pose final, sem repetir).
const PONTO_DE_FUGA = { x: 760, y: 445, largura: 1584, altura: 672 }; // em cidade-noite.webp
const QUADROS = 10, CICLO = 8, PASSO_FINAL = 8, POSE_FINAL = 9;
const PERTO = 1, LONGE = 10, QUADROS_POR_UNIDADE = 5;

function criarCaminhada(doutor, cidade, raiz) {
  const folha = doutor?.querySelector('.abertura__quadro');
  let cancelar = null, geo = null;

  const mostrarQuadro = (i) => { folha.style.backgroundPosition = `${(i / (QUADROS - 1)) * 100}% 0`; };

  // mede a posição final (pose parada, definida no CSS) e o ponto de fuga na tela
  function medir() {
    doutor.style.transform = '';
    raiz.classList.add('parado');
    const m = new DOMMatrixReadOnly(getComputedStyle(doutor).transform);
    raiz.classList.remove('parado');
    const w = doutor.offsetWidth, h = doutor.offsetHeight;
    const origem = { x: doutor.offsetLeft + w / 2, y: doutor.offsetTop + h };
    const cw = cidade.clientWidth, ch = cidade.clientHeight;
    const esc = Math.max(cw / PONTO_DE_FUGA.largura, ch / PONTO_DE_FUGA.altura);
    const [px, py] = getComputedStyle(cidade).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
    const fuga = {
      x: (cw - PONTO_DE_FUGA.largura * esc) * px + PONTO_DE_FUGA.x * esc,
      y: (ch - PONTO_DE_FUGA.altura * esc) * py + PONTO_DE_FUGA.y * esc,
    };
    geo = { origem, fuga, fim: { x: origem.x + m.e, y: origem.y + m.f } };
  }

  function posicionar(t, escala) {
    const { origem, fuga, fim } = geo;
    const x = fuga.x + (fim.x - fuga.x) * t - origem.x;
    const y = fuga.y + (fim.y - fuga.y) * t - origem.y;
    doutor.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${escala.toFixed(4)})`;
  }

  function parar() {
    cancelar?.(); cancelar = null;
    window.removeEventListener('resize', medir);
    if (doutor) doutor.style.transform = '';
    if (folha) folha.style.backgroundPosition = '';
  }

  function iniciar(duracao) {
    if (!folha || !cidade || reduzirMovimento()) return;
    parar();
    medir();
    window.addEventListener('resize', medir);
    let tempo = 0;
    const passo = (dt) => {
      tempo += dt * 1000;
      const u = Math.min(1, tempo / duracao);
      const z = LONGE + (PERTO - LONGE) * (1 - (1 - u) ** 2); // anda e desacelera no fim
      const t = (1 / z - 1 / LONGE) / (1 / PERTO - 1 / LONGE); // perspectiva
      posicionar(t, PERTO / z);
      if (u >= 1) {
        mostrarQuadro(POSE_FINAL);
        raiz.classList.add('parado');
        cancelar?.(); cancelar = null;
        window.removeEventListener('resize', medir);
        doutor.style.transform = '';
        return;
      }
      mostrarQuadro(u > 0.94 ? PASSO_FINAL : Math.floor((LONGE - z) * QUADROS_POR_UNIDADE) % CICLO);
    };
    passo(0);
    cancelar = aCadaQuadro(passo);
  }

  return { iniciar, parar };
}
