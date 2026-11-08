# Pequenos Programadores — Módulo 1

Plataforma web estática, responsiva e sem dependências, preparada para publicação na Vercel.

## Arquivos

- `index.html` — estrutura e conteúdo do curso.
- `styles.css` — identidade visual e adaptação para computador/tablet/celular.
- `app.js` — navegação, quizzes, checklist, bloqueio progressivo e salvamento local.
- `vercel.json` — configuração simples de publicação estática.

## Testar localmente

Basta abrir `index.html` no navegador. Para simular um servidor local, também é possível executar:

```bash
python3 -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Publicar na Vercel

1. Crie um repositório no GitHub e envie os quatro arquivos deste projeto para a raiz do repositório.
2. Na Vercel, selecione **Add New → Project** e importe esse repositório.
3. Como é um site estático, não é necessário configurar framework nem comando de build.
4. Mantenha a raiz do projeto como `./` e publique.
5. A Vercel fornecerá um endereço `.vercel.app`.

## Como funciona o progresso

O nome, respostas e atividades concluídas são armazenados no `localStorage` do navegador. Isso significa que o progresso fica salvo no mesmo navegador e dispositivo. Nesta versão, os dados não são sincronizados entre computador e tablet e não existe login ou banco de dados.

## Próximas evoluções possíveis

- Cadastro/perfil do aluno e sincronização entre dispositivos.
- Painel do responsável com histórico de atividades.
- Mais módulos do curso.
- Atividades de programação incorporadas ou conectadas a projetos do Scratch.
- Área de publicação de projetos e portfólio.

## Observação

A plataforma é um ambiente de aprendizagem complementar. As atividades de programação acontecem no editor oficial do Scratch, aberto em uma nova aba.
