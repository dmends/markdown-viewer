### Contexto
Você está executando uma modernização de uma aplicação e deseja garantir que suas documentações estejam claras. 
Para isso, você irá documentar o código existente para extrair informações relevantes.

### Objetivo
- Gere uma documentação clara para este módulo `[cartões/nome-do-modulo]`

### Regras Principais
- Evite usar código no documento
- Não altera arquivos do projeto.
- Não inclua tópicos que não foram solicitados
- Salve a documentação com o nome do diretório na pasta `root/docs/cartões`.
- Crie um arquivo unico para o módulo
- Tente Obter o Swagger
- Use somente recursos: 
  - Markdown
  - Mermaid
- Respeite o template

### Template do Resultado esperado:
```

# NOME-DO-MODULO

## Visão Geral
### Propósito
Descreva o objetivo principal do **módulo**, papel desse módulo no ecossistema e o valor que entrega em detalhes.

### Características Técnicas
- [Liste todas as carecteristicas relevantes, integrações, segurança etc]

### Tecnologias Utilizadas
- [Liste das tecnologias principais]

## Arquitetura
### Visão Arquitetural
Descreva a separação de camadas (entrada, domínio, saída), padrões adotados e principais integrações em detalhes.

### Componentes
- **Controller**: expõe endpoints REST
- **Service**: orquestra regras de negócio, integrações e persistência
- **FeignClient/Integrador**: integra com sistemas externos
- **Publisher/Consumer**: publica/consome eventos em filas SQS/SNS
- **Repository**: persistência de dados

### Diagrama C4 de Contexto
\`\`\`mermaid
C4Context
    title Diagrama de Contexto - Sistema de Biblioteca Online
    Person(leitor, "Leitor", "Usuário que busca e empresta livros.")
    System_Boundary(b1, "Sistema de Biblioteca Online") {
        System(catalogo, "Catálogo Digital", "Gerencia o catálogo de livros")
        System(emprestimo, "Sistema de Empréstimo", "Controla empréstimos")
        System(notificacao, "Serviço de Notificações", "Envia alertas e lembretes")
    }

    Rel(leitor, catalogo, "Consulta livros disponíveis")
    Rel(leitor, emprestimo, "Solicita empréstimo de livros")
    Rel(emprestimo, notificacao, "Envia alertas de devolução")
    Rel(catalogo, emprestimo, "Atualiza disponibilidade")
\`\`\`

### Diagrama de Sequência
\`\`\`mermaid
sequenceDiagram
    [preencher com a visão completa de todos os fluxos]
    [O "diagrama de sequencia" deve ter todos os passos do fluxo representados]
    [Separe cada fluxo/endpoint, dentro do bloco alt]
\`\`\`

## Fluxos de Processo
### Regras de Negócio

### 1. Operação Principal
[Descrição detalhada do fluxo principal (ex: criação de recurso, processamento, etc)]
\`\`\`mermaid
flowchart TD
    [preencher com a visão do fluxo]
\`\`\`

### 2. Outro Fluxo identificdo
[Descrição detalhada: Atualização, consulta, cancelamento, etc.]
\`\`\`mermaid
flowchart TD
    [preencher com a visão do fluxo]
\`\`\`

### Casos de Borda
1. Autenticação inválida: bloqueia operação e retorna erro
[Descrição detalhada]
\`\`\`mermaid
flowchart TD
    [preencher com a visão do fluxo]
\`\`\`

2. Recurso não encontrado: retorna erro específico
[Descrição detalhada]
\`\`\`mermaid
flowchart TD
    [preencher com a visão do fluxo]
\`\`\`

3. Recurso já processado: bloqueia operação
[Descrição detalhada]
\`\`\`mermaid
flowchart TD
    [preencher com a visão do fluxo]
\`\`\`

## Swagger API
\`\`\`swagger
    [o bloco de código é swagger, somente json]
    [preencher json se for possivel obter]
\`\`\`

## Variáveis de Ambiente
| Variável               | Descrição                                              |
|------------------------|--------------------------------------------------------|
| ...                    | ...                                                    |

## Glossário
| Termo              | Descrição                                                        |
|--------------------|------------------------------------------------------------------|
| ...                | ...                                                              |

---
Versão do documento: [preencher] 
Data: [preencher]   
Versão do módulo: [preencher] 

```