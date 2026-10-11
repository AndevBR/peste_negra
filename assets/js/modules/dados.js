// Carregamento dos arquivos JSON de conteúdo (assets/data/), com cache e mensagens de erro.
const cache = new Map();
const BASE = new URL('../../data/', import.meta.url);

export function carregarDados(nome) {
  if (!cache.has(nome)) {
    const promessa = fetch(new URL(`${nome}.json`, BASE), { credentials: 'same-origin' })
      .then((resposta) => {
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        return resposta.json();
      })
      .catch((erro) => {
        cache.delete(nome);
        throw new Error(`Não foi possível carregar "${nome}.json" (${erro.message}).`);
      });
    cache.set(nome, promessa);
  }
  return cache.get(nome);
}

/** Substitui o conteúdo de `alvo` por uma mensagem de erro compreensível. */
export function mostrarErro(alvo, erro) {
  console.error(erro);
  const aviso = document.createElement('p');
  aviso.className = 'erro-carregamento';
  aviso.setAttribute('role', 'alert');
  aviso.textContent = location.protocol === 'file:'
    ? 'Este conteúdo precisa de um servidor web. Abra o site pelo endereço publicado ou rode "npm start" (veja o README).'
    : 'Não foi possível carregar este conteúdo. Verifique sua conexão e recarregue a página.';
  const item = alvo.tagName === 'UL' || alvo.tagName === 'OL' ? document.createElement('li') : null;
  alvo.replaceChildren(item ? (item.append(aviso), item) : aviso);
}

/** Mapa id → referência, para citar fontes em painéis e cartões. */
export async function mapaDeFontes() {
  const { fontes } = await carregarDados('fontes');
  return new Map(fontes.map((f) => [f.id, f]));
}
