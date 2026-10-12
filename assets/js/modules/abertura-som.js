// Sons ambientes da abertura (chuva e trovões) sintetizados com a Web Audio API —
// nenhum arquivo de áudio é baixado. Só tocam depois que o visitante ativa o som.
export function criarSom() {
  let ctx = null, chuva = null, saida = null, ligado = false;

  function ruido(segundos) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * segundos, ctx.sampleRate);
    const dados = buffer.getChannelData(0);
    for (let i = 0; i < dados.length; i++) dados[i] = Math.random() * 2 - 1;
    return buffer;
  }

  function ligar() {
    const Contexto = window.AudioContext || window.webkitAudioContext;
    if (!Contexto) return false;
    ctx = ctx || new Contexto();
    ctx.resume();
    saida = ctx.createGain(); saida.gain.value = 0; saida.connect(ctx.destination);
    saida.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.5);
    chuva = ctx.createBufferSource(); chuva.buffer = ruido(3); chuva.loop = true;
    const passaAlta = ctx.createBiquadFilter(); passaAlta.type = 'highpass'; passaAlta.frequency.value = 400;
    const passaBaixa = ctx.createBiquadFilter(); passaBaixa.type = 'lowpass'; passaBaixa.frequency.value = 2600;
    const volume = ctx.createGain(); volume.gain.value = 0.08;
    chuva.connect(passaAlta).connect(passaBaixa).connect(volume).connect(saida);
    chuva.start();
    return true;
  }

  function desligar() {
    if (!ctx || !ligado) { ligado = false; return; }
    ligado = false;
    const s = saida, c = chuva;
    s.gain.cancelScheduledValues(ctx.currentTime);
    s.gain.setValueAtTime(s.gain.value, ctx.currentTime);
    s.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    setTimeout(() => { try { c.stop(); s.disconnect(); } catch { /* já parado */ } }, 700);
  }

  return {
    alternar() { if (ligado) desligar(); else ligado = ligar(); return ligado; },
    desligar,
    trovao(atraso = 600) {
      if (!ligado || !ctx) return;
      const inicio = ctx.currentTime + atraso / 1000;
      const fonte = ctx.createBufferSource(); fonte.buffer = ruido(4);
      const filtro = ctx.createBiquadFilter(); filtro.type = 'lowpass'; filtro.frequency.value = 160 + Math.random() * 80;
      const volume = ctx.createGain();
      volume.gain.setValueAtTime(0, inicio);
      volume.gain.linearRampToValueAtTime(0.55, inicio + 0.12);
      volume.gain.exponentialRampToValueAtTime(0.18, inicio + 0.9);
      volume.gain.exponentialRampToValueAtTime(0.001, inicio + 3.6);
      fonte.connect(filtro).connect(volume).connect(saida);
      fonte.start(inicio); fonte.stop(inicio + 4);
    },
  };
}
