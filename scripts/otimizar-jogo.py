"""Otimiza o jogo "A Peste Negra — Jornada Medieval" para carregar rápido em celulares.

O arquivo original tem ~6,6 MB porque todas as imagens estão embutidas em base64
(16 sprites PNG e 25 cartas JPEG). Em 4G isso deixava o tabuleiro vazio por dezenas
de segundos. Este script NÃO altera a lógica do jogo; ele apenas:

1. recomprime os sprites dos personagens como WebP (continuam embutidos, pois
   aparecem logo no início);
2. move as imagens das 25 cartas para arquivos WebP em jogos/jornada-medieval/cartas/
   — o jogo já usa o campo "imagem" como endereço da figura, então basta trocar o
   data URI pelo caminho do arquivo; as cartas são pré-carregadas depois que o
   tabuleiro aparece;
3. mostra "Carregando o tabuleiro…" enquanto a página termina de baixar.

Uso:  python3 scripts/otimizar-jogo.py ENTRADA.html jogos/jornada-medieval/index.html
(ENTRADA pode ser o arquivo original enviado pelo autor ou o índice atual.)
Requer: Pillow (pip install pillow).
"""
import base64
import io
import pathlib
import re
import sys

from PIL import Image

QUALIDADE_SPRITE = 90
QUALIDADE_CARTA = 80


def webp_base64(dados, qualidade):
    im = Image.open(io.BytesIO(dados))
    saida = io.BytesIO()
    im.save(saida, 'WEBP', quality=qualidade, method=6)
    return base64.b64encode(saida.getvalue()).decode('ascii')


def main(entrada, destino):
    html = pathlib.Path(entrada).read_text(encoding='utf-8')
    destino = pathlib.Path(destino)
    pasta_cartas = destino.parent / 'cartas'
    pasta_cartas.mkdir(parents=True, exist_ok=True)

    # 1) cartas: "imagem": "data:image/jpeg;base64,..." → "imagem": "cartas/<id>.webp"
    def trocar_carta(m):
        linha = m.group(0)
        ident = re.search(r'"id": "([a-z0-9]+)"', linha).group(1)
        dados = base64.b64decode(re.search(r'"imagem": "data:image/[a-z]+;base64,([A-Za-z0-9+/=]+)"', linha).group(1))
        im = Image.open(io.BytesIO(dados)).convert('RGB')
        im.save(pasta_cartas / f'{ident}.webp', 'WEBP', quality=QUALIDADE_CARTA, method=6)
        return re.sub(r'"imagem": "data:image/[a-z]+;base64,[A-Za-z0-9+/=]+"', f'"imagem": "cartas/{ident}.webp"', linha)

    html, n_cartas = re.subn(r'^  \{"id": "[a-z0-9]+", "efeito".*$', trocar_carta, html, flags=re.M)

    # 2) sprites PNG embutidos → WebP embutidos
    def trocar_sprite(m):
        return 'data:image/webp;base64,' + webp_base64(base64.b64decode(m.group(1)), QUALIDADE_SPRITE)

    html, n_sprites = re.subn(r'data:image/png;base64,([A-Za-z0-9+/=]+)', trocar_sprite, html)

    # 3) aviso de carregamento (some quando o script do jogo termina de rodar)
    if 'id="carregando"' not in html:
        html = html.replace('<main id="mapa">', '<main id="mapa">\n  <div id="carregando" role="status">Carregando o tabuleiro…</div>', 1)
        html = html.replace('</style>\n<meta name="description"', '''  #carregando { position: absolute; inset: 0; z-index: 5; display: flex; align-items: center; justify-content: center;
    font-size: 18px; letter-spacing: 0.05em; color: #f4ead0; background: #0e1f2e; }
</style>
<meta name="description"''', 1)
        html = html.replace('</script>\n</body>', '''</script>
<script>
// integração com o site: remove o aviso de carregamento e pré-carrega as cartas em segundo plano
(function () {
  var aviso = document.getElementById('carregando'); if (aviso) aviso.remove();
  setTimeout(function () {
    if (!window.jornada) return;
    window.jornada.CARTAS.forEach(function (c) { if (c.imagem) { var im = new Image(); im.src = c.imagem; } });
  }, 2500);
})();
</script>
</body>''', 1)

    destino.write_text(html, encoding='utf-8')
    print(f'{n_cartas} cartas e {n_sprites} sprites otimizados; {destino} = {destino.stat().st_size / 1024:.0f} KB')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
