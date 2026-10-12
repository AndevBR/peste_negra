// Retratos em medalhão dos personagens e ofícios medievais (galeria do site).
// Todos compartilham a mesma moldura, proporções e traço, variando roupa, cabeça e objeto.
import { svg, defsComuns, C } from './comum.mjs';

const T = 4;
const tinta = `stroke="${C.tinta}" stroke-width="${T}" stroke-linejoin="round" stroke-linecap="round"`;

function moldura(conteudo, fundo = 'url(#pergaminhoFundo)') {
  return `<circle cx="120" cy="120" r="114" fill="${fundo}" stroke="${C.tinta}" stroke-width="5"/>
  <clipPath id="recorte"><circle cx="120" cy="120" r="104"/></clipPath>
  <g clip-path="url(#recorte)">${conteudo}</g>
  <circle cx="120" cy="120" r="104" fill="none" stroke="${C.latao}" stroke-width="4"/>
  <circle cx="120" cy="120" r="114" fill="none" stroke="${C.tinta}" stroke-width="5"/>`;
}

function tronco(cor, sombra) {
  return `<path d="M36 250 Q40 186 82 172 Q120 162 158 172 Q200 186 204 250 Z" fill="${cor}" ${tinta}/>
  <path d="M60 250 Q64 204 86 186 M180 250 Q176 204 154 186" stroke="${sombra}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
}

function pescoco(pele) {
  return `<path d="M104 150 L104 176 Q120 186 136 176 L136 150 Z" fill="${pele}" ${tinta}/>`;
}

function rosto(pele, { barba = null, mascara = false, olhosFechados = false } = {}) {
  const olhos = olhosFechados
    ? `<path d="M98 118 Q104 122 110 118 M130 118 Q136 122 142 118" stroke="${C.tinta}" stroke-width="3" fill="none"/>`
    : `<ellipse cx="104" cy="118" rx="4" ry="5" fill="${C.tinta}"/><ellipse cx="136" cy="118" rx="4" ry="5" fill="${C.tinta}"/>
       <circle cx="105.5" cy="116" r="1.4" fill="#fff"/><circle cx="137.5" cy="116" r="1.4" fill="#fff"/>`;
  return `<ellipse cx="120" cy="120" rx="36" ry="42" fill="${pele}" ${tinta}/>
  <ellipse cx="84" cy="124" rx="6" ry="10" fill="${pele}" ${tinta}/>
  <ellipse cx="156" cy="124" rx="6" ry="10" fill="${pele}" ${tinta}/>
  ${olhos}
  <path d="M96 106 Q104 101 112 105 M128 105 Q136 101 144 106" stroke="${C.tinta}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M120 120 Q116 134 122 136" stroke="${C.tinta}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  ${mascara ? `<path d="M88 128 Q120 120 152 128 L148 154 Q120 166 92 154 Z" fill="#e8dcc2" ${tinta}/><path d="M92 136 Q120 130 148 136" stroke="${C.pedraClara}" stroke-width="2" fill="none"/>`
    : `<path d="M110 146 Q120 150 130 146" stroke="${C.tinta}" stroke-width="3" fill="none" stroke-linecap="round"/>`}
  <ellipse cx="98" cy="134" rx="6" ry="3.5" fill="#d9776a" opacity=".25"/><ellipse cx="142" cy="134" rx="6" ry="3.5" fill="#d9776a" opacity=".25"/>
  ${barba ? `<path d="M86 132 Q88 170 120 172 Q152 170 154 132 Q146 152 132 150 Q120 156 108 150 Q94 152 86 132 Z" fill="${barba}" ${tinta}/><path d="M110 146 Q120 150 130 146" stroke="${C.tinta}" stroke-width="3" fill="none"/>` : ''}`;
}

// ---------- objetos (lado direito do medalhão) ----------
const OBJ = {
  frasco: `<g ${tinta}><path d="M178 140 L178 158 Q158 170 160 196 Q164 222 186 222 Q208 222 212 196 Q214 170 194 158 L194 140 Z" fill="#f4e9b8" fill-opacity=".85"/>
    <path d="M162 192 Q186 200 210 190 Q208 220 186 221 Q164 220 162 192 Z" fill="#d9b44a" stroke="none"/>
    <rect x="174" y="132" width="24" height="10" rx="3" fill="${C.couro}"/></g>
    <path d="M168 170 Q166 180 168 188" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>`,
  chicote: `<g ${tinta}><rect x="176" y="196" width="14" height="40" rx="5" fill="${C.couro}"/></g>
    <g stroke="${C.tinta}" stroke-width="3.5" fill="none" stroke-linecap="round"><path d="M183 198 Q170 160 160 130"/><path d="M183 198 Q186 156 182 124"/><path d="M183 198 Q200 162 206 132"/></g>
    <g fill="${C.bordo}" stroke="${C.tinta}" stroke-width="2"><circle cx="164" cy="146" r="4"/><circle cx="184" cy="142" r="4"/><circle cx="202" cy="148" r="4"/></g>`,
  ervas: `<g ${tinta}><path d="M160 214 Q186 196 214 214 Q212 236 187 238 Q162 236 160 214 Z" fill="${C.pedra}"/><path d="M162 212 Q187 222 212 212" fill="none"/></g>
    <g stroke="${C.tinta}" stroke-width="3" stroke-linecap="round"><path d="M178 210 Q170 170 160 150" fill="none"/><path d="M190 210 Q192 166 196 144" fill="none"/></g>
    <g fill="${C.erva}" stroke="${C.tinta}" stroke-width="2.5"><ellipse cx="164" cy="160" rx="9" ry="5" transform="rotate(-40 164 160)"/><ellipse cx="174" cy="178" rx="9" ry="5" transform="rotate(30 174 178)"/>
    <ellipse cx="200" cy="154" rx="9" ry="5" transform="rotate(40 200 154)"/><ellipse cx="188" cy="176" rx="9" ry="5" transform="rotate(-30 188 176)"/></g>
    <g fill="#9b6fb0"><circle cx="158" cy="148" r="4"/><circle cx="196" cy="142" r="4"/></g>`,
  navalha: `<g ${tinta}><path d="M152 210 Q186 236 222 210 L218 222 Q186 246 156 222 Z" fill="${C.pedraClara}"/>
    <rect x="178" y="134" width="12" height="44" rx="4" fill="${C.madeira}"/><path d="M180 178 L188 178 L194 214 L176 214 Z" fill="#d7d3cb"/></g>
    <path d="M182 186 L184 208" stroke="#fff" stroke-width="2"/>`,
  urina: `<g ${tinta}><path d="M176 136 L176 150 Q156 164 160 194 Q166 222 186 222 Q206 222 212 194 Q216 164 196 150 L196 136 Z" fill="#f6e7a4" fill-opacity=".9"/>
    <path d="M172 132 L200 132" stroke-width="6"/>
    <path d="M150 196 Q186 212 222 196 L226 236 L146 236 Z" fill="${C.couroClaro}"/><path d="M152 206 Q186 220 220 206" fill="none"/></g>
    <path d="M168 168 Q166 180 168 190" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>`,
  pote: `<g ${tinta}><path d="M162 150 Q160 140 170 138 L202 138 Q212 140 210 150 Q218 186 210 220 Q186 230 162 220 Q154 186 162 150 Z" fill="#2f5d7c"/>
    <path d="M164 168 Q186 174 208 168 L208 198 Q186 204 164 198 Z" fill="${C.pergaminho}"/><rect x="166" y="128" width="40" height="12" rx="4" fill="${C.couroEscuro}"/></g>
    <path d="M176 182 L196 182 M176 190 L190 190" stroke="${C.bordo}" stroke-width="3"/>`,
  tigela: `<g ${tinta}><path d="M150 186 Q186 176 222 186 Q220 224 186 228 Q152 224 150 186 Z" fill="#b5764a"/><ellipse cx="186" cy="186" rx="36" ry="9" fill="#e9d9b0"/></g>
    <g stroke="#ffffff" stroke-width="3" fill="none" opacity=".75" stroke-linecap="round"><path d="M176 172 Q170 160 178 150"/><path d="M194 170 Q200 158 192 146"/></g>`,
  rosario: `<g fill="${C.couroEscuro}" stroke="${C.tinta}" stroke-width="2">${Array.from({ length: 12 }, (_, i) => { const a = Math.PI * (0.15 + i / 13); return `<circle cx="${(186 + 30 * Math.cos(a)).toFixed(1)}" cy="${(160 + 34 * Math.sin(a)).toFixed(1)}" r="4.5"/>`; }).join('')}</g>
    <g ${tinta}><path d="M186 196 L186 230 M174 208 L198 208" stroke="${C.latao}" stroke-width="7"/></g>
    <path d="M186 196 L186 230 M174 208 L198 208" stroke="${C.tinta}" stroke-width="1.5" fill="none"/>`,
  saco: `<g ${tinta}><path d="M160 168 Q150 210 162 232 Q188 242 214 232 Q226 210 214 168 Q200 160 188 162 Q174 160 160 168 Z" fill="#b8955e"/>
    <path d="M174 166 Q188 176 202 166" stroke-width="5" fill="none"/></g>
    <g fill="${C.latao}" stroke="${C.tinta}" stroke-width="2.5"><ellipse cx="160" cy="236" rx="12" ry="5"/><ellipse cx="214" cy="232" rx="12" ry="5"/></g>`,
  pa: `<g ${tinta}><rect x="180" y="96" width="12" height="104" rx="4" fill="${C.madeira}"/>
    <path d="M170 196 L202 196 L204 232 Q186 246 168 232 Z" fill="${C.pedra}"/><path d="M174 92 L198 92" stroke-width="8"/></g>
    <path d="M176 92 L196 92" stroke="${C.madeira}" stroke-width="3"/>`,
};

for (const k of Object.keys(OBJ)) OBJ[k] = `<g transform="translate(-6 -30)">${OBJ[k]}</g>`;

// ---------- definição de cada personagem ----------
const PERSONAGENS = {
  flagelante: {
    titulo: 'Retrato estilizado de um flagelante, com capuz e cruz vermelha',
    desenhar: () => `${tronco('#ece4d2', '#cbbf9f')}
      <path d="M100 196 L140 196 M120 180 L120 236" stroke="${C.bordo}" stroke-width="14"/>
      ${pescoco(C.pele2)}${rosto(C.pele2, { olhosFechados: true })}
      <path d="M72 128 Q66 60 120 52 Q174 60 168 128 Q164 170 150 180 L152 140 Q150 92 120 88 Q90 92 88 140 L90 180 Q76 170 72 128 Z" fill="#e4dac4" ${tinta}/>
      <path d="M112 64 L128 64 M120 56 L120 80" stroke="${C.bordo}" stroke-width="7"/>
      ${OBJ.chicote}`,
  },
  erveira: {
    titulo: 'Retrato estilizado de uma erveira, com lenço e ramos de ervas',
    desenhar: () => `${tronco('#6b5235', '#4d3a24')}
      <path d="M84 186 Q120 206 156 186 L150 250 L90 250 Z" fill="#e8dcc0" ${tinta}/>
      ${pescoco(C.pele1)}${rosto(C.pele1)}
      <path d="M76 132 Q70 70 120 64 Q170 70 164 132 Q160 104 150 96 Q120 86 90 96 Q80 104 76 132 Z" fill="${C.erva}" ${tinta}/>
      <path d="M78 130 Q74 170 92 186 M162 130 Q166 170 148 186" stroke="#4a6f3c" stroke-width="10" fill="none" stroke-linecap="round"/>
      ${OBJ.ervas}`,
  },
  'cirurgiao-barbeiro': {
    titulo: 'Retrato estilizado de um cirurgião-barbeiro, com avental e navalha',
    desenhar: () => `${tronco('#d9cfba', '#b5a98c')}
      <path d="M86 184 L154 184 L160 250 L80 250 Z" fill="${C.couroClaro}" ${tinta}/>
      ${pescoco(C.pele2)}${rosto(C.pele2, { barba: '#4a3423' })}
      <path d="M82 104 Q86 70 120 66 Q154 70 158 104 Q140 92 120 92 Q100 92 82 104 Z" fill="#3a2a1d" ${tinta}/>
      <path d="M78 96 Q120 70 162 96 L160 84 Q120 58 80 84 Z" fill="${C.bordo}" ${tinta}/>
      ${OBJ.navalha}`,
  },
  'medico-universitario': {
    titulo: 'Retrato estilizado de um médico formado na universidade, com toga e frasco de urina',
    desenhar: () => `${tronco(C.bordo, C.bordoEscuro)}
      <path d="M84 178 Q120 196 156 178 L150 196 Q120 210 90 196 Z" fill="#e9dcc0" ${tinta}/>
      ${pescoco(C.pele1)}${rosto(C.pele1, { barba: '#8a8379' })}
      <path d="M80 100 Q78 62 120 58 Q162 62 160 100 Q150 86 120 86 Q90 86 80 100 Z" fill="${C.bordoEscuro}" ${tinta}/>
      ${OBJ.urina}`,
  },
  apotecario: {
    titulo: 'Retrato estilizado de um apotecário, com gorro e pote de remédios',
    desenhar: () => `${tronco('#3e5a46', '#2b4031')}
      <path d="M100 176 L140 176 L132 250 L108 250 Z" fill="#e8dcc0" ${tinta}/>
      ${pescoco(C.pele3)}${rosto(C.pele3)}
      <path d="M80 104 Q80 66 120 62 Q160 66 160 104 Q120 86 80 104 Z" fill="#5a3d26" ${tinta}/>
      <path d="M84 90 Q120 50 156 90 Q160 70 144 60 Q120 44 96 60 Q80 70 84 90 Z" fill="${C.couroClaro}" ${tinta}/>
      ${OBJ.pote}`,
  },
  cuidadora: {
    titulo: 'Retrato estilizado de uma cuidadora de enfermos, com touca branca e tigela',
    desenhar: () => `${tronco('#7d776c', '#5d584f')}
      ${pescoco(C.pele1)}
      <path d="M78 120 Q74 180 92 194 L148 194 Q166 180 162 120 Z" fill="#f4efe2" ${tinta}/>
      ${rosto(C.pele1)}
      <path d="M78 128 Q70 64 120 58 Q170 64 162 128 Q160 92 120 84 Q80 92 78 128 Z" fill="#f4efe2" ${tinta}/>
      <path d="M70 120 Q60 60 120 48 Q180 60 170 120 L176 200 L164 200 Q168 120 160 96 Q120 72 80 96 Q72 120 76 200 L64 200 Z" fill="#3c3a46" ${tinta}/>
      ${OBJ.tigela}`,
  },
  religioso: {
    titulo: 'Retrato estilizado de um frade, com hábito marrom e rosário',
    desenhar: () => `<path d="M60 190 Q120 150 180 190 L190 250 L50 250 Z" fill="#5b4330" ${tinta}/>
      ${tronco('#6e5139', '#4f3a28')}
      <path d="M86 236 Q120 226 154 236" stroke="#d8c39a" stroke-width="5" fill="none"/>
      ${pescoco(C.pele2)}${rosto(C.pele2)}
      <path d="M84 108 Q82 80 96 70 Q120 92 144 70 Q158 80 156 108 Q156 92 150 88 Q120 100 90 88 Q84 92 84 108 Z" fill="#7d6047" ${tinta}/>
      ${OBJ.rosario}`,
  },
  comerciante: {
    titulo: 'Retrato estilizado de um comerciante viajante, com chapéu de viagem e saco de mercadorias',
    desenhar: () => `${tronco('#2f4a6b', '#203550')}
      <path d="M70 196 Q120 176 170 196 L176 214 Q120 196 64 214 Z" fill="${C.couro}" ${tinta}/>
      ${pescoco(C.pele3)}${rosto(C.pele3, { barba: '#2a1d14' })}
      <path d="M66 98 Q70 56 120 52 Q170 56 174 98 Q176 108 160 104 Q120 92 80 104 Q64 108 66 98 Z" fill="${C.bordo}" ${tinta}/>
      <path d="M150 64 Q186 70 192 104 Q194 128 180 140 Q186 104 156 86 Z" fill="${C.bordoEscuro}" ${tinta}/>
      ${OBJ.saco}`,
  },
  coveiro: {
    titulo: 'Retrato estilizado de um trabalhador encarregado dos sepultamentos, com gorro e pá',
    desenhar: () => `${tronco('#5e5446', '#433b30')}
      <path d="M86 186 Q120 198 154 186" stroke="${C.couroEscuro}" stroke-width="8" fill="none"/>
      ${pescoco(C.pele4)}${rosto(C.pele4, { barba: '#2c2620' })}
      <path d="M80 108 Q78 64 120 60 Q162 64 160 108 Q146 94 120 94 Q94 94 80 108 Z" fill="#6a5a44" ${tinta}/>
      ${OBJ.pa}`,
  },
};

export const NOMES_PERSONAGENS = Object.keys(PERSONAGENS);

export function retrato(nome) {
  const p = PERSONAGENS[nome];
  return svg({ viewBox: '0 0 240 240', titulo: p.titulo, conteudo: defsComuns() + moldura(p.desenhar()) });
}

// Retrato em sombra: mesma figura, mas em silhueta escura com luz de contorno dourada,
// contra um fundo de névoa. Usado enquanto não houver retratos realistas de cada ofício.
export function retratoSombra(nome) {
  const p = PERSONAGENS[nome];
  return svg({
    viewBox: '0 0 240 300',
    titulo: `${p.titulo} (silhueta)`,
    conteudo: `<defs>
      <radialGradient id="nevoa" cx=".55" cy=".38" r=".75"><stop offset="0" stop-color="#5a5650"/><stop offset=".45" stop-color="#2c2a28"/><stop offset="1" stop-color="#0e0d0d"/></radialGradient>
      <filter id="sombra" x="-10%" y="-10%" width="120%" height="120%">
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0.035  0 0 0 0 0.03  0 0 0 0 0.03  0 0 0 1 0" result="escuro"/>
        <feOffset in="SourceAlpha" dx="3" dy="2" result="desl"/>
        <feComposite in="SourceAlpha" in2="desl" operator="out" result="borda"/>
        <feGaussianBlur in="borda" stdDeviation="1.3" result="bb"/>
        <feFlood flood-color="#e8b86a"/><feComposite in2="bb" operator="in" result="rim"/>
        <feMerge><feMergeNode in="escuro"/><feMergeNode in="rim"/></feMerge>
      </filter>
      <linearGradient id="chao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".85"/></linearGradient>
    </defs>
    <rect width="240" height="300" fill="url(#nevoa)"/>
    <g transform="translate(0 46)" filter="url(#sombra)">${p.desenhar()}</g>
    <rect y="200" width="240" height="100" fill="url(#chao)"/>`,
  });
}
