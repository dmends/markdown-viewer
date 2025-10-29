### Contexto
Você está executando uma modernização de uma aplicação e deseja garantir que suas documentações estejam claras. 
Para isso, você irá validar a documentação com o código existente para ajustar ou atualizar informações relevantes ou ausentes.

### Objetivo
- Leia a documentação: `[root/docs/pasta/nome-do-modulo.md]`
- Compare com o código nesse módulo `[pasta/nome-do-modulo]`

### Regras Principais
- Evite usar código no documento
- Não altera arquivos do projeto.
- Não inclua tópicos que não foram solicitados

### Tarefas
- Confira se o "diagrama de sequencia" esta alinhado com o código
  - [ ] O "diagrama de sequencia" deve ter todos os passos do fluxo representados
  - [ ] O "diagrama de sequencia" deve ter todos os fluxos de entrada representados
  - [ ] O "diagrama de sequencia" deve ter todos os itens de entrada do swagger
  - [ ] Verifique se as siglas usadas no diagrama estão presentes no glossário
- Separe cada fluxo/endpoint, dentro do bloco alt
- Execute as correções necessárias na documentação