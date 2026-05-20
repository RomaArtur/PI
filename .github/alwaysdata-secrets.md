# Secrets necessarios no GitHub

Cadastre estes secrets em `Settings > Secrets and variables > Actions`:

- `ALWAYSDATA_FTP_HOST`
  - Valor para o seu caso: `ftp-stylodesigner.alwaysdata.net`
- `ALWAYSDATA_FTP_USER`
  - Valor para o seu caso: `stylodesigner_admin`
- `ALWAYSDATA_FTP_PASSWORD`
  - Sua senha FTP
- `ALWAYSDATA_REMOTE_PATH`
  - Valor para o seu caso: `/www`
- `ALWAYSDATA_FTP_PROTOCOL`
  - Opcional
  - Use `ftp` por padrao
  - Se sua conta estiver configurada para FTPS, pode usar `ftps`
- `ALWAYSDATA_SITE_ID`
  - ID numerico do site Node.js no AlwaysData
- `ALWAYSDATA_ACCOUNT`
  - Nome da conta alwaysdata
- `ALWAYSDATA_API_TOKEN`
  - Token da API do AlwaysData

## O que o workflow faz

1. Baixa o codigo do GitHub.
2. Envia o projeto via FTP para o AlwaysData.
3. Reinicia o site Node.js pela API do AlwaysData.

## Limitacao importante

Esse fluxo por FTP atualiza os arquivos, mas nao executa comandos remotos como `npm install`.

Entao:

- para alteracoes de codigo em `src`, HTML, CSS e JS, ele atende bem;
- se `backend/package.json` mudar, voce provavelmente vai precisar instalar dependencias no servidor manualmente ou migrar depois para deploy por SSH.

## Antes do primeiro deploy

- Confirme o `ALWAYSDATA_SITE_ID` do site Node.js.
- Gere um `ALWAYSDATA_API_TOKEN` no painel do AlwaysData.
- Cadastre todos os secrets acima no GitHub.
- Rode manualmente o workflow uma vez em `Actions > Deploy AlwaysData`.
