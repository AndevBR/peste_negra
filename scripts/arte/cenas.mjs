// Diagramas científicos, cenas do cotidiano, cenário da página inicial e ícone do site.
import { svg, defsComuns, C } from './comum.mjs';

const tinta = (w = 3) => `stroke="${C.tinta}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const FONTE = `font-family="Georgia, 'Times New Roman', serif"`;
const rotulo = (x, y, txt, { tam = 15, cor = C.tinta, anc = 'middle', peso = 'bold' } = {}) =>
  `<text x="${x}" y="${y}" ${FONTE} font-size="${tam}" font-weight="${peso}" fill="${cor}" text-anchor="${anc}">${txt}</text>`;

function seta(x1, y1, x2, y2, { cor = C.bordo, tracejada = false, curva = 0 } = {}) {
  const mx = (x1 + x2) / 2 - (y2 - y1) * curva, my = (y1 + y2) / 2 + (x2 - x1) * curva;
  const ang = Math.atan2(y2 - my, x2 - mx), s = 12;
  const p1 = [x2 - s * Math.cos(ang - 0.45), y2 - s * Math.sin(ang - 0.45)], p2 = [x2 - s * Math.cos(ang + 0.45), y2 - s * Math.sin(ang + 0.45)];
  return `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="${cor}" stroke-width="4" stroke-linecap="round" ${tracejada ? 'stroke-dasharray="9 8"' : ''}/>
  <path d="M${x2} ${y2} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} Z" fill="${cor}"/>`;
}

// ---------- pequenos ícones reutilizados ----------
function rato(x, y, e = 1) {
  return `<g transform="translate(${x} ${y}) scale(${e})">
    <path d="M40 10 Q70 0 82 18" fill="none" stroke="${C.tinta}" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="0" cy="0" rx="40" ry="24" fill="#7d736a" ${tinta()}/>
    <path d="M-30 -10 Q-58 -6 -64 6 Q-56 14 -32 12 Z" fill="#7d736a" ${tinta()}/>
    <circle cx="-26" cy="-22" r="10" fill="#9a8f84" ${tinta()}/><circle cx="-26" cy="-22" r="5" fill="#d9a3a0"/>
    <circle cx="-46" cy="-2" r="3" fill="${C.tinta}"/><circle cx="-64" cy="6" r="3.5" fill="#d9a3a0" stroke="${C.tinta}" stroke-width="1.5"/>
    <path d="M-20 22 L-24 30 M14 22 L18 30" ${tinta(3)}/>
  </g>`;
}
function pulga(x, y, e = 1) {
  return `<g transform="translate(${x} ${y}) scale(${e})">
    <ellipse cx="0" cy="0" rx="22" ry="15" fill="#6b3a1f" ${tinta()} transform="rotate(-15)"/>
    <circle cx="-22" cy="-4" r="8" fill="#5a2f18" ${tinta()}/>
    <path d="M-28 0 L-36 10" ${tinta(2.5)}/>
    <path d="M-8 12 Q-14 24 -20 26 M2 13 Q4 26 -2 30 M12 10 Q26 18 30 34 Q34 30 34 24" fill="none" ${tinta(2.5)}/>
    <path d="M-6 -8 Q2 -12 10 -8" stroke="#a96a40" stroke-width="2.5" fill="none"/>
  </g>`;
}
function pessoa(x, y, e = 1, cor = '#5e6f8a', { tosse = false, marcas = '' } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${e})">
    <path d="M-30 80 Q-32 30 0 26 Q32 30 30 80 Z" fill="${cor}" ${tinta()}/>
    <circle cx="0" cy="0" r="22" fill="${C.pele2}" ${tinta()}/>
    <path d="M-20 -6 Q-18 -26 0 -24 Q18 -26 20 -6 Q8 -14 -20 -6 Z" fill="#3a2a1d" ${tinta(2)}/>
    <circle cx="-7" cy="0" r="2.5" fill="${C.tinta}"/><circle cx="8" cy="0" r="2.5" fill="${C.tinta}"/>
    ${tosse ? `<ellipse cx="12" cy="12" rx="5" ry="4" fill="${C.tinta}"/>${[[34, 2], [44, 14], [38, 22], [54, 6], [52, 24]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3" fill="#7fa6b8" stroke="${C.tinta}" stroke-width="1"/>`).join('')}`
      : `<path d="M-6 12 Q0 15 6 12" ${tinta(2)} fill="none"/>`}
    ${marcas}
  </g>`;
}

// ---------- diagramas ----------
export function bacteria() {
  const bastonete = (x, y, a, e = 1) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${e})">
      <rect x="-34" y="-13" width="68" height="26" rx="13" fill="#d98a8f" ${tinta(2.5)}/>
      <ellipse cx="-20" cy="0" rx="10" ry="9" fill="#9b2f3d"/><ellipse cx="20" cy="0" rx="10" ry="9" fill="#9b2f3d"/>
      <path d="M-24 -7 Q0 -11 24 -7" stroke="#fff" stroke-width="2.5" fill="none" opacity=".55"/>
    </g>`;
  const pos = [[150, 140, 20], [235, 110, -30], [210, 200, 70], [120, 230, -10], [290, 190, 15], [180, 290, -40], [270, 280, 50], [110, 320, 30], [320, 110, 80], [330, 330, -20], [80, 170, 60], [250, 360, 10]];
  return svg({
    viewBox: '0 0 640 440',
    titulo: 'Bactéria Yersinia pestis vista ao microscópio (representação didática)',
    descricao: 'Campo circular de microscópio com bactérias em forma de bastonete, mais escuras nas extremidades, e uma escala indicando cerca de 1 a 3 micrômetros de comprimento.',
    conteudo: `<defs><radialGradient id="campo" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#fbf4e4"/><stop offset=".85" stop-color="#efe0c2"/><stop offset="1" stop-color="#c7ad7c"/></radialGradient></defs>
    <circle cx="220" cy="220" r="196" fill="#2a211d" ${tinta(4)}/>
    <circle cx="220" cy="220" r="180" fill="url(#campo)" stroke="${C.latao}" stroke-width="8"/>
    <clipPath id="lente"><circle cx="220" cy="220" r="176"/></clipPath>
    <g clip-path="url(#lente)">${pos.map(([x, y, a]) => bastonete(x, y, a)).join('')}</g>
    <g transform="translate(528 120)">
      ${bastonete(0, 0, 0, 2.2)}
      ${seta(-20, 58, -40, 20, { cor: C.tinta })}${rotulo(0, 80, 'extremidades', { tam: 15 })}${rotulo(0, 98, 'mais coradas*', { tam: 15, peso: 'normal' })}
      ${rotulo(0, -48, 'forma de bastonete', { tam: 16 })}
      ${rotulo(0, 150, '≈ 1 a 3 µm', { tam: 22, cor: C.bordo })}
      ${rotulo(0, 174, 'de comprimento', { tam: 15, peso: 'normal' })}
      ${rotulo(0, 214, 'Visível só ao', { tam: 15, peso: 'normal' })}${rotulo(0, 234, 'microscópio', { tam: 15, peso: 'normal' })}${rotulo(0, 290, '* em certas colorações', { tam: 12, peso: 'normal', cor: C.pedraEscura })}
    </g>`,
  });
}

