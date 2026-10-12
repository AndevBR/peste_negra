// Abertura cinematográfica: o vídeo do Doutor da Peste caminhando pela rua, com o título
// e o botão que levam ao site. Pode ser pulada a qualquer momento (botão ou Esc), toca com
// som (o visitante desliga no botão) e respeita a redução de movimento.
import { reduzirMovimento } from './dom.js';

const CHAVE = 'peste-negra:abertura-vista';
const lerVista = () => { try { return sessionStorage.getItem(CHAVE) === '1'; } catch { return false; } };
const marcarVista = () => { try { sessionStorage.setItem(CHAVE, '1'); } catch { /* sem armazenamento: tudo bem */ } };
const CHAVE_SOM = 'peste-negra:abertura-sem-som';
const lerSemSom = () => { try { return sessionStorage.getItem(CHAVE_SOM) === '1'; } catch { return false; } };
const gravarSemSom = (v) => { try { sessionStorage.setItem(CHAVE_SOM, v ? '1' : '0'); } catch { /* tudo bem */ } };

export function iniciarAbertura() {
  const raiz = document.querySelector('[data-abertura]');
  if (!raiz) return null;
  const fundo = [document.querySelector('.pagina'), document.querySelector('.lateral'), document.querySelector('.lateral__abrir')].filter(Boolean);
  const botaoEntrar = raiz.querySelector('[data-entrar]');
  const botaoPular = raiz.querySelector('[data-pular]');
  const botaoSom = raiz.querySelector('[data-som]');
  const video = raiz.querySelector('.abertura__video');
  let somLigado = !lerSemSom();
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
      video.muted = !somLigado;
      // navegadores só deixam tocar com som depois de um gesto do visitante: se bloquearem,
      // o vídeo segue mudo e o som entra no primeiro toque, clique ou tecla
      video.play()?.catch(() => {
        video.muted = true;
        video.play()?.catch(mostrarFinal);
      });
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
  function mostrarSom() {
    botaoSom.setAttribute('aria-pressed', String(somLigado));
    botaoSom.querySelector('[data-som-rotulo]').textContent = somLigado ? 'Desativar som' : 'Ativar som';
    botaoSom.setAttribute('aria-label', somLigado ? 'Desativar som' : 'Ativar som');
    botaoSom.querySelector('use').setAttribute('href', botaoSom.querySelector('use').getAttribute('href').replace(/#.*/, somLigado ? '#som' : '#sem-som'));
  }
  botaoSom.addEventListener('click', () => {
    somLigado = !somLigado;
    gravarSemSom(!somLigado);
    if (video) video.muted = !somLigado;
    mostrarSom();
  });
  // primeiro gesto do visitante libera o som que o navegador segurou (menos no próprio botão)
  const liberarSom = (e) => {
    if (!video || !somLigado || !video.muted || e.target.closest?.('[data-som]')) return;
    video.muted = false;
  };
  ['pointerdown', 'keydown', 'touchend'].forEach((t) => document.addEventListener(t, liberarSom, true));
  mostrarSom();

  // a abertura não aparece se o visitante já a viu nesta sessão, se chegou por um link
  // direto para uma seção (#jogos, por exemplo) ou se pediu ?abertura=0
  const parametros = new URLSearchParams(location.search);
  const pular = lerVista() || (location.hash && location.hash !== '#inicio') || parametros.get('abertura') === '0';
  if (pular && parametros.get('abertura') !== '1') { raiz.hidden = true; fundo.forEach((el) => { el.inert = false; }); }
  else abrir();

  return { abrir, fechar };
}
