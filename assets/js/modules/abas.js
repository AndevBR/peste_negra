// Abas acessíveis (padrão WAI-ARIA): setas, Home e End movem o foco entre as abas.
export function iniciarAbas(raiz) {
  const abas = [...raiz.querySelectorAll('[role="tab"]')];
  const paineis = abas.map((a) => document.getElementById(a.getAttribute('aria-controls')));

  const selecionar = (indice, focar = true) => {
    abas.forEach((aba, i) => {
      const ativa = i === indice;
      aba.setAttribute('aria-selected', String(ativa));
      aba.tabIndex = ativa ? 0 : -1;
      paineis[i].hidden = !ativa;
    });
    if (focar) abas[indice].focus();
  };

  abas.forEach((aba, i) => {
    aba.addEventListener('click', () => selecionar(i, false));
    aba.addEventListener('keydown', (e) => {
      const mapa = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: abas.length - 1 };
      if (!(e.key in mapa)) return;
      e.preventDefault();
      selecionar((mapa[e.key] + abas.length) % abas.length);
    });
  });
  selecionar(Math.max(0, abas.findIndex((a) => a.getAttribute('aria-selected') === 'true')), false);
}
