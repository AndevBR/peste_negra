// Arte cinematográfica da abertura: rua medieval noturna em perspectiva, céu de tempestade,
// variantes iluminadas por relâmpago e o Doutor da Peste com proporções realistas.
// Os SVGs gerados aqui são rasterizados em WebP por scripts/gerar-cinema.mjs.

// ---------------- utilidades ----------------
function rng(semente) {
  let s = semente >>> 0;
  return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const paraHex = (rgb) => '#' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const misturar = (a, b, t) => paraHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
const escalar = (a, k) => paraHex(hex(a).map((v) => v * k));
const pts = (lista) => lista.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

export const LARG = 1920, ALT = 1080;

// câmera: altura 1,6 m, olhando para +z; horizonte um pouco abaixo do centro
const F = 1050, CX = 960, CY = 600, CAM_Y = 1.65;
const proj = (x, y, z) => [CX + (F * x) / z, CY - (F * (y - CAM_Y)) / z];

// paletas: noite (lua encoberta + luz de velas) e relâmpago (luz fria vinda do céu)
const PALETAS = {
  noite: { nevoa: '#1c212b', reboco: '#3f3a34', madeira: '#1a1310', telhado: '#17151a', pedra: '#2a2b2f', chao: '#141519', ceuLuz: 0.0, brilhoJanela: 1 },
  relampago: { nevoa: '#56617a', reboco: '#8f8a82', madeira: '#2e241c', telhado: '#3a3c46', pedra: '#6a6d76', chao: '#2a2d35', ceuLuz: 1.0, brilhoJanela: 0.55 },
};

// ---------------- céu ----------------
export function ceu(variante = 'noite') {
  const relampago = variante === 'relampago';
  const [c1, c2, c3] = relampago ? ['#2e3546', '#55607a', '#8e9ab4'] : ['#07080c', '#111520', '#232a38'];
  const raio = relampago ? `
    <g filter="url(#brilhoRaio)" stroke="#f2f6ff" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1290 0 L1268 120 L1302 150 L1250 290 L1284 318 L1236 470" stroke-width="5"/>
      <path d="M1268 120 L1210 200 L1222 240 M1250 290 L1330 360 L1320 410" stroke-width="2.5" opacity=".8"/>
    </g>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LARG} ${ALT}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset=".55" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient>
    <radialGradient id="lua" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${relampago ? '#dfe6f5' : '#8d94a6'}" stop-opacity=".9"/><stop offset=".35" stop-color="${relampago ? '#b8c2d8' : '#596173'}" stop-opacity=".35"/><stop offset="1" stop-opacity="0"/></radialGradient>
    <filter id="nuvens" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0016 0.0042" numOctaves="6" seed="${relampago ? 11 : 7}"/>
      <feColorMatrix type="matrix" values="0 0 0 0 ${relampago ? 0.78 : 0.2}  0 0 0 0 ${relampago ? 0.82 : 0.22}  0 0 0 0 ${relampago ? 0.92 : 0.28}  0 0 0 2.6 -1.15"/>
      <feGaussianBlur stdDeviation="2"/>
    </filter>
    <filter id="nuvensEscuras" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.003 0.008" numOctaves="5" seed="23"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.02  0 0 0 0 0.02  0 0 0 0 0.03  0 0 0 2.2 -0.9"/>
    </filter>
    <filter id="brilhoRaio" x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <linearGradient id="mascaraNuvem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".75" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="m"><rect width="${LARG}" height="${ALT}" fill="url(#mascaraNuvem)"/></mask>
  </defs>
  <rect width="${LARG}" height="${ALT}" fill="url(#g)"/>
  <circle cx="1300" cy="210" r="${relampago ? 420 : 300}" fill="url(#lua)"/>
  <g mask="url(#m)">
    <rect width="${LARG}" height="${ALT}" filter="url(#nuvens)" opacity="${relampago ? 0.95 : 0.85}"/>
    <rect width="${LARG}" height="${ALT}" filter="url(#nuvensEscuras)" opacity="${relampago ? 0.55 : 0.9}"/>
  </g>
  ${raio}
</svg>`;
}

// ---------------- rua em perspectiva ----------------
export function rua(variante = 'noite') {
  const P = PALETAS[variante];
  const r = rng(1347);
  const nevoa = (z) => 1 - Math.exp(-z / (variante === 'relampago' ? 34 : 24));
  const cor = (base, z, k = 1) => misturar(escalar(base, k), P.nevoa, nevoa(z));
  const ruaMeia = 3.1;
  const partes = [];
  const brilhos = []; // janelas e lanternas (desenhadas por cima com brilho)
  const reflexos = [];

  // ---- catedral ao fundo (fim da rua) ----
  const zc = 120;
  const c = (x, y) => proj(x, y, zc);
  const corCat = cor('#2c2b33', zc, variante === 'relampago' ? 1.6 : 1);
  partes.push(`<g fill="${corCat}">
    <polygon points="${pts([c(-14, 0), c(-14, 22), c(-7, 30), c(0, 22), c(7, 30), c(14, 22), c(14, 0)])}"/>
    <polygon points="${pts([c(-4, 20), c(-4, 44), c(0, 70), c(4, 44), c(4, 20)])}"/>
    <polygon points="${pts([c(-22, 0), c(-22, 30), c(-19, 38), c(-16, 30), c(-16, 0)])}"/>
    <polygon points="${pts([c(16, 0), c(16, 34), c(19, 42), c(22, 34), c(22, 0)])}"/>
  </g>`);
  brilhos.push({ p: c(0, 14), r: 7, cor: '#ffb04a', a: 0.7 }, { p: c(-6, 10), r: 4, cor: '#ff9c3a', a: 0.5 }, { p: c(6, 10), r: 4, cor: '#ff9c3a', a: 0.5 });

  // ---- casas: geradas dos dois lados, de longe para perto ----
  const casas = [];
  for (const lado of [-1, 1]) {
    let z = 2.2;
    while (z < 95) {
      const larg = 4.5 + r() * 4.5;
      casas.push({ lado, z0: z, z1: z + larg, andares: 2 + Math.floor(r() * 3), empena: r() < 0.45, tom: 0.75 + r() * 0.5, rs: r() * 1e9 });
      z += larg + (r() < 0.12 ? 1.2 : 0); // às vezes um beco estreito
    }
  }
  casas.sort((a, b) => b.z0 - a.z0);

  // chão (desenhado antes das casas)
  const chaoPts = [proj(-ruaMeia - 0.3, 0, 1.2), proj(-ruaMeia - 0.3, 0, 140), proj(ruaMeia + 0.3, 0, 140), proj(ruaMeia + 0.3, 0, 1.2)];
  const chao = [`<polygon points="${pts(chaoPts)}" fill="url(#gradChao)"/>`];
  // pedras do calçamento
  let zr = 1.15;
  let linha = 0;
  while (zr < 26) {
    const dz = zr * 0.075;
    const pedraL = 0.34;
    let x = -ruaMeia - 0.3 + (linha % 2 ? pedraL / 2 : 0) - r() * 0.1;
    while (x < ruaMeia + 0.3) {
      const w = pedraL * (0.75 + r() * 0.4);
      const a = proj(x + 0.02, 0, zr + 0.01), b = proj(x + w - 0.02, 0, zr + dz - 0.01);
      const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2, rx = Math.abs(b[0] - a[0]) / 2, ry = Math.abs(b[1] - a[1]) / 2;
      if (rx > 0.6 && ry > 0.3) {
        const base = escalar(P.pedra, 0.7 + r() * 0.45);
        chao.push(`<rect x="${(cx - rx * 0.96).toFixed(1)}" y="${(cy - ry * 0.9).toFixed(1)}" width="${(rx * 1.92).toFixed(1)}" height="${(ry * 1.8).toFixed(1)}" rx="${(Math.min(rx, ry) * 0.9).toFixed(1)}" fill="${cor(base, zr)}"/>`);
        if (ry > 1.4) chao.push(`<ellipse cx="${cx.toFixed(1)}" cy="${(cy - ry * 0.3).toFixed(1)}" rx="${(rx * 0.6).toFixed(1)}" ry="${(ry * 0.22).toFixed(1)}" fill="${variante === 'relampago' ? '#c9d3e6' : '#6a7486'}" opacity="${variante === 'relampago' ? 0.3 : 0.12}"/>`);
      }
      x += w;
    }
    zr += dz; linha++;
  }
  // valeta central com água
  const valeta = [proj(-0.09, 0.001, 2.5), proj(-0.03, 0.001, 140), proj(0.03, 0.001, 140), proj(0.09, 0.001, 2.5)];
  chao.push(`<polygon points="${pts(valeta)}" fill="${variante === 'relampago' ? '#7c879c' : '#2a3140'}" opacity=".7"/>`);
  partes.unshift(...chao);

  for (const casa of casas) {
    const rr = rng(casa.rs);
    const L = casa.lado;
    const zMed = (casa.z0 + casa.z1) / 2;
    const alturaAndar = 2.9;
    let base = 0;
    for (let a = 0; a < casa.andares; a++) {
      // andares superiores avançam sobre a rua (balanço típico das casas medievais)
      const x = L * (ruaMeia + 0.35 - a * 0.32);
      const topo = base + alturaAndar;
      const q = [proj(x, base, casa.z0), proj(x, topo, casa.z0), proj(x, topo, casa.z1), proj(x, base, casa.z1)];
      const reboco = cor(P.reboco, zMed, casa.tom);
      partes.push(`<polygon points="${pts(q)}" fill="${reboco}"/>`);
      // vigas do enxaimel
      const viga = cor(P.madeira, zMed);
      const esp = Math.max(0.6, (F * 0.16) / zMed);
      const linhas = [];
      const nPostes = Math.max(2, Math.round((casa.z1 - casa.z0) / 1.6));
      for (let i = 0; i <= nPostes; i++) {
        const zz = casa.z0 + ((casa.z1 - casa.z0) * i) / nPostes;
        linhas.push([proj(x, base, zz), proj(x, topo, zz)]);
        if (i < nPostes && (i + a) % 2 === 0) {
          const zz2 = casa.z0 + ((casa.z1 - casa.z0) * (i + 1)) / nPostes;
          linhas.push([proj(x, base, zz), proj(x, topo * 0.5 + base * 0.5, zz2)]);
        }
      }
      linhas.push([proj(x, base + 0.05, casa.z0), proj(x, base + 0.05, casa.z1)], [proj(x, topo - 0.05, casa.z0), proj(x, topo - 0.05, casa.z1)], [proj(x, base + 1.0, casa.z0), proj(x, base + 1.0, casa.z1)]);
      partes.push(`<g stroke="${viga}" stroke-width="${esp.toFixed(1)}" stroke-linecap="square">${linhas.map(([p1, p2]) => `<line x1="${p1[0].toFixed(1)}" y1="${p1[1].toFixed(1)}" x2="${p2[0].toFixed(1)}" y2="${p2[1].toFixed(1)}"/>`).join('')}</g>`);
      // janelas
      const nJan = Math.max(1, Math.floor((casa.z1 - casa.z0) / 2.6));
      for (let j = 0; j < nJan; j++) {
        const zj0 = casa.z0 + ((casa.z1 - casa.z0) * (j + 0.3)) / nJan, zj1 = zj0 + 0.75;
        const yj0 = base + (a === 0 ? 1.1 : 1.0), yj1 = yj0 + (a === 0 ? 1.1 : 1.2);
        if (a === 0 && j === 0) { // porta
          const pq = [proj(x, 0, zj0), proj(x, 2.2, zj0), proj(x, 2.2, zj0 + 1.0), proj(x, 0, zj0 + 1.0)];
          partes.push(`<polygon points="${pts(pq)}" fill="${cor('#140e0b', zMed)}"/>`);
          continue;
        }
        const acesa = rr() < 0.32;
        const jq = [proj(x, yj0, zj0), proj(x, yj1, zj0), proj(x, yj1, zj1), proj(x, yj0, zj1)];
        const corJan = acesa ? misturar('#ffb35c', P.nevoa, nevoa(zMed) * 0.55) : cor('#0d0e12', zMed);
        partes.push(`<polygon points="${pts(jq)}" fill="${corJan}" ${acesa ? `opacity="${(0.55 + 0.45 * P.brilhoJanela).toFixed(2)}"` : ''}/>`);
        // caixilho em cruz
        const m1 = proj(x, (yj0 + yj1) / 2, zj0), m2 = proj(x, (yj0 + yj1) / 2, zj1), m3 = proj(x, yj0, (zj0 + zj1) / 2), m4 = proj(x, yj1, (zj0 + zj1) / 2);
        partes.push(`<g stroke="${viga}" stroke-width="${(esp * 0.5).toFixed(1)}"><line x1="${m1[0].toFixed(1)}" y1="${m1[1].toFixed(1)}" x2="${m2[0].toFixed(1)}" y2="${m2[1].toFixed(1)}"/><line x1="${m3[0].toFixed(1)}" y1="${m3[1].toFixed(1)}" x2="${m4[0].toFixed(1)}" y2="${m4[1].toFixed(1)}"/></g>`);
        if (acesa) {
          const cj = proj(x, (yj0 + yj1) / 2, (zj0 + zj1) / 2);
          brilhos.push({ p: cj, r: Math.max(6, (F * 1.4) / zMed), cor: '#ffad55', a: 0.55 * P.brilhoJanela });
          if (zMed > 5 && zMed < 40) reflexos.push({ x, y: (yj0 + yj1) / 2, z: (zj0 + zj1) / 2, larg: 0.45 });
        }
      }
      // parte de baixo do balanço (sombra)
      if (a > 0) {
        const xAnt = L * (ruaMeia + 0.35 - (a - 1) * 0.32);
        const s = [proj(xAnt, base, casa.z0), proj(x, base, casa.z0), proj(x, base, casa.z1), proj(xAnt, base, casa.z1)];
        partes.push(`<polygon points="${pts(s)}" fill="${cor('#0a0809', zMed)}"/>`);
      }
      base = topo;
    }
    // telhado
    const xT = L * (ruaMeia + 0.35 - (casa.andares - 1) * 0.32);
    const corTelhado = cor(P.telhado, zMed, 1);
    if (casa.empena) {
      const zm = (casa.z0 + casa.z1) / 2, h = (casa.z1 - casa.z0) * 0.62;
      const tri = [proj(xT, base, casa.z0 - 0.15), proj(xT, base + h, zm), proj(xT, base, casa.z1 + 0.15)];
      partes.push(`<polygon points="${pts(tri)}" fill="${cor(P.reboco, zMed, casa.tom * 0.85)}"/>`);
      const v = cor(P.madeira, zMed), e = Math.max(0.8, (F * 0.22) / zMed);
      partes.push(`<polyline points="${pts(tri)}" fill="none" stroke="${corTelhado}" stroke-width="${(e * 1.8).toFixed(1)}" stroke-linejoin="round"/>`);
      const mi = proj(xT, base, zm), mt = proj(xT, base + h, zm);
      partes.push(`<line x1="${mi[0].toFixed(1)}" y1="${mi[1].toFixed(1)}" x2="${mt[0].toFixed(1)}" y2="${mt[1].toFixed(1)}" stroke="${v}" stroke-width="${e.toFixed(1)}"/>`);
    } else {
      const xFundo = xT + L * 4.5, h = 3.6;
      const tq = [proj(xT - L * 0.25, base, casa.z0 - 0.2), proj(xFundo, base + h, casa.z0 - 0.2), proj(xFundo, base + h, casa.z1 + 0.2), proj(xT - L * 0.25, base, casa.z1 + 0.2)];
      partes.push(`<polygon points="${pts(tq)}" fill="${corTelhado}"/>`);
      const beiral = [proj(xT - L * 0.25, base, casa.z0 - 0.2), proj(xT - L * 0.25, base, casa.z1 + 0.2)];
      partes.push(`<line x1="${beiral[0][0].toFixed(1)}" y1="${beiral[0][1].toFixed(1)}" x2="${beiral[1][0].toFixed(1)}" y2="${beiral[1][1].toFixed(1)}" stroke="${cor('#060506', zMed)}" stroke-width="${Math.max(1, (F * 0.25) / zMed).toFixed(1)}"/>`);
      if (rr() < 0.5) { // chaminé
        const zc0 = casa.z0 + (casa.z1 - casa.z0) * 0.6, xc = xT + L * 2.5;
        const ch = [proj(xc, base + 1.5, zc0), proj(xc, base + h + 1.6, zc0), proj(xc, base + h + 1.6, zc0 + 0.7), proj(xc, base + 1.5, zc0 + 0.7)];
        partes.push(`<polygon points="${pts(ch)}" fill="${cor('#1e1b1d', zMed)}"/>`);
      }
    }
    // lanterna presa à parede
    if (rr() < 0.25 && zMed < 50) {
      const xl = L * (ruaMeia + 0.05), zl = casa.z0 + 0.6;
      const p1 = proj(L * (ruaMeia + 0.35), 3.0, zl), p2 = proj(xl, 3.0, zl), pl = proj(xl, 2.7, zl);
      const e = Math.max(0.8, (F * 0.06) / zl);
      partes.push(`<line x1="${p1[0].toFixed(1)}" y1="${p1[1].toFixed(1)}" x2="${p2[0].toFixed(1)}" y2="${p2[1].toFixed(1)}" stroke="#0b0909" stroke-width="${e.toFixed(1)}"/>`);
      partes.push(`<rect x="${(pl[0] - (F * 0.12) / zl).toFixed(1)}" y="${(pl[1] - (F * 0.15) / zl).toFixed(1)}" width="${((F * 0.24) / zl).toFixed(1)}" height="${((F * 0.3) / zl).toFixed(1)}" fill="#ffcf7a" opacity="${(0.6 + 0.4 * P.brilhoJanela).toFixed(2)}"/>`);
      brilhos.push({ p: pl, r: (F * 2.4) / zl, cor: '#ffb054', a: 0.75 * P.brilhoJanela + 0.1 });
      if (zl > 4) reflexos.push({ x: xl, y: 2.7, z: zl, larg: 0.3, forte: true });
    }
  }

  // reflexos das luzes no chão molhado
  const refl = reflexos.map((f) => {
    const topo = proj(f.x * 0.92, 0, f.z), fundo = proj(f.x * 0.92, -f.y * 0.9, f.z);
    const w = Math.max(2, (F * f.larg) / f.z), h = Math.max(4, fundo[1] - topo[1]);
    // reflexo quebrado em faixas, como em pedras molhadas
    let faixas = '';
    for (let k = 0; k < 7; k++) {
      const y0 = topo[1] + (h * k) / 7, dx = Math.sin(k * 2.3 + f.z) * w * 0.35;
      faixas += `<rect x="${(topo[0] - w / 2 + dx).toFixed(1)}" y="${y0.toFixed(1)}" width="${(w * (0.6 + 0.4 * Math.cos(k))).toFixed(1)}" height="${(h / 7 * 0.6).toFixed(1)}" rx="${(w / 3).toFixed(1)}"/>`;
    }
    return `<g fill="#ffb25a" opacity="${f.forte ? 0.32 : 0.2}">${faixas}</g>`;
  }).join('');
  const brilho = brilhos.map((b) => `<circle cx="${b.p[0].toFixed(1)}" cy="${b.p[1].toFixed(1)}" r="${b.r.toFixed(1)}" fill="url(#halo)" opacity="${b.a.toFixed(2)}"/>`).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LARG} ${ALT}">
  <defs>
    <linearGradient id="gradChao" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="${P.chao}"/><stop offset=".55" stop-color="${misturar(P.chao, P.nevoa, 0.5)}"/><stop offset="1" stop-color="${P.nevoa}"/></linearGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="#ffc77a" stop-opacity=".95"/><stop offset=".25" stop-color="#ff9d3f" stop-opacity=".4"/><stop offset="1" stop-color="#ff8a30" stop-opacity="0"/></radialGradient>
    <filter id="textura" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="ruido"/>
      <feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 0.62" result="grao"/>
      <feComposite in="grao" in2="SourceGraphic" operator="in" result="graoRecortado"/>
      <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="graoRecortado"/></feMerge>
    </filter>
    <filter id="desfoqueReflexo" x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation="2.5 6"/></filter>
    <radialGradient id="vinheta" cx=".5" cy=".55" r=".75"><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${variante === 'relampago' ? 0.45 : 0.82}"/></radialGradient>
    <linearGradient id="sombraRua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="${variante === 'relampago' ? 0.15 : 0.35}"/><stop offset="1" stop-color="#000" stop-opacity="${variante === 'relampago' ? 0.35 : 0.75}"/></linearGradient>
  </defs>
  <g filter="url(#textura)">${partes.join('\n')}</g>
  <g filter="url(#desfoqueReflexo)">${refl}</g>
  <g style="mix-blend-mode:screen">${brilho}</g>
  <rect width="${LARG}" height="${ALT}" fill="url(#sombraRua)"/>
  <rect width="${LARG}" height="${ALT}" fill="url(#vinheta)"/>
</svg>`;
}

// ---------------- Doutor da Peste (proporções realistas) ----------------
// Desenhado de frente-três-quartos, com cajado e lanterna. Duas variantes:
// "silhueta" (contraluz na névoa) e "luz" (revelado pela lanterna e pelo relâmpago).
export const DOUTOR_VB = { w: 640, h: 1120 };

export function doutor(variante = 'luz') {
  const luz = variante === 'luz';
  const preto = '#07080b';
  const T = (cLuz, cSombra = preto) => (luz ? cLuz : cSombra);
  const contorno = luz ? '' : 'url(#contraluz)';

  const casaco = `M214 372 Q192 470 186 600 Q176 780 156 1010 Q190 1026 222 1016 L244 1032 L276 1020 L306 1036 L338 1020 L370 1034 L400 1018 L430 1030 L470 1010 Q452 820 444 620 Q436 470 418 372 Z`;
  const capa = `M196 356 Q312 318 432 356 Q462 420 458 500 Q430 520 404 506 Q380 530 352 512 Q322 534 294 514 Q262 532 236 510 Q208 522 182 504 Q176 420 196 356 Z`;
  const capuz = `M236 228 Q222 300 214 352 Q312 382 418 352 Q408 300 392 228 Z`;
  const cabeca = `M244 214 Q238 290 268 318 Q312 340 356 318 Q388 292 382 214 Z`;
  const bico = `M338 250 Q392 250 448 300 Q500 346 540 418 Q490 392 440 372 Q392 356 352 338 Q330 300 338 250 Z`;
  const aba = `M118 212 Q128 176 312 170 Q504 166 520 200 Q522 226 470 230 Q312 244 168 238 Q112 236 118 212 Z`;
  const copa = `M226 206 Q218 132 236 92 Q312 72 392 90 Q410 132 402 204 Q312 222 226 206 Z`;
  const fita = `M226 178 Q312 196 402 176 L402 204 Q312 222 226 206 Z`;
  const bracoE = `M214 384 Q172 430 160 520 Q152 590 156 650 L196 656 Q200 590 210 530 Q222 470 244 430 Z`;
  const bracoD = `M414 384 Q452 440 462 540 Q468 630 470 708 L430 712 Q426 640 420 560 Q410 470 392 430 Z`;
  const maoE = `M150 640 Q148 676 170 686 Q196 688 200 660 L198 640 Z`;
  const maoD = `M428 700 Q426 736 450 744 Q476 744 474 712 L472 698 Z`;
  const botaE = `M222 1012 L214 1066 Q212 1084 196 1086 L168 1088 Q156 1080 172 1072 Q196 1064 200 1048 L204 1012 Z`;
  const botaD = `M372 1012 L380 1064 Q384 1084 404 1086 L444 1088 Q456 1078 440 1070 Q414 1064 404 1046 L398 1012 Z`;
  const cajado = `M154 612 L104 1096`;
  const lanterna = { x: 452, y: 744 };

  const dobras = luz ? `
    <g fill="none" stroke-linecap="round" opacity=".9">
      <path d="M262 520 Q246 760 214 1016" stroke="#0c0a0a" stroke-width="10"/>
      <path d="M318 530 Q314 780 300 1036" stroke="#0c0a0a" stroke-width="7"/>
      <path d="M372 520 Q392 760 410 1018" stroke="#0c0a0a" stroke-width="9"/>
      <path d="M430 540 Q448 760 476 1010" stroke="#c98a45" stroke-width="5" opacity=".35"/>
      <path d="M384 540 Q404 760 424 1012" stroke="#b07a42" stroke-width="3" opacity=".3"/>
      <path d="M200 520 Q186 700 160 900" stroke="#7d8db0" stroke-width="3" opacity=".28"/>
    </g>` : '';

  const detalhesCabeca = luz ? `
    <path d="M346 266 Q400 270 444 306" stroke="#f3e2c0" stroke-width="4" fill="none" opacity=".55"/>
    <path d="M350 300 Q420 324 500 384" stroke="#6b5233" stroke-width="3" fill="none"/>
    <path d="M352 284 Q414 300 470 344" stroke="#2c2016" stroke-width="1.6" fill="none" stroke-dasharray="4 5"/>
    <ellipse cx="458" cy="336" rx="5" ry="3" fill="#20160f" transform="rotate(32 458 336)"/>
    <circle cx="282" cy="250" r="17" fill="#8a6a2e"/><circle cx="282" cy="250" r="11" fill="url(#vidro)"/>
    <circle cx="340" cy="254" r="21" fill="#a07a34"/><circle cx="340" cy="254" r="14" fill="url(#vidro)"/>
    <circle cx="335" cy="248" r="4" fill="#fff4cf"/><circle cx="278" cy="245" r="3" fill="#fff4cf"/>
    <path d="M298 250 Q310 244 320 250" stroke="#a07a34" stroke-width="5" fill="none"/>
    <path d="M312 214 Q306 270 318 318" stroke="#2a1d13" stroke-width="1.5" fill="none" stroke-dasharray="5 5"/>` : `
    <circle cx="340" cy="254" r="5" fill="#ffb347" opacity=".85"/><circle cx="282" cy="250" r="3.5" fill="#ffb347" opacity=".7"/>`;

  const halo = `<circle cx="${lanterna.x}" cy="${lanterna.y + 70}" r="${luz ? 260 : 170}" fill="url(#haloLanterna)"/>`;
  const lanternaSvg = `
    <path d="M${lanterna.x} ${lanterna.y - 4} L${lanterna.x} ${lanterna.y + 18}" stroke="#1a1410" stroke-width="3"/>
    <path d="M${lanterna.x - 22} ${lanterna.y + 34} L${lanterna.x} ${lanterna.y + 16} L${lanterna.x + 22} ${lanterna.y + 34} Z" fill="${T('#3b2d1a', '#120f0c')}"/>
    <rect x="${lanterna.x - 20}" y="${lanterna.y + 34}" width="40" height="62" rx="3" fill="url(#chama)"/>
    <path d="M${lanterna.x - 7} ${lanterna.y + 34} V${lanterna.y + 96} M${lanterna.x + 7} ${lanterna.y + 34} V${lanterna.y + 96}" stroke="${T('#4a3820', '#15110d')}" stroke-width="3"/>
    <path d="M${lanterna.x - 25} ${lanterna.y + 96} H${lanterna.x + 25} L${lanterna.x + 18} ${lanterna.y + 108} H${lanterna.x - 18} Z" fill="${T('#3b2d1a', '#120f0c')}"/>
    <path d="M${lanterna.x} ${lanterna.y + 80} Q${lanterna.x - 8} ${lanterna.y + 66} ${lanterna.x} ${lanterna.y + 50} Q${lanterna.x + 8} ${lanterna.y + 66} ${lanterna.x} ${lanterna.y + 80} Z" fill="#fff3c4"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${DOUTOR_VB.w} ${DOUTOR_VB.h}">
  <defs>
    <linearGradient id="gCasaco" x1="0" x2="1"><stop offset="0" stop-color="#121011"/><stop offset=".45" stop-color="#1e1915"/><stop offset=".78" stop-color="#2d231a"/><stop offset="1" stop-color="#4a3420"/></linearGradient>
    <linearGradient id="gCapa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#151314"/><stop offset=".7" stop-color="#261e18"/><stop offset="1" stop-color="#3f2c1c"/></linearGradient>
    <linearGradient id="gBico" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c29a"/><stop offset=".5" stop-color="#a88b62"/><stop offset="1" stop-color="#5e4a33"/></linearGradient>
    <radialGradient id="gCabeca" cx=".7" cy=".4" r=".8"><stop offset="0" stop-color="#5e4630"/><stop offset=".7" stop-color="#33261b"/><stop offset="1" stop-color="#17110c"/></radialGradient>
    <linearGradient id="gChapeu" x1="0" x2="1"><stop offset="0" stop-color="#0d0b0c"/><stop offset=".7" stop-color="#1d1817"/><stop offset="1" stop-color="#3a2c22"/></linearGradient>
    <radialGradient id="vidro" cx=".4" cy=".4" r=".7"><stop offset="0" stop-color="#ffe7a6"/><stop offset=".5" stop-color="#d48d2e"/><stop offset="1" stop-color="#4a2a0c"/></radialGradient>
    <linearGradient id="chama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a8"/><stop offset="1" stop-color="#e2832a"/></linearGradient>
    <radialGradient id="haloLanterna"><stop offset="0" stop-color="#ffc56e" stop-opacity="${luz ? 0.5 : 0.35}"/><stop offset=".45" stop-color="#ff9a3c" stop-opacity=".14"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
    <filter id="contraluz" x="-10%" y="-10%" width="120%" height="120%">
      <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="d"/>
      <feComposite in="d" in2="SourceAlpha" operator="out" result="borda"/>
      <feGaussianBlur in="borda" stdDeviation="2.5" result="bb"/>
      <feFlood flood-color="#8796b4" flood-opacity=".55"/><feComposite in2="bb" operator="in" result="rim"/>
      <feMerge><feMergeNode in="rim"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="material" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="9" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 -1 0.75" result="g"/>
      <feComposite in="g" in2="SourceAlpha" operator="in" result="gr"/>
      <feBlend in="SourceGraphic" in2="gr" mode="overlay"/>
    </filter>
    <filter id="rimQuente" x="-10%" y="-10%" width="120%" height="120%">
      <feOffset in="SourceAlpha" dx="-5" dy="-2" result="o"/>
      <feComposite in="SourceAlpha" in2="o" operator="out" result="b"/>
      <feGaussianBlur in="b" stdDeviation="2" result="bb"/>
      <feFlood flood-color="#ffb35a" flood-opacity=".75"/><feComposite in2="bb" operator="in" result="rim"/>
      <feOffset in="SourceAlpha" dx="5" dy="2" result="o2"/>
      <feComposite in="SourceAlpha" in2="o2" operator="out" result="b2"/>
      <feGaussianBlur in="b2" stdDeviation="2" result="bb2"/>
      <feFlood flood-color="#9fb2d8" flood-opacity=".4"/><feComposite in2="bb2" operator="in" result="rim2"/>
      <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="rim"/><feMergeNode in="rim2"/></feMerge>
    </filter>
  </defs>
  <ellipse cx="320" cy="1090" rx="230" ry="20" fill="#000" opacity=".55"/>
  ${halo}
  <g filter="${luz ? 'url(#rimQuente)' : contorno}">
    <g filter="${luz ? 'url(#material)' : ''}">
      <path d="${cajado}" stroke="${T('#3a2a1a', preto)}" stroke-width="13" stroke-linecap="round"/>
      <path d="${botaE}" fill="${T('#151110')}"/><path d="${botaD}" fill="${T('#151110')}"/>
      <path d="${casaco}" fill="${T('url(#gCasaco)')}"/>
      ${dobras}
      <path d="${bracoE}" fill="${T('#1a1614')}"/><path d="${bracoD}" fill="${T('#2a2019')}"/>
      <path d="${capuz}" fill="${T('#110f10')}"/>
      <path d="${capa}" fill="${T('url(#gCapa)')}"/>
      ${luz ? '<path d="M198 470 Q312 440 456 470" stroke="#5a1720" stroke-width="5" fill="none" opacity=".8"/>' : ''}
      <path d="${cabeca}" fill="${T('url(#gCabeca)')}"/>
      <path d="${bico}" fill="${T('url(#gBico)')}"/>
      ${detalhesCabeca}
      <path d="${copa}" fill="${T('url(#gChapeu)')}"/>
      <path d="${fita}" fill="${T('#4e1018')}"/>
      ${luz ? '<rect x="328" y="186" width="22" height="22" fill="none" stroke="#a07a34" stroke-width="4"/>' : ''}
      <path d="${aba}" fill="${T('url(#gChapeu)')}"/>
      <path d="${maoE}" fill="${T('#211710')}"/><path d="${maoD}" fill="${T('#2a1d13')}"/>
      ${luz ? '<path d="M150 620 L162 604 L172 620" stroke="#8a6a2e" stroke-width="5" fill="none"/>' : ''}
    </g>
  </g>
  ${lanternaSvg}
</svg>`;
}

// ---------------- rato (perfil, proporções naturais) ----------------
export const RATO = { w: 300, h: 110, quadros: 6 };

export function ratoQuadro(i) {
  const fase = (i / RATO.quadros) * Math.PI * 2;
  const bob = Math.sin(fase * 2) * 1.6;
  const perna = (x, y, desloc, comp = 18) => {
    const ang = Math.sin(fase + desloc) * 0.6;
    const px = x + Math.sin(ang) * comp, py = y + Math.cos(ang) * comp;
    return `<path d="M${x} ${y} Q${(x + px) / 2 - 3} ${(y + py) / 2} ${px.toFixed(1)} ${py.toFixed(1)} L${(px + 7).toFixed(1)} ${(py + 1).toFixed(1)}" stroke="#2a221d" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  };
  const cauda = Math.sin(fase) * 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${RATO.w} ${RATO.h}">
  <defs>
    <linearGradient id="pelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e2722"/><stop offset=".45" stop-color="#463b33"/><stop offset=".8" stop-color="#5d5044"/><stop offset="1" stop-color="#857565"/></linearGradient>
    <filter id="pelagem" x="-5%" y="-10%" width="110%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.6 0.15" numOctaves="2" seed="3" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d"/>

    </filter>
  </defs>
  <ellipse cx="190" cy="${(100).toFixed(1)}" rx="80" ry="6" fill="#000" opacity=".35"/>
  <path d="M112 ${(70 + bob).toFixed(1)} Q70 ${(78 + cauda).toFixed(1)} 40 ${(74 - cauda * 0.6).toFixed(1)} Q16 ${(70 + cauda).toFixed(1)} 4 ${(82 + cauda * 0.4).toFixed(1)}" stroke="#7d6a5e" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <path d="M112 ${(70 + bob).toFixed(1)} Q70 ${(78 + cauda).toFixed(1)} 40 ${(74 - cauda * 0.6).toFixed(1)}" stroke="#5c4c42" stroke-width="2" fill="none" opacity=".6"/>
  <g transform="translate(0 ${bob.toFixed(1)})">
    ${perna(140, 82, Math.PI)}${perna(222, 80, 0, 15)}
    <g filter="url(#pelagem)">
      <path d="M108 72 Q110 44 150 40 Q200 34 230 48 Q250 54 266 64 Q282 70 292 76 Q284 82 266 84 Q240 90 210 90 Q160 94 128 88 Q108 84 108 72 Z" fill="url(#pelo)"/>
      <ellipse cx="236" cy="48" rx="11" ry="12" fill="#5e4e44"/>
    </g>
    <ellipse cx="236" cy="49" rx="6" ry="7" fill="#a07f75" opacity=".7"/>
    <circle cx="258" cy="60" r="3.6" fill="#050405"/><circle cx="259" cy="59" r="1.1" fill="#d8d0c8"/>
    <circle cx="291" cy="76" r="2.6" fill="#b48a84"/>
    <g stroke="#cfc6bb" stroke-width=".7" opacity=".55" fill="none"><path d="M284 74 Q300 66 312 64"/><path d="M284 76 Q302 76 314 78"/><path d="M283 78 Q298 86 308 92"/></g>
    ${perna(130, 84, 0)}${perna(214, 82, Math.PI, 15)}
  </g>
</svg>`;
}
