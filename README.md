# Um convite para amanhã

Uma história interativa de uma página, feita com HTML, CSS e JavaScript vanilla. Não usa backend, coleta de dados ou dependências de runtime; as fontes do Google Fonts são opcionais e têm alternativas locais.

## Personalizar

No início de `script.js`, ajuste `CONFIG`:

- `whatsappNumber`: número com DDI e DDD, somente dígitos (por exemplo, formato `55` + DDD + número). Está vazio para evitar publicar um telefone real por acidente. Enquanto estiver vazio, o WhatsApp abre a seleção de conversa com a mensagem pronta.
- `dateText`: texto da data exibida no convite.
- `startCity`: cidade de saída.
- `romanticMessage`: opção reservada para personalizações da mensagem.

As respostas usam links `wa.me` e `encodeURIComponent()`. O texto enviado é diferente para o aceite e para a recusa.

## Testar localmente

Abra `index.html` diretamente no navegador. A experiência também funciona com a fonte offline, usando as alternativas serifada e sans-serif do sistema.

## Publicar no GitHub Pages

Envie estes arquivos para a raiz do repositório. No GitHub, abra **Settings > Pages**, selecione a branch e a pasta raiz (`/`) como origem e salve. O arquivo `index.html` será a entrada do site.

O projeto respeita a preferência de movimento reduzido do dispositivo. Não há áudio, permissões ou conteúdo carregado de outros serviços além das fontes opcionais.