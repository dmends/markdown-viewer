### Contexto
Você precisa buscar incidentes em suas ferramentas (Jira, Elastic, Splunk, ServiceNow) a partir de um texto descritivo. Para isso, quer extrair termos de busca curtos e relevantes, incluindo variações com e sem acentos e sinônimos, e retornar somente um JSON com esses termos.

### Objetivo
- Ler o texto do incidente fornecido
- Extrair um conjunto de termos de busca curtos (palavras e pequenas combinações) organizados por relevância
- Retornar somente um JSON válido no formato especificado

### Regras Principais
- Não explicar nada; retorne apenas JSON válido
- Formato exato da saída: {"termos": ["termo 1", "termo 2", "..."]}
- Sem duplicatas
- Máximo de 30 termos
- Ordenar por relevância
- Incluir variações com e sem acento quando fizer sentido (ex.: régua/regua; cartão/cartao)
- Incluir sinônimos e termos relacionados ao processo, canal, produto, meio de pagamento, artefato e erro

### Tarefas
- Identificar termos do processo de cobrança
  - [ ] "régua de retentativa" e variações (ex.: régua de cobrança, workflow de cobrança, dunning)
- Identificar canal/meio de comunicação
  - [ ] email, e-mail, template de email, comunicação por email
- Identificar produto e contexto
  - [ ] Consórcio, produto Consórcio
- Identificar meio de pagamento e artefatos
  - [ ] PIX, QR do PIX, QR Code PIX, copia e cola PIX
- Identificar campo/caso problemático
  - [ ] "número da parcela", nº da parcela, parcela
- Identificar descrição do erro
  - [ ] fixo em 1, valor fixo 1, sempre 1, parcela incorreta, variável não substituída, placeholder de parcela
- Remover duplicatas e ordenar por relevância
- Gerar somente o JSON final no formato exigido

### Entrada
"""
Na regua de retentativa do cartão para o produto Consórcio, a comunicação via email encaminhada ao cliente com o QR do PIX esta apresentando a informação "numero da parcela" de forma fixa com o valor 1 mesmo sendo uma parcela de numero diferente.
"""

### Saída esperada
{
  "termos": [
    "régua de retentativa",
    "retentativa do cartão",
    "Consórcio",
    "email",
    "template de email",
    "PIX",
    "QR do PIX",
    "QR Code PIX",
    "número da parcela",
    "parcela incorreta",
    "fixo em 1",
    "valor fixo 1",
    "sempre 1",
    "variável não substituída",
    "placeholder parcela",
    "régua de cobrança",
    "workflow de cobrança",
    "dunning",
    "comunicação por email",
    "produto Consórcio",
    "copia e cola PIX",
    "nº da parcela",
    "cartão",
    "cartao",
    "regua de retentativa",
    "numero da parcela",
    "QR com parcela errada",
    "PIX com parcela errada",
    "incidente",
    "erro"
  ]
}