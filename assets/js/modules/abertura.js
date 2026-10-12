// Abertura cinematográfica: o vídeo do Doutor da Peste caminhando pela rua, com o título
// e o botão que levam ao site. Pode ser pulada a qualquer momento (botão ou Esc), começa
// sem som (o visitante ativa se quiser) e respeita a redução de movimento.
import { reduzirMovimento } from './dom.js';

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
  const video = raiz.querySelector('.abertura__video');
  let temporizadores = [];
  let aberta = false;

  const agendar = (ms, fn) => temporizadores.push(setTimeout(fn, ms));
  const limparTempos = () => { temporizadores.forEach(clearTimeout); temporizadores = []; };

  // o vídeo só é baixado quando a abertura aparece: versão menor em telas pequenas e
  // MP4 (H.264, decodificado pelo hardware dos celulares) ou WebM onde não houver H.264
  function prepararVideo() {
    if (!video || video.getAttribute('src')) return;
    const pequeno = matchMedia('(max-width: 760px), (max-height: 520px)').matches;
    const mp4 = video.canPlayType('video/mp4; codecs="avc1.640028, mp4a.40.2"') !== '';
    video.src = `${video.dataset.video}${pequeno ? '-pequeno' : ''}.${mp4 ? 'mp4' : 'webm'}`;
  }
  // sem movimento (ou se o navegador bloquear a reprodução) fica a imagem do Doutor já parado
  const mostrarFinal = () => { if (video) video.poster = video.dataset.posterFim; };

  function abrir() {
    aberta = true;
    raiz.hidden = false;
    raiz.className = 'abertura';
    document.body.classList.add('abertura-ativa');
    fundo.forEach((el) => { el.inert = true; });
    if (reduzirMovimento()) {
      mostrarFinal();
      raiz.classList.add('instantanea', 'fase-1', 'fase-2', 'fase-3', 'fase-4', 'fase-5');
      botaoEntrar.focus();
      return;
    }
    botaoPular.focus();
    if (video) {
      prepararVideo();
      video.currentTime = 0;
      video.play()?.catch(mostrarFinal);
    }
    // o título e o botão entram quando o Doutor se aproxima e para (vídeo de ~12 s)
    agendar(250, () => raiz.classList.add('fase-1'));
    agendar(1200, () => raiz.classList.add('fase-2', 'fase-3'));
    agendar(8400, () => raiz.classList.add('fase-4'));
    agendar(10800, () => { raiz.classList.add('fase-5'); if (raiz.contains(document.activeElement) || document.activeElement === document.body) botaoEntrar.focus({ preventScroll: true }); });
  }

  function fechar({ animar = true } = {}) {
    if (!aberta && raiz.hidden) return;
    aberta = false;
    marcarVista();
    limparTempos();
    const concluir = () => {
      video?.pause();
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
    const ligado = !!video && video.muted;
    if (video) video.muted = !ligado;
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
