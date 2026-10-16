# A Peste Negra — uma experiência histórica interativa

Esse é um site que eu e a Lorena fizemos para a feira de ciências, sobre a Peste Negra (1347–1351).
A ideia foi sair do trabalho em cartolina e fazer uma coisa que dá pra abrir no celular, no tablet ou no
computador, com texto, imagens e jogos pra deixar o assunto mais divertido de aprender.

O site é guiado pelo Doutor da Peste e tem: a história da doença, a parte da ciência (a bactéria),
uma linha do tempo, os personagens da época, como era a vida medieval, mitos e verdades, um quiz e
dois jogos (um de tabuleiro e um da memória).

Criado por **Anderson e Lorena Carapeto** © 2026.

Está publicado de graça no GitHub Pages: https://andevbr.github.io/peste_negra/

---

## Um projeto de pai e filha 💛

Mais do que um trabalho de escola, este projeto foi feito a quatro mãos — de pai e filha — e virou
um tempo bom passado juntos, pesquisando, escolhendo as imagens, testando os jogos e rindo dos erros
pelo caminho. No fim, o que fica não é só o site: é a união que ele trouxe pra casa.

A gente acredita que educação de verdade acontece quando (estudante, família e escola) caminham
lado a lado. Este projeto é um pedacinho disso — a Lorena aprendendo, a família participando e a
escola abrindo o espaço pra essa experiência existir. Que seja o primeiro de muitos. 🌱

---

## O que tem no site

- **Abertura** com um vídeo do Doutor da Peste andando pela rua (dá pra pular e pra ligar/desligar o som).
- **Início** com o menu do lado e as seções principais.
- **A Peste Negra** — o que foi, quando aconteceu e um mapa de como se espalhou.
- **A bactéria** — a *Yersinia pestis*, como era transmitida e as formas da doença.
- **Linha do tempo** — os principais acontecimentos, de 1347 até hoje.
- **Personagens** — 10 cartões com quem vivia (e trabalhava) na época da peste.
- **Vida medieval** — o dia a dia, em abas por tema.
- **Mitos e verdades** — frases pra descobrir se são verdade ou não.
- **Jogos** — o jogo de tabuleiro, o jogo da memória e o quiz, mais um QR Code pra abrir no celular.
- **Glossário** e **Fontes** — os termos difíceis explicados e de onde tiramos as informações.

### Os jogos
- **Jornada Medieval** (tabuleiro): anda pelas casas com o dado, responde perguntas e pega cartas
  de Sorte ou Revés. De 1 a 5 jogadores, cada um escolhe um personagem.
- **Jogo da memória**: vira as cartas e acha os pares de personagens e cenas da peste.
- **Quiz**: 10 perguntas sorteadas a cada vez, com explicação nas respostas.

---

## Como foi feito

Fiz o site "na mão", com as linguagens básicas da web:

- **HTML** — a estrutura das páginas.
- **CSS** — todo o visual (cores, layout que se ajusta ao tamanho da tela, animações).
- **JavaScript** — a parte que interage (menu, quiz, jogos). Sem usar nenhum framework pronto.
- **JSON** — os textos, perguntas e personagens ficam em arquivos separados, pra ser mais fácil mexer.

O site é "estático": são só arquivos que abrem direto no navegador, sem precisar de servidor nem banco
de dados. Por isso dá pra hospedar de graça e funciona bem até em celular mais fraco.

As imagens pesadas foram convertidas pra formatos leves (WebP) e os jogos foram otimizados pra abrir
rápido no celular, carregando as imagens aos poucos.

---

## Pastas do projeto

```
index.html, quiz.html, glossario.html, fontes.html   -> as páginas
assets/css/      -> o visual (main.css)
assets/js/       -> os códigos (main.js e a pasta modules/)
assets/data/     -> os textos e perguntas (arquivos .json)
assets/images/   -> as imagens
assets/video/    -> o vídeo da abertura
assets/fonts/    -> as fontes (ficam no próprio site, pra funcionar offline)
jogos/jornada-medieval/   -> o jogo de tabuleiro
jogos/jogo-da-memoria/    -> o jogo da memória
tests/           -> testes automáticos pra conferir se nada quebrou
```

---

## Abrir no computador

Precisa ter o [Node.js](https://nodejs.org/) instalado. Aí, na pasta do projeto:

```bash
npm install     # baixa as ferramentas (só na primeira vez)
npm start       # abre em http://localhost:8080
```

Não dá pra abrir o `index.html` com dois cliques, porque o navegador bloqueia a leitura dos arquivos.
Tem que usar o `npm start` (ou outro servidor local simples).

Pra rodar os testes: `npm test`.

---

## Publicar / atualizar

O site está no GitHub Pages. Pra mudar alguma coisa, é só enviar os arquivos atualizados pro GitHub
(na branch que está configurada em **Settings → Pages**) e disparar a atualização por lá.

Os textos e perguntas ficam em `assets/data/` (arquivos `.json`); os textos maiores das seções ficam
dentro do `index.html`.

---

## Privacidade

O site não pede cadastro, não tem login e não guarda nenhum dado de quem acessa. Não usa cookies nem
serviços de fora. Só precisa de internet pra abrir.

---

Projeto feito com muito cuidado pra ficar bonito, educativo e fácil de usar. Esperamos que gostem! 😊
