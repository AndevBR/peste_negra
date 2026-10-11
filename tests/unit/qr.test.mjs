import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enderecoEhPublico, resolverEnderecoQr } from '../../assets/js/modules/qr-endereco.js';

test('aceita apenas endereços HTTPS públicos', () => {
  assert.equal(enderecoEhPublico('https://usuario.github.io/peste_negra/'), true);
  assert.equal(enderecoEhPublico('https://www.exemplo.com.br/'), true);
  for (const url of ['http://usuario.github.io/', 'https://localhost:8080/', 'https://127.0.0.1/', 'https://192.168.0.10/',
    'https://10.0.0.2/', 'https://172.20.1.1/', 'https://[::1]/', 'https://meupc.local/', 'file:///C:/site/index.html',
    'https://usuario:senha@exemplo.com/', 'nada', '']) {
    assert.equal(enderecoEhPublico(url), false, url);
  }
});

test('em ambiente local sem configuração, o QR Code não é gerado', () => {
  const r = resolverEnderecoQr('', 'http://localhost:8080/', 'http://localhost:8080/', 'jogos/jornada-medieval/');
  assert.deepEqual(r, { url: null, motivo: 'local' });
});

test('publicado em HTTPS, o endereço é detectado a partir da raiz do site', () => {
  const r = resolverEnderecoQr('', 'https://usuario.github.io/peste_negra/#jogos', 'https://usuario.github.io/peste_negra/', 'jogos/jornada-medieval/');
  assert.deepEqual(r, { url: 'https://usuario.github.io/peste_negra/jogos/jornada-medieval/', motivo: 'detectado' });
});

test('a URL configurada tem prioridade, mesmo testando localmente', () => {
  const r = resolverEnderecoQr('https://www.exemplo.com.br/peste', 'http://localhost:8080/', 'http://localhost:8080/', '');
  assert.deepEqual(r, { url: 'https://www.exemplo.com.br/peste/', motivo: 'configurado' });
});

test('URL configurada que não é pública é recusada', () => {
  assert.equal(resolverEnderecoQr('http://192.168.0.5/', 'https://x.github.io/', 'https://x.github.io/', '').url, null);
});
