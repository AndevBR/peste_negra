// Paleta e utilidades compartilhadas por todas as ilustrações geradas.
// As cores seguem o sistema de design do site (assets/css/main.css).
export const C = {
  tinta: '#1b1411',
  carvao: '#211c1a',
  pedra: '#6f6a62',
  pedraClara: '#a39d91',
  pedraEscura: '#4a4640',
  casaco: '#2f362e',
  casacoLuz: '#4a5547',
  casacoSombra: '#1d221c',
  bordo: '#7a1f2b',
  bordoEscuro: '#4e1219',
  couro: '#6b4528',
  couroClaro: '#8c5f38',
  couroEscuro: '#432a17',
  luva: '#3f2b1e',
  bota: '#2a1d15',
  botaLuz: '#5a4130',
  bico: '#d2b383',
  bicoSombra: '#a5835a',
  latao: '#b8903f',
  ouroVelho: '#c9a45a',
  pergaminho: '#f2e4c2',
  pergaminhoEscuro: '#d9c294',
  erva: '#5f8f4e',
  ervaVidro: '#9cc68a',
  madeira: '#7a5634',
  pele1: '#e6b993',
  pele2: '#c8946b',
  pele3: '#9a6844',
  pele4: '#6e4a31',
  ceuNoite: '#241a26',
};

export function svg({ viewBox, titulo, conteudo, descricao = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="t">
<title id="t">${titulo}</title>${descricao ? `\n<desc>${descricao}</desc>` : ''}
${conteudo}
</svg>
`;
}

export function defsComuns() {
  return `<defs>
  <linearGradient id="casaco" x1="0" x2="1"><stop offset="0" stop-color="${C.casacoSombra}"/><stop offset=".45" stop-color="${C.casaco}"/><stop offset=".8" stop-color="${C.casacoLuz}"/><stop offset="1" stop-color="${C.casaco}"/></linearGradient>
  <linearGradient id="manga" x1="0" x2="1"><stop offset="0" stop-color="${C.casaco}"/><stop offset="1" stop-color="${C.casacoLuz}"/></linearGradient>
  <linearGradient id="capa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2420"/><stop offset=".6" stop-color="#3b322b"/><stop offset="1" stop-color="#4b4036"/></linearGradient>
  <radialGradient id="mascara" cx=".65" cy=".35" r=".8"><stop offset="0" stop-color="${C.couroClaro}"/><stop offset=".6" stop-color="${C.couro}"/><stop offset="1" stop-color="${C.couroEscuro}"/></radialGradient>
  <linearGradient id="bico" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ead2a6"/><stop offset=".55" stop-color="${C.bico}"/><stop offset="1" stop-color="${C.bicoSombra}"/></linearGradient>
  <radialGradient id="vidro" cx=".4" cy=".4" r=".7"><stop offset="0" stop-color="#ffe9a3"/><stop offset=".5" stop-color="#e2a43a"/><stop offset="1" stop-color="#6f3f12"/></radialGradient>
  <linearGradient id="aba" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a302a"/><stop offset="1" stop-color="#17110e"/></linearGradient>
  <linearGradient id="copa" x1="0" x2="1"><stop offset="0" stop-color="#1c1613"/><stop offset=".7" stop-color="#352b25"/><stop offset="1" stop-color="#4a3c33"/></linearGradient>
  <linearGradient id="madeira" x1="0" x2="1"><stop offset="0" stop-color="#4f361f"/><stop offset=".5" stop-color="${C.madeira}"/><stop offset="1" stop-color="#5d4127"/></linearGradient>
  <linearGradient id="chama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7a0"/><stop offset="1" stop-color="#e58a2a"/></linearGradient>
  <radialGradient id="halo"><stop offset="0" stop-color="#ffd27a" stop-opacity=".55"/><stop offset=".5" stop-color="#ffb347" stop-opacity=".18"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
  <radialGradient id="medalhao" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#9a3a3f"/><stop offset=".7" stop-color="${C.bordo}"/><stop offset="1" stop-color="${C.bordoEscuro}"/></radialGradient>
  <radialGradient id="pergaminhoFundo" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#fbf2dc"/><stop offset=".75" stop-color="${C.pergaminho}"/><stop offset="1" stop-color="${C.pergaminhoEscuro}"/></radialGradient>
</defs>`;
}
