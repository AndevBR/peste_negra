// Página de fontes (fontes.html): lista as referências de assets/data/fontes.json.
import { el, icone } from './dom.js';
import { carregarDados, mostrarErro } from './dados.js';

export async function iniciarFontes(lista) {
  try {
    const { fontes } = await carregarDados('fontes');
    lista.replaceChildren(...fontes.map((f) => el('li', { classe: 'referencia', id: f.id }, [
      el('h3', { texto: f.titulo }),
      el('p', {}, [el('strong', { texto: 'Autor/instituição: ' }), `${f.autor} (${f.ano}).`]),
      el('p', {}, [el('span', { classe: 'selo', texto: f.tipo })]),
      el('p', {}, [el('strong', { texto: 'Fundamenta: ' }), f.assunto]),
      el('p', {}, [el('a', { href: f.url, rel: 'noopener noreferrer', target: '_blank' }, [f.url, ' ', icone('externo'), el('span', { classe: 'visualmente-oculto', texto: '(abre em nova aba)' })])]),
    ])));
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  } catch (erro) {
    mostrarErro(lista, erro);
  }
}