export function cicloTransmissao() {
  return svg({
    viewBox: '0 0 760 520',
    titulo: 'Ciclo de transmissão da peste',
    descricao: 'Roedores e suas pulgas mantêm a bactéria na natureza. A picada de pulgas infectadas pode transmitir a peste às pessoas, causando a forma bubônica. Na forma pneumônica, a bactéria passa de pessoa para pessoa por gotículas respiratórias. Pulgas humanas e piolhos são uma hipótese debatida para parte dos surtos medievais.',
    conteudo: `<rect x="6" y="6" width="748" height="508" rx="22" fill="#f7eedb" stroke="${C.pergaminhoEscuro}" stroke-width="3"/>
    <ellipse cx="170" cy="200" rx="140" ry="118" fill="#efe1c0" stroke="${C.ouroVelho}" stroke-width="2.5" stroke-dasharray="6 6"/>
    ${rotulo(170, 64, 'Ciclo na natureza', { tam: 18, cor: C.bordo })}
    ${rato(130, 252, 1.15)}${pulga(212, 140, 1.1)}
    ${seta(110, 210, 180, 128, { curva: -0.25 })}${seta(236, 172, 168, 236, { curva: -0.25 })}
    ${rotulo(170, 340, 'roedores silvestres e ratos', { tam: 15, peso: 'normal' })}
    ${pessoa(470, 150, 1.1, '#6b5a8a')}
    ${rotulo(470, 82, 'Pessoa picada', { tam: 17, cor: C.bordo })}
    ${seta(250, 132, 420, 150, { curva: -0.12 })}
    ${rotulo(338, 108, 'picada da pulga', { tam: 15, peso: 'normal' })}
    ${rotulo(470, 262, 'peste bubônica', { tam: 15 })}
    ${pessoa(470, 360, 1, '#6b5a8a', { tosse: true })}${pessoa(650, 360, 1, '#5b7a5e')}
    ${seta(470, 270, 470, 330, { curva: 0 })}
    ${rotulo(470, 470, 'pode evoluir para', { tam: 14, peso: 'normal' })}${rotulo(470, 490, 'peste pneumônica', { tam: 15 })}
    ${seta(530, 368, 610, 368, {})}
    ${rotulo(650, 470, 'gotículas', { tam: 14, peso: 'normal' })}${rotulo(650, 490, 'pessoa a pessoa', { tam: 15 })}
    ${seta(560, 170, 620, 300, { cor: C.pedra, tracejada: true, curva: -0.2 })}
    ${rotulo(668, 168, 'pulgas humanas', { tam: 13, peso: 'normal', cor: C.pedraEscura })}${rotulo(668, 186, 'e piolhos?', { tam: 13, peso: 'normal', cor: C.pedraEscura })}
    ${rotulo(668, 206, '(hipótese debatida)', { tam: 12, peso: 'normal', cor: C.pedraEscura })}
    ${seta(150, 360, 400, 470, { cor: C.pedra, tracejada: true, curva: 0.15 })}
    ${rotulo(196, 452, 'contato com animais', { tam: 13, peso: 'normal', cor: C.pedraEscura })}${rotulo(196, 470, 'ou tecidos infectados', { tam: 13, peso: 'normal', cor: C.pedraEscura })}`,
  });
}

