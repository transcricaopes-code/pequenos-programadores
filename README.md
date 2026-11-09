# Pequenos Programadores — Curso Scratch

Plataforma educacional estática para acompanhar as primeiras aulas de programação com Scratch.

## Conteúdo atual

- **Módulo 1 — Minha primeira programação**
  - Aula 1: Conhecendo o mundo do Scratch
  - Aula 2: Criando meu personagem animado
  - Grande missão: Meu primeiro mundo no Scratch
- **Módulo 2 — Movimento, repetição e animações**
  - Aula 3: Faça o personagem repetir (`repita`)
  - Aula 4: Animação sem parar (`sempre`, fantasias e `espere`)
  - Projeto final: O personagem dançarino

## Recursos

- Navegação por aulas e etapas.
- Atividades e perguntas com correção automática.
- Liberação progressiva das aulas e projetos.
- Registro do progresso no armazenamento local do navegador.
- Painel de orientação para o responsável.
- Layout responsivo para computador e tablet.

## Executar localmente

Não há etapa de build. Abra `index.html` em um navegador ou utilize uma extensão de servidor local, como Live Server.

## Publicar na Vercel

1. Envie a pasta do projeto para a raiz de um repositório GitHub.
2. Na Vercel, importe o repositório.
3. Selecione o framework **Other** (site estático).
4. Deixe Build Command e Output Directory vazios; não há etapa de build.
5. Faça o deploy.

O arquivo `vercel.json` mantém a configuração simples de site estático.

## Persistência e próxima etapa

Nesta versão, o progresso fica salvo no navegador/dispositivo, usando a mesma chave local da primeira versão para preservar o progresso anterior do Módulo 1. Ele ainda **não sincroniza** automaticamente entre computador e tablet. Para isso, a próxima evolução será integrar autenticação e banco de dados no Supabase, com acesso administrado pelo responsável.

## Segurança

Não inclua chaves administrativas, senhas de banco ou tokens secretos em arquivos públicos do site.
