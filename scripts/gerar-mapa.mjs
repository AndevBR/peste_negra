// Gera assets/images/illustrations/mapa-europa.svg (silhueta simplificada da Europa,
// do Norte da África e do Oriente Próximo) a partir dos dados Natural Earth (domínio público).
//
// Uso:  node scripts/gerar-mapa.mjs caminho/ne_50m_land.geojson caminho/ne_50m_lakes.geojson
// Dados: https://github.com/nvkelso/natural-earth-vector (pasta geojson/)
//
// A projeção (equiretangular com correção de latitude) também é usada em assets/data/mapa.json:
// as cidades são posicionadas pela mesma função `projetar`, exportada abaixo.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const CAIXA = { lonMin: -12, lonMax: 48, latMin: 33, latMax: 62 };
export const LARGURA = 900;
const LAT0 = 47;
const K = Math.cos((LAT0 * Math.PI) / 180);
const ESCALA = LARGURA / ((CAIXA.lonMax - CAIXA.lonMin) * K);
export const ALTURA = Math.round((CAIXA.latMax - CAIXA.latMin) * ESCALA);

export function projetar(lon, lat) {
  return [(lon - CAIXA.lonMin) * K * ESCALA, (CAIXA.latMax - lat) * ESCALA];
}

// recorte de polígono por retângulo (Sutherland–Hodgman)
export function recortar(pontos, xmin, ymin, xmax, ymax) {
  const lados = [
    (p) => p[0] >= xmin, (p) => p[0] <= xmax, (p) => p[1] >= ymin, (p) => p[1] <= ymax,
  ];
  const cortes = [
    (a, b) => [xmin, a[1] + ((b[1] - a[1]) * (xmin - a[0])) / (b[0] - a[0])],
    (a, b) => [xmax, a[1] + ((b[1] - a[1]) * (xmax - a[0])) / (b[0] - a[0])],
    (a, b) => [a[0] + ((b[0] - a[0]) * (ymin - a[1])) / (b[1] - a[1]), ymin],
    (a, b) => [a[0] + ((b[0] - a[0]) * (ymax - a[1])) / (b[1] - a[1]), ymax],
  ];
  let saida = pontos;
  for (let l = 0; l < 4; l++) {
    const entrada = saida; saida = [];
    for (let i = 0; i < entrada.length; i++) {
      const a = entrada[(i + entrada.length - 1) % entrada.length], b = entrada[i];
      const dentroA = lados[l](a), dentroB = lados[l](b);
      if (dentroB) { if (!dentroA) saida.push(cortes[l](a, b)); saida.push(b); }
      else if (dentroA) saida.push(cortes[l](a, b));
    }
    if (!saida.length) break;
  }
  return saida;
}

// simplificação de Douglas–Peucker
export function simplificar(pts, tol) {
  if (pts.length < 4) return pts;
  const manter = new Uint8Array(pts.length); manter[0] = manter[pts.length - 1] = 1;
  const pilha = [[0, pts.length - 1]];
  while (pilha.length) {
    const [i, j] = pilha.pop(); let max = 0, idx = -1;
    const [x1, y1] = pts[i], [x2, y2] = pts[j], dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    for (let k = i + 1; k < j; k++) {
      const d = Math.abs(dy * pts[k][0] - dx * pts[k][1] + x2 * y1 - y2 * x1) / len;
      if (d > max) { max = d; idx = k; }
    }
    if (max > tol) { manter[idx] = 1; pilha.push([i, idx], [idx, j]); }
  }
  return pts.filter((_, k) => manter[k]);
}

// anel fechado: divide no ponto mais distante do início e simplifica as duas metades
export function simplificarAnel(pts, tol) {
  let longe = 0, max = -1;
  pts.forEach((p, i) => { const d = Math.hypot(p[0] - pts[0][0], p[1] - pts[0][1]); if (d > max) { max = d; longe = i; } });
  if (longe === 0) return pts;
  const a = simplificar(pts.slice(0, longe + 1), tol), b = simplificar([...pts.slice(longe), pts[0]], tol);
  return [...a, ...b.slice(1, -1)];
}

export function area(pts) {
  let a = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; }
  return Math.abs(a / 2);
}

function caminhos(geojson, areaMin) {
  const d = [];
  for (const f of geojson.features) {
    const g = f.geometry; if (!g) continue;
    const polis = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
    for (const poli of polis) for (const anel of poli) {
      const proj = anel.map(([lon, lat]) => projetar(lon, lat));
      let r = recortar(proj, -2, -2, LARGURA + 2, ALTURA + 2);
      if (r.length < 3 || area(r) < areaMin) continue;
      r = simplificarAnel(r, 0.6);
      if (r.length < 3) continue;
      d.push('M' + r.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z');
    }
  }
  return d.join('');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [terraArq, lagosArq] = process.argv.slice(2);
  if (!terraArq) { console.error('Informe o caminho de ne_50m_land.geojson'); process.exit(1); }
  const terra = caminhos(JSON.parse(readFileSync(terraArq, 'utf8')), 4);
  const lagos = lagosArq ? caminhos(JSON.parse(readFileSync(lagosArq, 'utf8')), 60) : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LARGURA} ${ALTURA}" role="img" aria-labelledby="t">
<title id="t">Mapa simplificado da Europa, do Norte da África e do Oriente Próximo</title>
<!-- Contornos: Natural Earth (domínio público), simplificados por scripts/gerar-mapa.mjs -->
<path d="${terra}" fill="#352f28" stroke="#a88a55" stroke-width="1.1" stroke-linejoin="round" fill-rule="evenodd"/>
${lagos ? `<path d="${lagos}" fill="#132026" stroke="#6d5a3a" stroke-width="0.7"/>` : ''}
</svg>
`;
  writeFileSync(new URL('../assets/images/illustrations/mapa-europa.svg', import.meta.url), svg);
  console.log(`mapa-europa.svg gerado (${LARGURA}x${ALTURA}, ${(svg.length / 1024).toFixed(1)} KB)`);
}
