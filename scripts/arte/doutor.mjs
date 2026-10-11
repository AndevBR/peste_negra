// Doutor da Peste — personagem-guia do site.
// Todas as poses são montadas com as MESMAS peças (chapéu, máscara, casaco, luvas, botas),
// mudando apenas braços, mãos e objetos. Assim a identidade visual permanece consistente.
import { svg, defsComuns, C } from './comum.mjs';

const T = 4; // espessura do contorno

// ---------- peças fixas ----------
function sombra() {
  return `<ellipse cx="200" cy="606" rx="118" ry="11" fill="#000" opacity=".22"/>`;
}

function botas() {
  return `<g stroke="${C.tinta}" stroke-width="${T}" stroke-linejoin="round">
    <path d="M152 548 L150 592 Q150 602 140 603 L120 604 Q110 604 112 596 Q116 588 132 586 L136 548 Z" fill="${C.bota}"/>
    <path d="M214 548 L214 592 Q214 603 226 603 L262 604 Q274 603 270 594 Q266 586 248 584 L232 548 Z" fill="${C.bota}"/>
  </g>
  <path d="M138 590 Q130 592 120 597 M222 590 Q240 590 262 596" stroke="${C.botaLuz}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}

function casaco() {
  return `<g stroke-linejoin="round">
    <path d="M146 262 Q128 330 116 420 Q104 500 92 566 L108 572 L120 562 L134 574 L150 562 L166 576 L184 563 L200 575 L216 563 L234 576 L250 562 L266 574 L282 561 L296 572 L310 564
             Q298 500 286 420 Q274 330 256 262 Z" fill="url(#casaco)" stroke="${C.tinta}" stroke-width="${T}"/>
    <path d="M200 300 L200 568" stroke="${C.casacoSombra}" stroke-width="5"/>
    <path d="M200 300 L200 568" stroke="${C.tinta}" stroke-width="1.5" opacity=".6"/>
    <path d="M160 300 Q150 430 128 560 M240 300 Q252 430 272 560 M178 420 Q172 500 166 566 M224 420 Q230 500 238 566"
      stroke="${C.casacoSombra}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/>
    <path d="M262 300 Q276 400 296 560" stroke="${C.ouroVelho}" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>
    ${[318, 346, 374, 470, 500].map((y) => `<circle cx="207" cy="${y}" r="4.5" fill="${C.latao}" stroke="${C.tinta}" stroke-width="2"/>`).join('')}
    <path d="M118 512 Q130 506 140 514 M262 520 Q276 512 290 522" stroke="${C.casacoLuz}" stroke-width="3" fill="none" opacity=".5"/>
  </g>`;
}

function cinto() {
  return `<g stroke="${C.tinta}" stroke-width="3" stroke-linejoin="round">
    <path d="M128 396 Q200 410 272 396 L274 416 Q200 430 126 416 Z" fill="${C.couro}"/>
    <rect x="190" y="400" width="24" height="22" rx="3" fill="none" stroke="${C.latao}" stroke-width="5"/>
    <rect x="190" y="400" width="24" height="22" rx="3" fill="none" stroke="${C.tinta}" stroke-width="1.5"/>
    <!-- frascos de ervas -->
    <path d="M148 418 L148 430 Q136 438 138 452 Q142 466 156 464 Q168 460 166 446 Q164 434 156 430 L156 418 Z" fill="${C.ervaVidro}"/>
    <path d="M140 450 Q150 458 164 448 L165 452 Q160 463 150 463 Q141 461 140 452 Z" fill="${C.erva}" stroke="none"/>
    <path d="M170 418 L170 428 Q162 434 163 444 Q166 454 176 453 Q185 450 183 440 Q181 432 177 428 L177 418 Z" fill="#8f6aa0"/>
    <!-- bolsa de couro -->
    <path d="M232 414 L270 410 L274 458 Q252 468 230 460 Z" fill="${C.couroClaro}"/>
    <path d="M230 414 L272 410 L270 430 Q252 438 232 432 Z" fill="${C.couro}"/>
    <circle cx="252" cy="430" r="4" fill="${C.latao}"/>
  </g>
  <path d="M141 438 Q145 434 150 436" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/>`;
}

function correiaBolsa() {
  return `<path d="M244 268 Q200 340 150 404" stroke="${C.tinta}" stroke-width="14" fill="none" stroke-linecap="round"/>
  <path d="M244 268 Q200 340 150 404" stroke="${C.couro}" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M236 282 L230 292 M220 306 L213 316 M200 333 L193 343 M180 358 L173 368" stroke="${C.couroClaro}" stroke-width="2"/>`;
}

function capa() {
  return `<g stroke="${C.tinta}" stroke-width="${T}" stroke-linejoin="round">
    <path d="M134 262 Q200 236 266 262 Q286 300 284 330 Q270 344 252 334 Q236 350 216 338 Q200 352 184 338 Q164 350 148 334 Q130 344 116 330 Q114 300 134 262 Z" fill="${C.bordoEscuro}"/>
    <path d="M138 260 Q200 236 262 260 Q280 296 276 322 Q262 334 250 324 Q234 340 216 328 Q200 342 184 328 Q166 340 150 324 Q136 334 124 322 Q120 296 138 260 Z" fill="url(#capa)"/>
  </g>
  <path d="M150 292 Q160 310 156 324 M200 290 L200 330 M248 292 Q240 310 244 324" stroke="${C.casacoSombra}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
}

function capuz() {
  return `<path d="M160 222 Q150 252 140 266 Q200 286 262 266 Q252 250 242 222 Z" fill="${C.casacoSombra}" stroke="${C.tinta}" stroke-width="${T}" stroke-linejoin="round"/>`;
}

function cabeca() {
  return `<g stroke-linejoin="round" stroke-linecap="round">
    <!-- capuz de couro sob o chapéu -->
    <path d="M150 168 Q146 230 164 246 Q200 262 238 246 Q256 228 252 170 Z" fill="${C.couroEscuro}" stroke="${C.tinta}" stroke-width="${T}"/>
    <!-- máscara (domo) -->
    <path d="M156 170 Q156 226 186 240 Q216 248 236 230 Q252 210 248 172 Z" fill="url(#mascara)" stroke="${C.tinta}" stroke-width="${T}"/>
    <path d="M200 172 Q196 210 204 240" stroke="${C.tinta}" stroke-width="1.5" fill="none" stroke-dasharray="4 4" opacity=".7"/>
    <!-- bico -->
    <path d="M226 190 Q262 192 300 222 Q330 246 352 286 Q320 270 288 258 Q258 248 230 238 Q218 216 226 190 Z" fill="url(#bico)" stroke="${C.tinta}" stroke-width="${T}"/>
    <path d="M232 214 Q270 222 330 266" stroke="${C.bicoSombra}" stroke-width="3" fill="none"/>
    <path d="M236 204 Q276 212 312 240" stroke="${C.tinta}" stroke-width="1.5" fill="none" stroke-dasharray="3 5" opacity=".75"/>
    <path d="M244 197 L248 206 M258 200 L262 209 M272 206 L276 215" stroke="${C.couroEscuro}" stroke-width="3"/>
    <path d="M238 196 Q270 198 296 216" stroke="#fff4d6" stroke-width="3" fill="none" opacity=".55"/>
    <ellipse cx="302" cy="236" rx="4" ry="2.5" fill="${C.tinta}" transform="rotate(30 302 236)"/>
    <!-- lentes de vidro -->
    <circle cx="180" cy="192" r="12" fill="${C.latao}" stroke="${C.tinta}" stroke-width="3"/>
    <circle cx="180" cy="192" r="7.5" fill="url(#vidro)"/>
    <circle cx="222" cy="194" r="16" fill="${C.latao}" stroke="${C.tinta}" stroke-width="3.5"/>
    <circle cx="222" cy="194" r="10.5" fill="url(#vidro)"/>
    <circle cx="218" cy="190" r="3" fill="#fff9e0"/>
    <circle cx="177" cy="189" r="2" fill="#fff9e0"/>
    <path d="M192 192 Q200 188 206 192" stroke="${C.latao}" stroke-width="4" fill="none"/>
  </g>`;
}

function chapeu() {
  return `<g stroke="${C.tinta}" stroke-width="${T}" stroke-linejoin="round">
    <path d="M96 166 Q102 140 200 136 Q300 132 314 156 Q318 174 290 176 Q200 186 112 182 Q92 180 96 166 Z" fill="url(#aba)"/>
    <path d="M150 158 Q146 112 156 86 Q200 72 246 84 Q258 112 254 156 Q200 168 150 158 Z" fill="url(#copa)"/>
    <path d="M150 136 Q200 148 254 134 L254 154 Q200 168 150 156 Z" fill="${C.bordo}"/>
    <rect x="208" y="140" width="18" height="17" rx="2" fill="none" stroke="${C.latao}" stroke-width="4"/>
  </g>
  <path d="M110 170 Q200 178 300 162" stroke="#5b4a40" stroke-width="2.5" fill="none" opacity=".7"/>
  <path d="M166 92 Q164 116 166 132" stroke="#5b4a40" stroke-width="3" fill="none" opacity=".7"/>
  <path d="M244 96 Q248 116 246 132" stroke="${C.ouroVelho}" stroke-width="2.5" fill="none" opacity=".45"/>`;
}

// ---------- braços e mãos ----------
// braço = traço espesso do ombro (o) ao cotovelo (c) até o pulso (p)
function braco(o, c, p, frente = true) {
  const d = `M${o[0]} ${o[1]} Q${c[0]} ${c[1]} ${p[0]} ${p[1]}`;
  const cor = frente ? 'url(#manga)' : C.casacoSombra;
  return `<path d="${d}" stroke="${C.tinta}" stroke-width="${46 + T * 2}" fill="none" stroke-linecap="round"/>
  <path d="${d}" stroke="${cor}" stroke-width="46" fill="none" stroke-linecap="round"/>
  <path d="${d}" stroke="${C.casacoSombra}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6" transform="translate(6 4)"/>
  <circle cx="${p[0]}" cy="${p[1]}" r="20" fill="${C.couro}" stroke="${C.tinta}" stroke-width="${T}"/>`;
}

// mãos desenhadas no sistema local: pulso em (0,0), dedos apontando para +x
const MAOS = {
  punho: `<rect x="2" y="-17" width="34" height="34" rx="12" fill="${C.luva}" stroke="${C.tinta}" stroke-width="${T}"/>
    <ellipse cx="20" cy="-16" rx="11" ry="7" fill="${C.luva}" stroke="${C.tinta}" stroke-width="3"/>
    <path d="M30 -9 L36 -9 M30 0 L36 0 M30 9 L36 9" stroke="${C.tinta}" stroke-width="2.5"/>`,
  aberta: `<path d="M4 -16 Q24 -22 30 -14 L52 -18 Q58 -16 54 -10 L34 -6 L58 -4 Q62 1 56 4 L34 4 L54 12 Q57 18 50 18 L30 14 Q26 22 10 18 Q0 10 4 -16 Z" fill="${C.luva}" stroke="${C.tinta}" stroke-width="${T}"/>
    <path d="M12 -16 Q8 -32 20 -34 Q26 -30 24 -16" fill="${C.luva}" stroke="${C.tinta}" stroke-width="3"/>`,
  aponta: `<rect x="2" y="-15" width="30" height="32" rx="12" fill="${C.luva}" stroke="${C.tinta}" stroke-width="${T}"/>
    <path d="M22 -16 L66 -15 Q74 -9 66 -2 L24 -3 Z" fill="${C.luva}" stroke="${C.tinta}" stroke-width="3.5"/>
    <ellipse cx="16" cy="-15" rx="10" ry="6" fill="${C.luva}" stroke="${C.tinta}" stroke-width="3"/>
    <path d="M28 4 L33 4 M28 11 L33 11" stroke="${C.tinta}" stroke-width="2.5"/>`,
};
function mao(tipo, p, ang) {
  return `<g transform="translate(${p[0]} ${p[1]}) rotate(${ang})">${MAOS[tipo]}</g>`;
}

// ---------- objetos ----------
function cajado(x, yTopo = 200) {
  return `<g stroke="${C.tinta}" stroke-linejoin="round">
    <path d="M${x - 6} ${yTopo + 20} L${x - 7} 600 L${x + 7} 600 L${x + 6} ${yTopo + 20} Z" fill="url(#madeira)" stroke-width="3.5"/>
    <path d="M${x} ${yTopo + 30} L${x} 590" stroke="${C.couroEscuro}" stroke-width="2" opacity=".6"/>
    <path d="M${x - 12} ${yTopo + 20} Q${x - 14} ${yTopo - 8} ${x + 4} ${yTopo - 14} Q${x + 24} ${yTopo - 16} ${x + 26} ${yTopo + 6} Q${x + 26} ${yTopo + 18} ${x + 14} ${yTopo + 18}"
      fill="none" stroke="${C.tinta}" stroke-width="15" stroke-linecap="round"/>
    <path d="M${x - 12} ${yTopo + 20} Q${x - 14} ${yTopo - 8} ${x + 4} ${yTopo - 14} Q${x + 24} ${yTopo - 16} ${x + 26} ${yTopo + 6} Q${x + 26} ${yTopo + 18} ${x + 14} ${yTopo + 18}"
      fill="none" stroke="${C.madeira}" stroke-width="8" stroke-linecap="round"/>
    <rect x="${x - 10}" y="${yTopo + 22}" width="20" height="10" rx="2" fill="${C.latao}" stroke-width="2.5"/>
  </g>`;
}

function lanterna(x, y, brilho = true) { // (x,y) = argola superior
  return `<g>
    ${brilho ? `<circle cx="${x}" cy="${y + 56}" r="90" fill="url(#halo)"/>` : ''}
    <g stroke="${C.tinta}" stroke-linejoin="round">
      <path d="M${x} ${y} L${x} ${y + 14}" stroke-width="3"/>
      <circle cx="${x}" cy="${y - 2}" r="6" fill="none" stroke="${C.latao}" stroke-width="3"/>
      <path d="M${x - 18} ${y + 26} L${x} ${y + 12} L${x + 18} ${y + 26} Z" fill="${C.latao}" stroke-width="3"/>
      <rect x="${x - 17}" y="${y + 26}" width="34" height="50" rx="3" fill="url(#chama)" stroke-width="3"/>
      <path d="M${x - 6} ${y + 26} L${x - 6} ${y + 76} M${x + 6} ${y + 26} L${x + 6} ${y + 76}" stroke="${C.latao}" stroke-width="3"/>
      <path d="M${x - 21} ${y + 76} L${x + 21} ${y + 76} L${x + 15} ${y + 86} L${x - 15} ${y + 86} Z" fill="${C.latao}" stroke-width="3"/>
      <path d="M${x} ${y + 62} Q${x - 6} ${y + 52} ${x} ${y + 40} Q${x + 6} ${y + 52} ${x} ${y + 62} Z" fill="#fff6c8" stroke="none"/>
    </g>
  </g>`;
}

function livro(x, y, e = 1) {
  return `<g transform="translate(${x} ${y}) scale(${e}) translate(${-x} ${-y})" stroke="${C.tinta}" stroke-width="3" stroke-linejoin="round">
    <path d="M${x} ${y} Q${x + 30} ${y - 10} ${x + 58} ${y + 2} L${x + 58} ${y + 54} Q${x + 30} ${y + 44} ${x} ${y + 54} Z" fill="${C.bordo}"/>
    <path d="M${x + 4} ${y - 4} Q${x + 30} ${y - 14} ${x + 54} ${y - 2} L${x + 54} ${y + 48} Q${x + 30} ${y + 38} ${x + 4} ${y + 48} Z" fill="${C.pergaminho}"/>
    <path d="M${x + 29} ${y - 9} L${x + 29} ${y + 42}" stroke-width="2"/>
    <path d="M${x + 9} ${y + 6} L${x + 24} ${y + 3} M${x + 9} ${y + 14} L${x + 24} ${y + 11} M${x + 9} ${y + 22} L${x + 24} ${y + 19} M${x + 34} ${y + 3} L${x + 49} ${y + 6} M${x + 34} ${y + 11} L${x + 49} ${y + 14} M${x + 34} ${y + 19} L${x + 49} ${y + 22}"
      stroke="${C.ouroVelho}" stroke-width="2"/>
    <circle cx="${x + 41}" cy="${y + 32}" r="5" fill="none" stroke="${C.erva}" stroke-width="2"/>
  </g>`;
}

function dado(x, y, s = 52) { // cubo isométrico com a face 5 voltada para o observador
  const h = s / 2;
  const topo = `M${x} ${y - h} L${x + s} ${y - h - h * 0.55} L${x + s * 1.6} ${y - h} L${x + s * 0.6} ${y - h + h * 0.55} Z`;
  const frente = `M${x} ${y - h} L${x + s * 0.6} ${y - h + h * 0.55} L${x + s * 0.6} ${y + h + h * 0.55} L${x} ${y + h} Z`;
  const lado = `M${x + s * 0.6} ${y - h + h * 0.55} L${x + s * 1.6} ${y - h} L${x + s * 1.6} ${y + h} L${x + s * 0.6} ${y + h + h * 0.55} Z`;
  const pip = (px, py, r = 4.5) => `<ellipse cx="${px}" cy="${py}" rx="${r}" ry="${r * 0.9}" fill="${C.bordo}"/>`;
  const fx = x + s * 0.3, fy = y + h * 0.28, lx = x + s * 1.1, ly = y + h * 0.28;
  return `<g stroke="${C.tinta}" stroke-width="3" stroke-linejoin="round">
    <path d="${topo}" fill="#fbf1d6"/><path d="${frente}" fill="#ecdcb4"/><path d="${lado}" fill="#d9c493"/>
  </g>
  ${pip(x + s * 0.8, y - h, 4)}
  ${pip(fx - 9, fy - 14)}${pip(fx + 9, fy - 9)}${pip(fx, fy)}${pip(fx - 9, fy + 9)}${pip(fx + 9, fy + 14)}
  ${pip(lx - 16, ly - 10)}${pip(lx + 16, ly - 16)}${pip(lx - 16, ly + 14)}${pip(lx + 16, ly + 8)}`;
}

function pergaminhoAberto(x, y) {
  return `<g stroke="${C.tinta}" stroke-width="3" stroke-linejoin="round">
    <path d="M${x} ${y} L${x + 80} ${y - 8} L${x + 84} ${y + 62} L${x + 4} ${y + 70} Z" fill="${C.pergaminho}"/>
    <ellipse cx="${x + 2}" cy="${y + 35}" rx="7" ry="37" fill="${C.pergaminhoEscuro}"/>
    <ellipse cx="${x + 82}" cy="${y + 27}" rx="7" ry="37" fill="${C.pergaminhoEscuro}"/>
  </g>
  <path d="M${x + 16} ${y + 14} L${x + 66} ${y + 9} M${x + 16} ${y + 26} L${x + 66} ${y + 21} M${x + 16} ${y + 38} L${x + 56} ${y + 34} M${x + 16} ${y + 50} L${x + 62} ${y + 46}" stroke="${C.ouroVelho}" stroke-width="2.5"/>`;
}

// ---------- montagem ----------
function corpo(extrasAtras, bracoAtras, extrasMeio, bracoFrente, extrasFrente) {
  return [sombra(), extrasAtras, bracoAtras, botas(), casaco(), cinto(), correiaBolsa(), capuz(), capa(), cabeca(), chapeu(), extrasMeio, bracoFrente, extrasFrente].join('\n');
}

const OMBRO_E = [150, 276], OMBRO_D = [252, 276];

const POSES = {
  principal: {
    titulo: 'Doutor da Peste em pose principal, com cajado e lanterna acesa',
    desenho: () => corpo(
      '',
      braco(OMBRO_E, [104, 326], [88, 374], false),
      lanterna(84, 392) + mao('punho', [88, 374], 100),
      cajado(306, 196) + braco(OMBRO_D, [290, 350], [290, 392]),
      mao('punho', [298, 384], -90),
    ),
  },
  'boas-vindas': {
    titulo: 'Doutor da Peste acenando em boas-vindas',
    desenho: () => corpo(
      cajado(104, 210),
      braco(OMBRO_E, [124, 344], [112, 392], false) + mao('punho', [106, 384], -90),
      '',
      braco(OMBRO_D, [316, 270], [326, 206]),
      mao('aberta', [326, 206], -78),
    ),
  },
  explicacao: {
    titulo: 'Doutor da Peste explicando, com um livro aberto e o dedo erguido',
    desenho: () => corpo(
      '',
      braco(OMBRO_E, [120, 360], [150, 396], false),
      livro(136, 344, 1.35) + mao('punho', [150, 404], -30),
      braco(OMBRO_D, [312, 300], [312, 236]),
      mao('aponta', [312, 236], -88),
    ),
  },
  alerta: {
    titulo: 'Doutor da Peste em alerta, erguendo a lanterna e estendendo a mão',
    desenho: () => `<g transform="rotate(3 200 600)">${corpo(
      '',
      braco(OMBRO_E, [104, 250], [104, 186], false),
      lanterna(96, 170) + mao('punho', [104, 186], -90),
      braco(OMBRO_D, [312, 316], [350, 300]),
      mao('aberta', [350, 300], -12),
    )}</g>`,
  },
  jogos: {
    titulo: 'Doutor da Peste segurando um dado, convidando para jogar',
    desenho: () => corpo(
      cajado(104, 210),
      braco(OMBRO_E, [124, 344], [112, 392], false) + mao('punho', [106, 384], -90),
      '',
      braco(OMBRO_D, [300, 350], [336, 326]),
      mao('aberta', [336, 326], -20) + dado(320, 278, 40),
    ),
  },
};

export function poseDoutor(nome) {
  const p = POSES[nome];
  return svg({ viewBox: '0 0 420 620', titulo: p.titulo, conteudo: defsComuns() + p.desenho() });
}

export const NOMES_POSES = Object.keys(POSES);

// versão compacta: busto em medalhão (cartões, navegação, ícone)
export function doutorCompacto() {
  return svg({
    viewBox: '0 0 240 240',
    titulo: 'Doutor da Peste — retrato compacto',
    conteudo: `${defsComuns()}
    <circle cx="120" cy="120" r="114" fill="url(#medalhao)" stroke="${C.tinta}" stroke-width="5"/>
    <circle cx="120" cy="120" r="104" fill="none" stroke="${C.latao}" stroke-width="4"/>
    <clipPath id="recorte"><circle cx="120" cy="120" r="102"/></clipPath>
    <g clip-path="url(#recorte)"><g transform="translate(-36 -8) scale(.72)">${capuz()}${capa()}${cabeca()}${chapeu()}</g></g>
    <circle cx="120" cy="120" r="114" fill="none" stroke="${C.tinta}" stroke-width="5"/>`,
  });
}

export { cabeca, chapeu, capa, capuz };
