// Interface do glossário (glossario.html): busca por palavra e filtro por categoria.
import { el } from './dom.js';
import { carregarDados, mostrarErro } from './dados.js';
import { filtrarTermos, trechosDestacados } from './glossario-busca.js';

export async function iniciarGlossario(raiz) {
  const lista = raiz.querySelector('[data-glossario-lista]');
  const campo = raiz.querySelector('[data-glossario-busca]');
  const filtros = raiz.querySelector('[data-glossario-filtros]');
  const status = raiz.querySelector('[data-glossario-status]');
  const limparBtn = raiz.querySelector('[data-glossario-limpar]');
  let dados;
  try { dados = await carregarDados('glossario'); } catch (erro) { mostrarErro(lista, erro); return; }

  let categoria = 'todas';
  const opcoes = ['todas', ...dados.categorias].map((c) => {
    const b = el('button', { classe: 'abas__aba', type: 'button', 'aria-pressed': String(c === categoria), dados: { categoria: c }, texto: c === 'todas' ? 'Todas' : c });
    b.addEventListener('click', () => { categoria = c; opcoes.forEach((o) => o.setAttribute('aria-pressed', String(o === b))); atualizar(); });
    return b;
  });
  filtros.append(...opcoes);

  const marcado = (texto, busca) => trechosDestacados(texto, busca).map((p) => (p.destaque ? el('mark', { texto: p.texto }) : p.texto));

  function atualizar() {
    const busca = campo.value;
    const resultado = filtrarTermos(dados.termos, busca, categoria);
    lista.replaceChildren(...resultado.map((t) => el('div', { classe: 'termo', dados: { termo: t.termo } }, [
      el('dt', {}, [el('span', {}, marcado(t.termo, busca)), el('span', { classe: 'selo', texto: t.categoria })]),
      el('dd', {}, marcado(t.definicao, busca)),
    ])));
    status.textContent = resultado.length
      ? `${resultado.length} ${resultado.length === 1 ? 'termo encontrado' : 'termos encontrados'}.`
      : 'Nenhum termo encontrado. Tente outra palavra ou escolha “Todas” as categorias.';
    limparBtn.hidden = !busca;
  }

  let espera;
  campo.addEventListener('input', () => { clearTimeout(espera); espera = setTimeout(atualizar, 120); });
  raiz.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); atualizar(); });
  limparBtn.addEventListener('click', () => { campo.value = ''; atualizar(); campo.focus(); });
  // permite abrir já filtrado: glossario.html?q=pulga
  const inicial = new URLSearchParams(location.search).get('q');
  if (inicial) campo.value = inicial.slice(0, 60);
  atualizar();
}
