// Configuração do site.
//
// SITE_PUBLICO: endereço público e permanente do site (com https:// e barra final),
// usado pelo QR Code da seção "Leve a experiência com você".
// - Deixe vazio ('') para detectar automaticamente o endereço quando o site estiver
//   publicado em HTTPS (ex.: GitHub Pages). Em localhost ou redes privadas o QR Code
//   não é gerado, para evitar códigos que não funcionam fora do computador local.
// - O workflow de publicação (.github/workflows/deploy.yml) preenche este valor
//   automaticamente com o endereço informado pelo GitHub Pages.
// - Para um domínio próprio, escreva aqui, por exemplo: 'https://www.meudominio.com.br/'
export const SITE_PUBLICO = '';

// Caminho (relativo ao site) que o QR Code abre. Use '' para a página inicial.
export const QR_DESTINO = 'jogos/jornada-medieval/';