export function formasPeste() {
  const silhueta = (cor) => `<g ${tinta(3)}>
      <circle cx="0" cy="-118" r="26" fill="${cor}"/>
      <path d="M-34 -84 Q0 -96 34 -84 L44 0 L30 4 L26 -46 L22 30 L26 118 L6 118 L0 40 L-6 118 L-26 118 L-22 30 L-26 -46 L-30 4 L-44 0 Z" fill="${cor}"/>
    </g>`;
  const painel = (x, titulo, sub, extra) => `<g transform="translate(${x} 0)">
      <rect x="10" y="10" width="236" height="380" rx="18" fill="#f7eedb" stroke="${C.pergaminhoEscuro}" stroke-width="3"/>
      ${rotulo(128, 46, titulo, { tam: 19, cor: C.bordo })}
      <g transform="translate(128 218)">${silhueta('#e6d3b0')}${extra}</g>
      ${rotulo(128, 360, sub[0], { tam: 14, peso: 'normal' })}${rotulo(128, 378, sub[1], { tam: 14, peso: 'normal' })}
    </g>`;
  const ponto = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="${C.bordo}" stroke="${C.tinta}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="15" fill="none" stroke="${C.bordo}" stroke-width="2" opacity=".5"/>`;
  const vasos = `<g stroke="${C.bordo}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85">
      <path d="M0 -84 L0 30 M0 -70 L-32 0 M0 -70 L32 0 M0 30 L-14 116 M0 30 L14 116 M0 -60 Q-12 -40 -20 -20 M0 -40 Q12 -20 18 0"/></g>`;
  const pulmoes = `<g ${tinta(2.5)}><path d="M-6 -78 Q-30 -76 -30 -40 Q-30 -20 -8 -24 Z" fill="#c9636c"/><path d="M6 -78 Q30 -76 30 -40 Q30 -20 8 -24 Z" fill="#c9636c"/></g>
      ${[[40, -110], [52, -96], [46, -84], [62, -104]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3.5" fill="#7fa6b8" stroke="${C.tinta}" stroke-width="1"/>`).join('')}`;
  return svg({
    viewBox: '0 0 780 400',
    titulo: 'As três formas clínicas da peste',
    descricao: 'Peste bubônica: ínguas inchadas (bubões) no pescoço, axilas e virilha. Peste septicêmica: a bactéria se espalha pelo sangue. Peste pneumônica: atinge os pulmões e pode passar entre pessoas por gotículas.',
    conteudo: painel(0, 'Bubônica', ['ínguas inchadas', '(bubões)'], ponto(-14, -96) + ponto(-30, -60) + ponto(30, -60) + ponto(-14, 24) + ponto(14, 24))
      + painel(262, 'Septicêmica', ['infecção que se', 'espalha pelo sangue'], vasos)
      + painel(524, 'Pneumônica', ['atinge os pulmões;', 'passa por gotículas'], pulmoes),
  });
}

export function mapaLegenda() { return ''; }

// ---------- cenas do cotidiano ----------
function cena(titulo, descricao, conteudo, ceu = '#c9d6d2') {
  return svg({
    viewBox: '0 0 400 260',
    titulo, descricao,
    conteudo: `${defsComuns()}<clipPath id="q"><rect x="4" y="4" width="392" height="252" rx="18"/></clipPath>
    <g clip-path="url(#q)"><rect width="400" height="260" fill="${ceu}"/>${conteudo}</g>
    <rect x="4" y="4" width="392" height="252" rx="18" fill="none" stroke="${C.tinta}" stroke-width="5"/>
    <rect x="12" y="12" width="376" height="236" rx="12" fill="none" stroke="${C.latao}" stroke-width="2" opacity=".7"/>`,
  });
}

function casa(x, y, l, a, { cor = '#e8dcc0', telhado = '#8a4b32', inclina = 0, janelaAcesa = false } = {}) {
  const viga = '#4a3122';
  return `<g transform="translate(${x} ${y}) skewX(${inclina})" ${tinta(3)}>
    <rect x="0" y="0" width="${l}" height="${a}" fill="${cor}"/>
    <path d="M0 ${a * 0.45} L${l} ${a * 0.45} M${l * 0.33} 0 L${l * 0.33} ${a} M${l * 0.66} 0 L${l * 0.66} ${a} M0 0 L${l * 0.33} ${a * 0.45} M${l} 0 L${l * 0.66} ${a * 0.45}" stroke="${viga}" stroke-width="5"/>
    <rect x="${l * 0.08}" y="${a * 0.12}" width="${l * 0.18}" height="${a * 0.22}" fill="${janelaAcesa ? '#ffcf6b' : '#3b3a40'}"/>
    <rect x="${l * 0.4}" y="${a * 0.6}" width="${l * 0.2}" height="${a * 0.4}" fill="#4a3122"/>
    <path d="M-10 0 L${l / 2} ${-a * 0.6} L${l + 10} 0 Z" fill="${telhado}"/>
  </g>`;
}

export const CENAS = {
  'moradias-ruas': () => cena('Rua estreita de uma cidade medieval', 'Casas de madeira e taipa coladas umas às outras, rua de terra com lama e uma valeta de esgoto a céu aberto.',
    `<rect y="200" width="400" height="60" fill="#7b6a52"/>
    ${casa(-10, 70, 110, 140, { inclina: 3 })}${casa(110, 90, 90, 120, { cor: '#d9c9a4', telhado: '#6e3b2a' })}${casa(210, 60, 100, 150, { cor: '#e2d3b0', inclina: -2 })}${casa(318, 84, 100, 126, { telhado: '#7a1f2b' })}
    <path d="M0 236 Q200 222 400 238" stroke="#4d4a3a" stroke-width="10" fill="none"/>
    <path d="M0 236 Q200 222 400 238" stroke="#6f7b5a" stroke-width="4" fill="none"/>
    ${[[60, 220], [170, 214], [300, 226]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="18" ry="4" fill="#5a4a36"/>`).join('')}
    ${rato(250, 214, 0.35)}`),
  mercado: () => cena('Barraca de mercado medieval', 'Barraca com toldo listrado vendendo pães, repolhos e peixes, com uma balança de pratos.',
    `<rect y="190" width="400" height="70" fill="#9a8668"/>
    ${casa(-20, 40, 140, 150, { cor: '#ddcca6' })}${casa(290, 50, 130, 140, { cor: '#e6d6b2', telhado: '#6e3b2a' })}
    <g ${tinta(3)}><rect x="110" y="120" width="190" height="80" fill="#8c5f38"/><rect x="104" y="112" width="202" height="14" fill="#6b4528"/>
    <path d="M100 70 L310 70 L320 112 L90 112 Z" fill="${C.pergaminho}"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path d="M${100 + i * 42} 70 L${121 + i * 42} 70 L${116 + i * 46} 112 L${90 + i * 46} 112 Z" fill="${C.bordo}"/>`).join('')}
    <ellipse cx="140" cy="106" rx="16" ry="10" fill="#d6a35a"/><ellipse cx="168" cy="104" rx="16" ry="10" fill="#d6a35a"/>
    <circle cx="206" cy="102" r="12" fill="${C.erva}"/><circle cx="228" cy="104" r="12" fill="#77a865"/>
    <path d="M250 104 Q266 94 284 104 Q266 112 250 104 Z M284 104 L292 98 L292 110 Z" fill="#9fb2bd"/></g>
    <g ${tinta(2.5)} fill="none"><path d="M150 150 L150 132 M128 150 L172 150"/><path d="M128 150 L120 164 L136 164 Z M172 150 L164 164 L180 164 Z" fill="${C.latao}"/></g>`),
  alimentacao: () => cena('Mesa com alimentos da época', 'Mesa simples com pão escuro, uma tigela de sopa espessa de cereais e legumes, cebolas e uma jarra.',
    `<rect width="400" height="260" fill="#6e5a44"/><rect y="0" width="400" height="150" fill="#857057"/>
    <rect x="300" y="30" width="70" height="60" fill="#2f2a26" ${tinta(3)}/><path d="M300 60 L370 60 M335 30 L335 90" stroke="#5a4635" stroke-width="5"/>
    <g ${tinta(3)}><rect x="20" y="160" width="360" height="26" fill="#8c5f38"/><rect x="40" y="186" width="16" height="70" fill="#6b4528"/><rect x="344" y="186" width="16" height="70" fill="#6b4528"/>
    <ellipse cx="110" cy="146" rx="52" ry="22" fill="#7a5226"/><path d="M76 140 Q110 128 144 140" fill="none" stroke-width="2"/>
    <path d="M170 140 Q210 130 250 140 Q246 166 210 168 Q174 166 170 140 Z" fill="#b5764a"/><ellipse cx="210" cy="140" rx="40" ry="9" fill="#c7a25a"/>
    <path d="M280 80 Q270 100 276 120 L272 158 L318 158 L314 120 Q320 100 310 80 Z" fill="#9c6b4a"/>
    <circle cx="150" cy="168" r="0" fill="none"/>
    <circle cx="334" cy="150" r="10" fill="#d9b48a"/><circle cx="352" cy="152" r="9" fill="#cfa77a"/></g>
    <g stroke="#fff" stroke-width="2.5" fill="none" opacity=".7"><path d="M200 128 Q194 116 202 106"/><path d="M220 126 Q226 114 218 104"/></g>`, '#857057'),
  higiene: () => cena('Poço e lavagem na vila', 'Poço de pedra com balde, uma bacia e lixo acumulado perto das casas; a água e o lixo eram problemas comuns.',
    `<rect y="180" width="400" height="80" fill="#8a7a5c"/>
    ${casa(240, 40, 150, 150, { cor: '#ddcca6' })}
    <g ${tinta(3)}><path d="M60 140 L60 200 Q120 214 180 200 L180 140 Z" fill="${C.pedra}"/><ellipse cx="120" cy="140" rx="60" ry="14" fill="${C.pedraClara}"/>
    <ellipse cx="120" cy="140" rx="46" ry="9" fill="#2f3b40"/>
    <path d="M70 140 L70 70 M170 140 L170 70 M62 70 L178 70" stroke-width="5" stroke="${C.madeira}"/>
    <path d="M120 70 L120 96" stroke-width="2"/><path d="M106 96 L134 96 L130 120 L110 120 Z" fill="#8c5f38"/>
    <ellipse cx="220" cy="226" rx="34" ry="10" fill="#b5764a"/></g>
    ${[[300, 226], [330, 236], [360, 222]].map(([a, b], i) => `<circle cx="${a}" cy="${b}" r="${8 + i * 2}" fill="#6a5b42" stroke="${C.tinta}" stroke-width="2"/>`).join('')}
    ${rato(330, 214, 0.32)}`),
  crencas: () => cena('Crenças sobre a causa da peste', 'Céu com três planetas em conjunção e vapores esverdeados saindo do chão, representando a teoria dos miasmas; um pomander perfumado em primeiro plano.',
    `<defs><linearGradient id="cn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f2034"/><stop offset="1" stop-color="#5a4a5e"/></linearGradient></defs>
    <rect width="400" height="260" fill="url(#cn)"/>
    ${[[60, 40], [120, 70], [330, 30], [370, 90], [250, 50]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.8" fill="#fff6d8"/>`).join('')}
    <circle cx="170" cy="56" r="12" fill="#e6c482" ${tinta(2)}/><circle cx="206" cy="48" r="9" fill="#d98a5a" ${tinta(2)}/><circle cx="238" cy="60" r="11" fill="#c9b9a0" ${tinta(2)}/>
    <ellipse cx="238" cy="60" rx="20" ry="5" fill="none" stroke="#c9b9a0" stroke-width="2"/>
    <rect y="200" width="400" height="60" fill="#3d4a34"/>
    ${casa(10, 120, 90, 90, { cor: '#b8ab8c', janelaAcesa: true })}${casa(300, 110, 90, 100, { cor: '#b8ab8c', telhado: '#5e2a22' })}
    <g fill="none" stroke="#9cc68a" stroke-width="7" stroke-linecap="round" opacity=".55">
      <path d="M120 230 Q100 200 130 180 Q160 160 140 130"/><path d="M200 236 Q230 200 200 170 Q170 140 210 110"/><path d="M270 232 Q250 210 280 186 Q300 166 286 140"/></g>
    <g ${tinta(3)}><path d="M196 196 L196 214" stroke="${C.latao}" stroke-width="3"/><circle cx="196" cy="232" r="20" fill="${C.latao}"/>
    <path d="M182 226 Q196 218 210 226 M180 238 Q196 246 212 238" fill="none" stroke="#7a5614" stroke-width="2.5"/></g>`, '#1f2034'),
  quarentena: () => cena('Quarentena no porto', 'Navio ancorado afastado do porto e uma ilha com um lazareto, onde pessoas e mercadorias ficavam isoladas por um período.',
    `<defs><linearGradient id="mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f8a96"/><stop offset="1" stop-color="#2f5562"/></linearGradient></defs>
    <rect y="150" width="400" height="110" fill="url(#mar)"/>
    <path d="M0 150 L120 150 L120 260 L0 260 Z" fill="${C.pedra}"/>${casa(10, 70, 90, 80, { cor: '#d9c9a4', telhado: '#7a1f2b' })}
    <path d="M250 160 Q300 140 360 160 Z" fill="#7d8a5a" ${tinta(3)}/><rect x="282" y="120" width="44" height="34" fill="#e2d3b0" ${tinta(3)}/><path d="M276 120 L304 100 L332 120 Z" fill="#6e3b2a" ${tinta(3)}/>
    <g ${tinta(3)}><path d="M150 196 L246 196 L232 220 L164 220 Z" fill="#6b4528"/><path d="M196 196 L196 120" stroke-width="4"/><path d="M198 124 L236 170 L198 176 Z" fill="${C.pergaminho}"/>
    <path d="M196 120 L180 126 L196 132" fill="${C.bordo}"/></g>
    <path d="M196 220 L176 250" stroke="${C.tinta}" stroke-width="2" stroke-dasharray="4 4"/>
    <g fill="none" stroke="#cfe2e4" stroke-width="2.5" opacity=".7"><path d="M140 236 q10 -6 20 0 t20 0"/><path d="M260 210 q10 -6 20 0 t20 0"/><path d="M300 240 q10 -6 20 0 t20 0"/></g>
    <rect x="8" y="198" width="104" height="40" rx="6" fill="${C.pergaminho}" ${tinta(2.5)}/>
    <text x="60" y="226" ${FONTE} font-size="20" font-weight="bold" fill="${C.bordo}" text-anchor="middle">40 dias</text>`, '#b9c9c9'),
  'familias-trabalho': () => cena('Campos com poucos trabalhadores', 'Campo de trigo com uma única pessoa trabalhando e uma casa abandonada ao fundo, representando a falta de mão de obra após a epidemia.',
    `<rect y="120" width="400" height="140" fill="#c9a85a"/>
    <path d="M0 120 Q100 100 200 116 Q300 132 400 112 L400 140 L0 140 Z" fill="#7d8a5a"/>
    <g transform="translate(290 70)" ${tinta(3)}><rect width="80" height="56" fill="#b8ab8c"/><path d="M-8 0 L40 -30 L88 0 Z" fill="#6e5a44"/><path d="M14 -10 L34 -22" stroke-width="4"/><rect x="30" y="26" width="18" height="30" fill="#2f2a26"/></g>
    ${Array.from({ length: 18 }, (_, i) => `<path d="M${10 + i * 22} 250 L${14 + i * 22} ${180 + (i % 3) * 6}" stroke="#8a6a2a" stroke-width="3"/>`).join('')}
    ${pessoa(150, 150, 0.9, '#5e6f8a')}
    <g ${tinta(3)}><path d="M178 190 L210 126" stroke="${C.madeira}" stroke-width="5"/><path d="M210 126 Q236 128 240 150" fill="none" stroke="${C.pedra}" stroke-width="5"/></g>
    <g ${tinta(2)}><ellipse cx="80" cy="220" rx="18" ry="7" fill="${C.latao}"/><ellipse cx="86" cy="212" rx="18" ry="7" fill="#d9b44a"/></g>`, '#d9d4bf'),
};

// ---------- cenário da página inicial (camadas para o efeito parallax) ----------
export function heroCeu() {
  return svg({
    viewBox: '0 0 1600 900', titulo: 'Céu ao entardecer sobre uma cidade medieval',
    conteudo: `<defs><linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1d1722"/><stop offset=".45" stop-color="#4a2a33"/><stop offset=".75" stop-color="#9a5a3a"/><stop offset="1" stop-color="#d9a35e"/></linearGradient>
      <radialGradient id="lua"><stop offset="0" stop-color="#fff6d8"/><stop offset=".6" stop-color="#f3dfae"/><stop offset="1" stop-color="#f3dfae" stop-opacity="0"/></radialGradient></defs>
    <rect width="1600" height="900" fill="url(#ceu)"/>
    <circle cx="1180" cy="210" r="150" fill="url(#lua)" opacity=".35"/>
    <circle cx="1180" cy="210" r="62" fill="#f6e7c1"/><circle cx="1160" cy="196" r="10" fill="#e6d1a0"/><circle cx="1196" cy="228" r="14" fill="#e6d1a0"/>
    ${[[120, 90], [300, 160], [520, 70], [760, 130], [960, 60], [1400, 110], [1520, 200], [640, 220], [220, 260]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff6d8" opacity=".8"/>`).join('')}
    <g fill="#2b1d24" opacity=".55"><path d="M0 300 Q200 250 420 300 Q600 340 800 290 L800 330 Q500 370 0 340 Z"/><path d="M900 380 Q1150 330 1400 370 Q1500 390 1600 360 L1600 410 Q1200 420 900 410 Z"/></g>`,
  });
}

function torre(x, base, l, a, telhadoA, cor) {
  return `<rect x="${x}" y="${base - a}" width="${l}" height="${a}" fill="${cor}"/><path d="M${x - 6} ${base - a} L${x + l / 2} ${base - a - telhadoA} L${x + l + 6} ${base - a} Z" fill="${cor}"/>`;
}

export function heroCidadeLonge() {
  const cor = '#3a2f3a';
  return svg({
    viewBox: '0 0 1600 900', titulo: 'Silhueta distante de uma cidade medieval',
    conteudo: `<g fill="${cor}">
      <path d="M0 640 Q300 560 600 610 Q900 660 1200 590 Q1420 550 1600 600 L1600 900 L0 900 Z" opacity=".8"/>
      ${torre(180, 640, 40, 120, 60, cor)}${torre(260, 650, 70, 70, 40, cor)}${torre(420, 640, 30, 160, 90, cor)}
      <rect x="560" y="520" width="200" height="140"/>${torre(580, 540, 40, 120, 140, cor)}${torre(700, 540, 40, 110, 130, cor)}
      <path d="M560 520 L660 450 L760 520 Z"/>
      ${torre(860, 660, 50, 90, 50, cor)}${torre(960, 650, 30, 140, 80, cor)}${torre(1080, 660, 90, 60, 50, cor)}
      ${torre(1260, 640, 36, 150, 70, cor)}${torre(1340, 650, 80, 80, 40, cor)}${torre(1480, 640, 40, 120, 60, cor)}
      <rect x="0" y="650" width="1600" height="250"/>
    </g>
    ${[[600, 590], [720, 600], [980, 600], [1280, 590]].map(([x, y]) => `<rect x="${x}" y="${y}" width="6" height="10" fill="#e8a24a" opacity=".7"/>`).join('')}`,
  });
}

export function heroCidadePerto() {
  const cor = '#211a1e', luz = '#ffbe5c';
  const casas = [[0, 760, 150, 170], [150, 780, 130, 140], [280, 770, 120, 160], [1180, 770, 140, 160], [1320, 760, 130, 180], [1450, 780, 160, 150]];
  return svg({
    viewBox: '0 0 1600 900', titulo: 'Casas medievais em primeiro plano',
    conteudo: `<g fill="${cor}">
      ${casas.map(([x, b, l, a]) => `<rect x="${x}" y="${b - a}" width="${l}" height="${a + 200}"/><path d="M${x - 10} ${b - a} L${x + l / 2} ${b - a - a * 0.55} L${x + l + 10} ${b - a} Z"/>`).join('')}
      <path d="M0 820 Q400 790 800 805 Q1200 820 1600 795 L1600 900 L0 900 Z"/>
    </g>
    ${casas.map(([x, b, l, a], i) => `<rect x="${x + l * 0.2}" y="${b - a * 0.7}" width="${l * 0.18}" height="${a * 0.18}" fill="${luz}" opacity="${i % 2 ? 0.85 : 0.6}"/>`).join('')}
    <g stroke="#3a2c30" stroke-width="5">${casas.map(([x, b, l, a]) => `<path d="M${x} ${b - a * 0.45} L${x + l} ${b - a * 0.45}" />`).join('')}</g>`,
  });
}

// ---------- ícone do site ----------
export function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="31" fill="${C.bordo}"/>
  <path d="M10 26 Q12 18 32 18 Q52 18 54 24 Q54 28 48 28 L16 29 Q9 30 10 26 Z" fill="#1e1714"/>
  <path d="M21 25 Q20 10 32 8 Q44 10 43 25 Z" fill="#2b221d"/><path d="M21 21 L43 21 L43 25 L21 25 Z" fill="#c9a45a"/>
  <path d="M20 30 Q20 46 30 48 Q36 48 38 44 L58 54 Q50 40 40 34 Q40 30 38 30 Z" fill="#d2b383"/>
  <path d="M20 30 Q20 46 30 48 Q34 48 36 45 Q30 40 38 30 Z" fill="#6b4528"/>
  <circle cx="31" cy="34" r="5" fill="#b8903f"/><circle cx="31" cy="34" r="3" fill="#ffd27a"/>
</svg>
`;
}
