### Contexto
Você está executando uma modernização de uma aplicação e deseja garantir que suas documentações estejam claras. 
Para isso, você irá extrair e complementar informações relevantes sobre termos de negócios de pagamentos.

### Objetivo
- Analise essa documentação como base `[cartões/nome-do-modulo]` e extraia os termos de negócios de pagamentos citados.
  - Exemplos: Tokenização, autorizador de cartões de crédito, Recobrança Diária, Régua de Retentativa, etc
- Criar uma lista com os termos encontrados.

### Regras Principais
- Evite usar código no documento
- Não altera arquivos do projeto.
- Não inclua tópicos que não foram solicitados
- Use somente recursos: 
  - Markdown
  - Mermaid para diagramas de fluxo, se necessário
- Respeite o template
- Evite termos como Salvar, remover, criar, editar, etc.

### Tarefa
- Para cada termo encontrado:
  - Explique detalhadamente o que é, para o que serve e onde está sendo sendo utilizado.
    - Use explicação de mercado e negócios.
    - Use a explicação do projeto
  - Busque nas outras documentações da mesma pasta mais informações sobre esse termo.
  - Salve a documentação com o nome do diretório na pasta `root/docs/termos-negocio`.
  - Crie um arquivo unico para cada termo `nome-do-termo.md`

### Template do Resultado esperado:
```
## Nome do termo
## Visão Geral
[Descrição completa sobre o que significa o termo, sua importância e contexto de uso.]

### 1. Operação Principal
[Descrição detalhada do fluxo principal relacionado ao termo.]
\`\`\`mermaid
flowchart TD
    [preencher com a visão do fluxo]
\`\`\`
```