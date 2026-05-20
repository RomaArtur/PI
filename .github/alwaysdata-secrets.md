# Secrets necessarios no GitHub

Cadastre estes secrets em `Settings > Secrets and variables > Actions`:

- `ALWAYSDATA_HOST`
  - Exemplo: `ssh-seuusuario.alwaysdata.net`
- `ALWAYSDATA_SSH_USER`
  - Usuario SSH da conta alwaysdata
- `ALWAYSDATA_SSH_KEY`
  - Chave privada SSH usada para deploy
- `ALWAYSDATA_SSH_PORT`
  - Opcional. Se nao informar, usa `22`
- `ALWAYSDATA_PROJECT_PATH`
  - Caminho remoto do projeto
  - Exemplo: `/home/seuusuario/www/pi`
- `ALWAYSDATA_SITE_ID`
  - ID numerico do site Node.js no AlwaysData
- `ALWAYSDATA_ACCOUNT`
  - Nome da conta alwaysdata usado na API
- `ALWAYSDATA_API_TOKEN`
  - Token da API do AlwaysData

## O que o workflow faz

1. Baixa o codigo do GitHub.
2. Copia o projeto via `rsync` para o servidor.
3. Executa `npm install --omit=dev` em `backend/`.
4. Reinicia o site Node.js via API do AlwaysData.

## Antes do primeiro deploy

- Garanta que a chave publica correspondente a `ALWAYSDATA_SSH_KEY` esta autorizada no AlwaysData.
- Garanta que o caminho remoto em `ALWAYSDATA_PROJECT_PATH` aponta para o projeto certo.
- Garanta que o site Node.js do AlwaysData esta configurado para iniciar a aplicacao a partir desse projeto.
