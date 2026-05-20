# Postman - Guia rapido

Arquivos principais:

- `PI.postman_collection.json`
- `PI.local.postman_environment.json`
- `PI.producao.postman_environment.json`

## Como usar

1. Importe a collection `PI.postman_collection.json`.
2. Importe um environment:
   - `PI.local.postman_environment.json`
   - `PI.producao.postman_environment.json`
3. Selecione o environment desejado.
4. Rode `Auth / Login` para preencher `token`.
5. Rode os requests de produtos, midia, leads e vendedores.

## Variaveis usadas

- `apiBaseUrl`
- `uploadsBaseUrl`
- `token`
- `produtoId`
- `mediaId`
- `leadId`
- `vendedorId`
- `productImagePath`
- `galleryImagePath`

## Dica para upload

Os requests multipart usam `productImagePath` e `galleryImagePath` como caminho local do arquivo no seu computador. Ajuste essas variaveis antes de testar uploads no Postman.
