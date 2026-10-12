// Gera as ilustrações SVG originais do site a partir de scripts/arte/*.mjs.
// Uso: npm run art
import { writeFileSync, mkdirSync } from 'node:fs';
import { poseDoutor, NOMES_POSES, doutorCompacto } from './arte/doutor.mjs';

const raiz = new URL('../assets/images/', import.meta.url);
function salvar(caminho, conteudo) {
  const url = new URL(caminho, raiz);
  mkdirSync(new URL('.', url), { recursive: true });
  writeFileSync(url, conteudo);
  console.log('✔', caminho, (conteudo.length / 1024).toFixed(1) + ' KB');
}

for (const nome of NOMES_POSES) salvar(`characters/doutor-${nome}.svg`, poseDoutor(nome));
salvar('characters/doutor-compacto.svg', doutorCompacto());

import { retrato, NOMES_PERSONAGENS } from './arte/personagens.mjs';
for (const nome of NOMES_PERSONAGENS) salvar(`personagens/${nome}.svg`, retrato(nome));

import * as cenas from './arte/cenas.mjs';
salvar('illustrations/bacteria-yersinia.svg', cenas.bacteria());
for (const [nome, fn] of Object.entries(cenas.CENAS)) salvar(`illustrations/cotidiano-${nome}.svg`, fn());
salvar('environments/hero-ceu.svg', cenas.heroCeu());
salvar('environments/hero-cidade-longe.svg', cenas.heroCidadeLonge());
salvar('environments/hero-cidade-perto.svg', cenas.heroCidadePerto());
salvar('icons/favicon.svg', cenas.favicon());
