# Peste Negra — Uma experiência histórica interativa

Site educativo sobre a Peste Negra (1347–1351), criado para uma feira de ciências e para acesso livre pela internet. O Doutor da Peste guia o visitante por história, ciência, personagens medievais, vida cotidiana, mitos e verdades, um quiz e o jogo de tabuleiro **A Peste Negra — Jornada Medieval**.

Criado por **Anderson Carapeto** © 2026.

- Sem cadastro, sem login, sem coleta de dados pessoais e sem serviços de terceiros.
- Funciona em celulares, tablets e computadores.
- Site estático: pode ser hospedado gratuitamente no GitHub Pages.

---

## Sumário

1. [O que tem no site](#o-que-tem-no-site)
2. [Estrutura do projeto](#estrutura-do-projeto)
3. [Executar no computador](#executar-no-computador)
4. [Testes](#testes)
5. [Gerar a versão de produção](#gerar-a-versão-de-produção)
6. [Publicar gratuitamente no GitHub Pages](#publicar-gratuitamente-no-github-pages)
7. [URL pública e QR Code](#url-pública-e-qr-code)
8. [Como atualizar o conteúdo](#como-atualizar-o-conteúdo)
9. [Ilustrações](#ilustrações)
10. [Segurança e privacidade](#segurança-e-privacidade)
11. [Acessibilidade, desempenho e SEO](#acessibilidade-desempenho-e-seo)
12. [Limitações conhecidas e pendências](#limitações-conhecidas-e-pendências)

---

## O que tem no site

| Página / seção | Conteúdo |
| --- | --- |
| **Abertura cinematográfica** | Rua medieval noturna em perspectiva, chuva, névoa, relâmpagos e a entrada do Doutor da Peste; título “A PESTE NEGRA” e botão “Descubra o que foi a Peste Negra”. Pode ser pulada (botão ou Esc), aparece uma vez por sessão e pode ser revista pelo menu. Som ambiente opcional (desligado por padrão) |
| **Menu lateral** | Fixo à esquerda no computador (pode ser recolhido), gaveta no celular e no tablet; destaca a seção visível e a página atual |
| **Início** (`index.html`) | Cenário noturno com parallax, névoa, partículas e o Doutor iluminado pela lanterna |
| O que foi a Peste Negra? | Contexto, estimativas (claramente marcadas), consequências e **mapa interativo** da disseminação |
| A bactéria responsável | *Yersinia pestis*, ciclo de transmissão, as três formas da peste e a evolução do conhecimento |
| Linha do tempo | 16 marcos, de 1338 aos dias de hoje; cada marco abre uma explicação com fontes |
| Personagens | 10 cartões (doutores da peste, flagelantes, erveiras, cirurgiões-barbeiros, médicos, apotecários, cuidadores, religiosos, comerciantes, coveiros) |
| Vida medieval | 7 temas em abas acessíveis, com as cenas fornecidas pelo autor e ilustrações do jogo |
| Mitos e verdades | 10 afirmações com resposta revelável e explicação |
| Jogos | Jogo de tabuleiro, quiz e QR Code para a feira de ciências |
| Ratos | Ratinhos atravessam, de vez em quando, as faixas vazias entre algumas seções (decoração que não bloqueia cliques) |
| **Quiz** (`quiz.html`) | Banco de 38 questões; 10 sorteadas por partida, sem repetir entre partidas enquanto houver questões novas |
| **Glossário** (`glossario.html`) | 28 termos, busca sem acentos e filtro por categoria |
| **Fontes** (`fontes.html`) | 20 referências com autor, link e assunto que fundamentam |
| **Jogo** (`jogos/jornada-medieval/`) | Jogo de tabuleiro original (60 casas, dado, quiz, Sorte ou Revés, 1 a 4 jogadores) |

### O jogo de tabuleiro

O jogo é o arquivo enviado pelo autor, integrado **sem alterar a lógica**. Mudanças feitas:

- links “← SITE” no topo e no menu de jogadores, para voltar ao site;
- **otimização para celulares**: o arquivo original tinha ~6,6 MB porque todas as imagens estavam embutidas. Em uma rede 4G simulada o tabuleiro ficava vazio por cerca de 36 s (o problema visto no Android). Agora os sprites são WebP embutidos e as 25 cartas ficam em `jogos/jornada-medieval/cartas/`, carregadas depois que o tabuleiro aparece. O jogo caiu para ~530 KB e, na mesma rede simulada, abre em ~5 s. Há também o aviso “Carregando o tabuleiro…”. Para reaplicar em uma nova versão do jogo: `python3 scripts/otimizar-jogo.py jogo-original.html jogos/jornada-medieval/index.html`.

Recursos verificados no arquivo:

- tabuleiro isométrico com **60 casas** + início e chegada;
- **dado D6**; passar da chegada faz voltar o excedente;
- **10 casas de quiz** (banco de 37 perguntas; errar faz voltar 2 casas);
- **10 casas de Sorte ou Revés** com 25 cartas ilustradas (avançar, voltar e perder a vez — incluindo situações de área interditada, porto fechado e inspeção sanitária);
- **1 a 4 jogadores** no mesmo aparelho, com 4 personagens;
- controles por toque, mouse e teclado; mapa arrastável.

Não há casas específicas de “quarentena” no tabuleiro: o tema aparece nas cartas de revés e de perder a vez.

## Estrutura do projeto

```
.
├── index.html, quiz.html, glossario.html, fontes.html, 404.html
├── site.webmanifest
├── assets/
│   ├── css/main.css              # sistema de design (tokens, componentes, animações)
│   ├── js/
│   │   ├── main.js               # ponto de entrada (carrega só os módulos da página)
│   │   ├── config.js             # URL pública do QR Code
│   │   └── modules/              # um módulo por recurso (quiz, glossário, mapa…)
│   ├── data/                     # conteúdo em JSON (separado da apresentação)
│   ├── images/
│   │   ├── cinema/               # abertura: céu, rua, relâmpago, Doutor e rato (WebP gerados)
│   │   ├── cenas/                # cenas da vida medieval (recortes das imagens do autor e do jogo)
│   │   ├── originais/            # imagens enviadas pelo autor, preservadas sem alteração
│   │   ├── characters/           # Doutor da Peste estilizado (SVG, ícone e retrato compacto)
│   │   ├── personagens/          # retratos em sombra dos ofícios (SVG)
│   │   ├── illustrations/        # diagramas científicos e mapa (SVG)
│   │   ├── games/                # capa, sprites e retratos do jogo (WebP)
│   │   └── icons/                # favicon, ícones e sprite de ícones
│   ├── fonts/                    # Cinzel e Alegreya (locais, licença OFL)
│   └── vendor/qrcode-generator/  # gerador de QR Code (MIT)
├── jogos/jornada-medieval/       # jogo (index.html) e cartas/ em WebP
├── scripts/                      # build, servidor local e geradores de arte
├── tests/unit/                   # testes de lógica (node:test)
├── tests/e2e/                    # testes de navegador (Playwright + axe-core)
└── .github/workflows/deploy.yml  # testes + publicação no GitHub Pages
```

**Tecnologias:** HTML5 semântico, CSS3 com variáveis, JavaScript em módulos ES (sem framework), SVG e JSON. Não há backend, banco de dados nem dependências em tempo de execução além do gerador de QR Code incluído no repositório. As ferramentas de desenvolvimento (Playwright, axe-core, fontes e QR) ficam em `devDependencies`.

## Executar no computador

Requisitos: [Node.js](https://nodejs.org/) 20 ou superior.

```bash
npm install        # instala as ferramentas de desenvolvimento e de teste
npm start          # abre o servidor local em http://localhost:8080
```

> Abrir o `index.html` com duplo clique (endereço `file://`) não funciona por completo: os navegadores bloqueiam a leitura dos arquivos JSON e dos módulos JavaScript nesse modo. Use `npm start` ou qualquer servidor estático (por exemplo, `python3 -m http.server 8080`).

Para usar outra porta: `PORT=3000 npm start`.

## Testes

```bash
npx playwright install chromium   # apenas na primeira vez
npm test                          # testes unitários + testes de navegador
npm run test:unit                 # só a lógica (rápido, sem navegador)
npm run test:e2e                  # só os testes de navegador
```

O que é verificado:

- **Unitários (31):** regras do quiz (10 questões distintas por sessão, sem repetição entre sessões, embaralhamento, pontuação, respostas inválidas), busca do glossário, validação da URL do QR Code, integridade do conteúdo (fontes citadas existem, imagens existem, temas obrigatórios presentes) e o build.
- **Navegador (desktop 1366×800 e celular Pixel 7):** carregamento sem erros de console, imagens quebradas ou recursos externos; links internos; botões da abertura; menu móvel; cartões de personagens; linha do tempo; abas; mapa; mitos; glossário; quiz completo (2 partidas, pontuação, reinício); QR Code (decodificado da tela e comparado com a URL configurada); jogo (abre, inicia partida, lança o dado); navegação por teclado; ausência de rolagem horizontal; redução de movimento; e o **build publicado em subdiretório** (como no GitHub Pages), incluindo a página 404.
- **Acessibilidade:** axe-core com regras WCAG 2.0/2.1/2.2 A e AA em todas as páginas, no painel modal e no quiz respondido.

## Gerar a versão de produção

```bash
npm run build                                            # gera dist/
npm run build -- --url https://SEU-USUARIO.github.io/peste_negra/
node scripts/serve.mjs dist                              # conferir o resultado
```

O build copia apenas os arquivos do site para `dist/` e verifica se todos os arquivos referenciados existem e se os JSON são válidos. Com `--url`, também grava a URL pública no QR Code, cria `sitemap.xml`, `robots.txt`, link canônico e metadados de compartilhamento (Open Graph). O build recusa URLs de `localhost` ou de redes privadas.

## Publicar gratuitamente no GitHub Pages

O repositório já inclui o workflow `.github/workflows/deploy.yml`, que roda os testes e publica o site a cada push na branch `main` (ou `master`).

1. Envie o projeto para o GitHub (o repositório deve ser **público** para usar o GitHub Pages gratuito).
2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment → Source**, escolha **GitHub Actions**.
4. Faça merge das alterações na branch `main` (ou rode o workflow manualmente em **Actions → Testar e publicar no GitHub Pages → Run workflow**).
5. Aguarde a conclusão. O endereço aparece na própria página de Settings → Pages e no resumo do workflow. Para este repositório ele deve ser parecido com `https://andevbr.github.io/peste_negra/`.
6. Abra o site publicado, role até “Leve a experiência com você” e **teste o QR Code com um celular**.

Não é necessário comprar domínio. Se quiser usar um domínio próprio no futuro, configure-o em Settings → Pages; o workflow passará a usar o novo endereço automaticamente.

**Alternativas gratuitas** (caso não queira usar o GitHub Pages): Netlify, Cloudflare Pages ou Vercel também hospedam sites estáticos. Basta apontar a pasta `dist/` gerada por `npm run build -- --url https://endereco-final/`.

## URL pública e QR Code

O QR Code **nunca** aponta para `localhost`, IPs privados ou arquivos locais. Há três formas de definir o endereço:

1. **Automática (recomendada):** o workflow de publicação recebe a URL do GitHub Pages e a grava em `assets/js/config.js` durante o build.
2. **Detecção no navegador:** com `SITE_PUBLICO = ''`, o site usa o próprio endereço quando aberto em HTTPS público.
3. **Manual:** edite `assets/js/config.js`:
   ```js
   export const SITE_PUBLICO = 'https://www.seudominio.com.br/';
   export const QR_DESTINO = 'jogos/jornada-medieval/'; // '' para abrir a página inicial
   ```

Em `npm start` o QR Code fica desativado de propósito e mostra um aviso. Para a feira, recomenda-se **imprimir o QR Code** a partir do site publicado e deixá-lo também em cartaz.

## Como atualizar o conteúdo

Todo o conteúdo interativo está em `assets/data/`:

| Arquivo | O que contém |
| --- | --- |
| `quiz.json` | Perguntas do quiz. `correta` é o índice (0 a 3) da alternativa certa; `porSessao` define quantas por partida |
| `linha-do-tempo.json` | Marcos da linha do tempo |
| `personagens.json` | Cartões de personagens |
| `mitos.json` | Afirmações de mitos e verdades (`verdade`, `mito` ou `em parte`) |
| `glossario.json` | Termos do glossário e categorias |
| `fontes.json` | Referências. Os outros arquivos citam fontes pelo `id` |
| `mapa.json` | Cidades do mapa (gerado com `scripts/gerar-mapa.mjs`) |

Os textos longos das seções (história, bactéria, cotidiano) estão no `index.html`. Depois de editar, rode `npm test`: os testes avisam se faltar campo, se uma fonte citada não existir ou se uma imagem estiver ausente. Para atualizar o jogo, rode `python3 scripts/otimizar-jogo.py nova-versao.html jogos/jornada-medieval/index.html` (otimiza as imagens) e, se quiser manter o botão de voltar, reaplique o link “← SITE” (veja o histórico do git).

## Ilustrações e imagens

Nenhuma imagem foi copiada de terceiros e **não foi usado gerador de imagens por IA** (a ferramenta não estava disponível neste ambiente). As imagens do site têm quatro origens:

| Origem | Onde aparece |
| --- | --- |
| **Imagens enviadas pelo autor** (originais preservados em `assets/images/originais/`) | Vida medieval: alimentação, higiene, crenças, quarentena e famílias. Foram apenas recortadas para retirar a moldura e o texto das capturas e convertidas para WebP |
| **Arte do jogo “Jornada Medieval”** | Retratos da erveira, do flagelante e do cirurgião-barbeiro; cenas de moradias e de mercado; fundos atmosféricos (desfocados); capa do jogo |
| **Arte cinematográfica criada por código** (`scripts/arte/cinema.mjs`) | Abertura e início do site: céu de tempestade, rua medieval em perspectiva 3D (casas de enxaimel, calçamento molhado, reflexos), versões iluminadas pelo relâmpago, Doutor da Peste com proporções realistas (silhueta e versão iluminada) e o rato animado (6 quadros) |
| **Ilustrações vetoriais criadas por código** (`scripts/arte/*.mjs`) | Diagramas científicos, mapa (contornos Natural Earth, domínio público), retratos em sombra dos ofícios, ícones |

Para regenerar:

```bash
npm run art      # SVGs (diagramas, retratos em sombra, ícones)
npm run cinema   # WebP da abertura e do rato (usa o Playwright)
npm run images   # capa do jogo, imagem de compartilhamento e ícones PNG
npm run map -- ne_50m_land.geojson ne_50m_lakes.geojson   # mapa a partir do Natural Earth
```

### Pontos preparados para receber imagens realistas

A arte criada por código tem aparência cinematográfica, mas **não é fotorrealista**. Para trocar por ilustrações realistas, basta substituir o arquivo mantendo o nome (ou alterar o caminho indicado):

| Recurso | Arquivo atual | Formato sugerido |
| --- | --- | --- |
| Doutor da Peste (abertura e início) | `assets/images/cinema/doutor-luz.webp` e `doutor-silhueta.webp` (+ versões `-pequeno`) | PNG/WebP com fundo transparente, 640×1120, figura inteira de frente |
| Cenário da abertura | `assets/images/cinema/rua-noite.webp`, `rua-relampago.webp`, `ceu-*.webp` | 1920×1080 (rua com o céu transparente, ou uma única imagem no lugar da rua) |
| Rato | `assets/images/cinema/rato-quadros.webp` | 6 quadros lado a lado do rato andando para a direita, fundo transparente (proporção 300×110 por quadro) |
| Retratos dos ofícios sem arte própria (médico universitário, apotecário, cuidadora, religioso, comerciante, coveiro) | campo `imagem` em `assets/data/personagens.json` (hoje `assets/images/personagens/sombra-*.svg`) | Retrato 4:5; altere também `tipoImagem` para `"arte"` |
| Moradias e ruas / Mercados e comércio | `assets/images/cenas/jogo-rua-interditada.webp` e `jogo-mercado.webp` (cenas das cartas do jogo) | Mesmo estilo das outras cenas da vida medieval, 16:10 |

## Segurança e privacidade

O site é estático: **não há servidor de aplicação, banco de dados, login, formulários que enviam dados nem cookies**. Por isso, riscos como injeção de SQL, roubo de sessão ou vazamento de banco de dados não se aplicam. Continuam relevantes os riscos do lado do navegador e da cadeia de dependências, tratados assim:

- **Sem `innerHTML` e sem `eval`:** todo conteúdo é inserido com `textContent`/DOM; a busca do glossário é normalizada e limitada a 60 caracteres (há teste que tenta injetar HTML).
- **Content Security Policy** em `<meta>` nas páginas do site: apenas scripts, estilos, fontes e imagens do próprio site (`'self'`); bloqueio de `object`, `frame`, envio de formulários e `base-uri` externo; `upgrade-insecure-requests`.
- **Sem scripts nem recursos externos** (fontes locais, nenhum serviço de análise ou rastreamento). Links para as fontes abrem em nova aba com `rel="noopener noreferrer"`.
- **Privacidade:** o quiz guarda no `localStorage` apenas os ids das perguntas já sorteadas, para variar as partidas. Nenhum dado pessoal é coletado.
- **Dependências:** nenhuma em tempo de execução além do `qrcode-generator` (MIT) versionado no repositório. As dependências de desenvolvimento são verificadas com `npm audit` no workflow (resultado local atual: 0 vulnerabilidades).
- **HTTPS:** fornecido pelo GitHub Pages (marque “Enforce HTTPS” em Settings → Pages).

Limitações que não podem ser resolvidas no GitHub Pages:

- O GitHub Pages **não permite configurar cabeçalhos HTTP**. A CSP é aplicada por `<meta>`, que não suporta `frame-ancestors` (proteção contra o site ser exibido dentro de outro) nem cabeçalhos como `Permissions-Policy`. Se isso for necessário, use Netlify ou Cloudflare Pages com um arquivo de cabeçalhos.
- A página do jogo é o arquivo original do autor, com scripts e estilos embutidos; por isso ela **não** recebeu a CSP restritiva das demais páginas. O jogo não carrega nada externo (verificado nos testes).

## Acessibilidade, desempenho e SEO

- HTML semântico, link “Pular para o conteúdo”, foco visível, navegação completa por teclado (abas com setas, painel modal com `<dialog>` que fecha com Esc e devolve o foco), textos alternativos, regiões `aria-live` para mensagens, contraste WCAG AA em todos os pares de cores do sistema de design, e respeito a `prefers-reduced-motion`.
- Acerto/erro e vereditos usam **texto e ícone**, não só cor.
- Desempenho: sem frameworks nem bibliotecas de animação (CSS, Canvas 2D e Web Animations); camadas da abertura pré-renderizadas em WebP (~350 KB no computador, ~200 KB no celular, com `srcset`); fontes locais com `font-display: swap`; `loading="lazy"` nas imagens abaixo da dobra; módulos carregados sob demanda; chuva e partículas pausadas fora da tela; ratos desativados em aparelhos com pouca memória ou economia de dados. O jogo (~530 KB) só é baixado quando o visitante clica em “Jogar agora”.
- Abertura: cada relâmpago é um clarão suave com no máximo duas oscilações, e há sempre mais de 1 segundo entre um relâmpago e outro — abaixo do limite de três flashes por segundo do critério WCAG 2.3.1; som nunca toca sozinho; com redução de movimento a abertura mostra só a cena final, sem animação.
- SEO: títulos e descrições em português, hierarquia de títulos, Open Graph, dados estruturados (schema.org), `sitemap.xml` e `robots.txt` gerados no build com a URL real (a indexação não é bloqueada; apenas a página 404 tem `noindex`).

## Limitações conhecidas e pendências

**Dependem de ação manual:**

- O site já está publicado no GitHub Pages a partir da branch `claude/peste-negra-educational-site-lbso28` (opção “Deploy from a branch”). Cada novo envio para essa branch atualiza o site. Para usar o workflow de testes antes da publicação, mude a origem para “GitHub Actions” e faça merge na `main`.
- Depois de publicado, **testar o QR Code com celulares reais** (Android e iPhone) e imprimir para a feira.
- Recomenda-se que um(a) professor(a) de história/ciências revise os textos antes da apresentação.
- Escolher uma licença para o projeto, se desejar (nenhum arquivo de licença foi adicionado).

**Não validado neste ambiente:**

- Os links externos das referências foram conferidos por pesquisa na web em outubro de 2026, mas o ambiente de desenvolvimento não tinha acesso direto a alguns sites (OMS, CDC, gov.br, Britannica). Abra-os uma vez para confirmar.
- Testes em aparelhos físicos (iPhone/Safari e Android) não foram feitos; os testes automatizados usam o Chromium com emulação de celular.
- Não foi executada auditoria Lighthouse nem leitor de tela real (NVDA, VoiceOver).

**Limitações de conteúdo e do jogo:**

- A arte da abertura, o Doutor e o rato foram criados por código: têm direção de arte cinematográfica, mas não são fotorrealistas (veja “Pontos preparados para receber imagens realistas”). Seis ofícios aparecem como retratos em sombra até receberem ilustrações próprias.
- As cenas de moradias e de mercado usam ilustrações das cartas do jogo, em estilo diferente das cenas enviadas pelo autor.

- Algumas informações gerais sobre ofícios medievais (cirurgiões-barbeiros, erveiras, uroscopia, teoria dos humores) não têm referência específica listada; o site indica isso nos painéis.
- A lógica do jogo é preservada como foi enviada. Ele usa `user-scalable=no` (impede o zoom por pinça, útil para o jogo, mas uma limitação de acessibilidade) e algumas perguntas simplificam a transmissão (por exemplo, atribuindo-a só a ratos). O site apresenta a visão mais completa na seção “A bactéria responsável” e em “Mitos e verdades”.
- Não há modo offline: o site precisa de internet. Para a feira, deixe uma aba aberta com o site carregado ou garanta acesso à rede.
