# Mutation Testing com Stryker

[![Testes e Mutation Testing](https://github.com/minattinho/mutation-test-stryker/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/minattinho/mutation-test-stryker/actions/workflows/ci.yml)
![Mutation score](https://img.shields.io/badge/mutation%20score-100%25-brightgreen)

Aplicação da técnica de **mutation testing** com o [Stryker Mutator](https://stryker-mutator.io/) sobre o
primeiro trabalho de testes unitários da disciplina ([minattinho/unit-test-jest](https://github.com/minattinho/unit-test-jest)).

O código de `src/` e a suíte de `test/` partiram exatamente daquele repositório. Aqui o Stryker foi usado
para **medir a qualidade dos testes** e, a partir dos mutantes sobreviventes, os testes foram reforçados.

## Resultado

| Métrica | Antes (trabalho 1) | Depois |
| --- | ---: | ---: |
| Testes | 69 | **87** |
| Cobertura de linhas (Jest) | 100% | 100% |
| Mutantes mortos | 462 | **497** |
| Mutantes sobreviventes | 35 | **0** |
| Mutantes sem cobertura | 4 | **0** |
| **Mutation score** | **92,22%** | **100%** |

A principal lição: **100% de cobertura de linhas não garante testes bons**. A suíte original executava todas as
linhas, mas 39 mudanças no código passavam despercebidas — os testes "passavam por ali" sem verificar o
comportamento.

Por arquivo, antes → depois:

| Arquivo | Antes | Depois |
| --- | ---: | ---: |
| `anagram.js` | 84,62% | 100% |
| `banco.js` | 96,08% | 100% |
| `calculator.js` | 100% | 100% |
| `carro.js` | 90,00% | 100% |
| `cnh.js` | 100% | 100% |
| `contaBancaria.js` | 85,51% | 100% |
| `lista.js` | 100% | 100% |
| `pescaria.js` | 97,83% | 100% |
| `pessoa.js` | 100% | 100% |
| `textoUtils.js` | 94,74% | 100% |
| `userService.js` | 100% | 100% |
| `utilitarios.js` | 90,24% | 100% |

O relatório HTML completo está em [`docs/mutation-report.html`](docs/mutation-report.html) (baixe e abra no
navegador) e também é gerado como artefato em cada execução da CI.

## O que é mutation testing

O Stryker altera o código-fonte em pequenos pontos — cada alteração é um **mutante** — e roda os testes contra
cada versão alterada:

- se algum teste **falha**, o mutante foi **morto** (o teste percebeu a mudança) ✅
- se todos os testes **passam**, o mutante **sobreviveu** (existe um comportamento que nenhum teste verifica) ❌

Exemplos de mutações: trocar `>` por `>=`, `&&` por `||`, `true` por `false`, remover um `if`, esvaziar uma
string, trocar `toLowerCase()` por `toUpperCase()`.

```
mutation score = mutantes mortos / (mutantes totais - ignorados)
```

## Como executar

Requisitos: Node.js 20+ e npm 10+.

```bash
npm ci                         # instala as dependências
npm test                       # roda os testes unitários (Jest)
npm run coverage               # testes + relatório de cobertura
npm run mutation               # roda o Stryker (mutation testing)
npm run mutation:incremental   # reaproveita resultados da execução anterior
```

O relatório é gerado em `reports/mutation/mutation.html` (HTML navegável) e `reports/mutation/mutation.json`.

## Configuração

[`stryker.config.mjs`](stryker.config.mjs):

```js
{
  testRunner: "jest",
  coverageAnalysis: "perTest",          // cada mutante roda só os testes que passam por ele
  mutate: ["src/**/*.js"],              // só o código de produção é mutado
  reporters: ["clear-text", "progress", "html", "json"],
  thresholds: { high: 90, low: 80, break: 85 },
}
```

`thresholds.break` funciona como quality gate: se o mutation score cair abaixo de 85%, `npm run mutation`
termina com erro e a CI falha.

## Mutantes sobreviventes e como foram mortos

### 1. Valores de limite (boundary) não testados

O mutante mais comum: trocar `>` por `>=` (ou `<` por `<=`) e nenhum teste usar exatamente o valor do limite.

| Arquivo | Código | Mutante | Teste adicionado |
| --- | --- | --- | --- |
| `contaBancaria.js` | `valor > saldoDisponivel` | `>=` | sacar exatamente o saldo disponível (150) |
| `contaBancaria.js` | `valor <= saldoDisponivel` | `<` | `podeSacar(150)` deve ser `true` |
| `contaBancaria.js` | `valor > 0` | `>= 0` | `podeSacar(0)` deve ser `false` |
| `contaBancaria.js` | `novoLimite < 0` | `<= 0` | `ajustarLimite(0)` deve ser aceito |
| `contaBancaria.js` | `saldo < 0` | `<= 0` | conta com saldo 0 não é negativa |
| `contaBancaria.js` | `limite < 0` | `<= 0` | conta com limite 0 é válida |
| `banco.js` | `valor > this.saldo` | `>=` | sacar exatamente o saldo da conta |
| `textoUtils.js` | `tamanho < 0` | `<= 0` | `truncar("abc", 0)` retorna `"..."` |
| `pescaria.js` | `p.peso > maior.peso` | `>=` | empate de peso mantém o primeiro peixe |
| `pescaria.js` | `p.peso < menor.peso` | `<=` | empate de peso mantém o primeiro peixe |

### 2. Ramos de validação sem teste

- **`contaBancaria.validarConta()`** — só existiam testes para "sem id" e "status inválido". Os casos sem
  titular, saldo não numérico e limite negativo (4 mutantes **sem cobertura**) e os status válidos
  `"bloqueada"`/`"encerrada"` (mutantes que esvaziavam as strings) não tinham teste.
- **`contaBancaria.estaAtiva()`** — só testado com conta ativa; o mutante `return true` sobrevivia.
- **`contaBancaria.saldoNegativo()`** — só testado com saldo negativo; `return true` sobrevivia.
- **`contaBancaria.transferir()`** — as duas guardas (`podeSacar` e o retorno do `sacar`) eram redundantes entre
  si, então remover qualquer uma não quebrava teste. Foram testadas isoladamente com `jest.spyOn`.
- **`utilitarios.ehNumero()`** — `ehNumero("10")` deve ser `false` (sem esse teste, remover o `typeof` passava).
- **`utilitarios.ehPalindromo()`** — só havia teste com palíndromo; qualquer mutante que fizesse a função
  sempre retornar `true` sobrevivia. Adicionado um caso negativo.

### 3. Assertions fracas

- **`banco.js`** — os testes usavam `toContainEqual` no histórico, então iniciar `transacoes` com um item
  estranho (`["Stryker was here"]`) não quebrava nada. Adicionado teste com `toEqual([])` no histórico inicial.
- **`utilitarios.gerarNumeroAleatorio()`** — o teste só verificava `0 <= n < 10`. Com `Math.random() / max` o
  resultado é sempre 0, que está no intervalo. O teste agora fixa `Math.random` com `jest.spyOn` e verifica o
  valor exato.
- **`textoUtils.paraSlug()`** — trocar `/\s+/g` por `/\s/g` só aparece com vários espaços seguidos.

### 4. Código redundante revelado pelo Stryker

Dois casos em que o mutante sobrevivia porque o código fazia algo desnecessário. Em vez de ignorar o mutante,
o código foi simplificado mantendo o mesmo comportamento:

- **`textoUtils.contarPalavras()`** — `trim()` e o `+` do regex eram redundantes com o `.filter(Boolean)`.
  Reescrito sem o `filter`, os mutantes passaram a ser mortos pelos testes.
- **`carro.dirigir()`** — `if (distancia > 0)` vs `>= 0` não faz diferença (somar 0 não muda nada). Reescrito
  como `Math.max(distancia, 0)`, que expressa a regra direto.

### 5. Mutantes equivalentes (ignorados)

Mutante equivalente é aquele que muda o código mas **não muda o comportamento** — nenhum teste consegue
matá-lo. Os 3 casos foram marcados com comentário do Stryker e o motivo, para não poluir o score:

| Arquivo | Mutante | Por que é equivalente |
| --- | --- | --- |
| `anagram.js` | `toLowerCase()` → `toUpperCase()` | as duas strings são normalizadas do mesmo jeito antes de comparar |
| `anagram.js` | `join("")` → `join("Stryker was here!")` | as duas strings usam o mesmo separador antes de comparar |
| `utilitarios.js` | `toLowerCase()` → `toUpperCase()` | para checar palíndromo só importa a caixa ser uniforme |

```js
// Stryker disable next-line MethodExpression: mutante equivalente (ver comentário acima)
const normalizado = somenteCaracteres.toLowerCase();
```

Em `anagram.js` a expressão foi quebrada em variáveis para que o comentário ignore **só** o mutante equivalente,
sem esconder os outros mutantes da mesma linha (como a remoção do `.sort()`, que é matável).

## Estrutura

```
src/                         código de produção (alvo das mutações)
test/                        suítes Jest, uma por módulo
stryker.config.mjs           configuração do Stryker
docs/mutation-report.html    relatório HTML da última execução
.github/workflows/ci.yml     CI: testes + mutation testing
```

## CI

O workflow [`ci.yml`](.github/workflows/ci.yml) roda em push/PR na `main`:

1. **Testes unitários** — `npm run coverage`
2. **Mutation testing** — `npm run mutation` (falha se o score < 85%) e publica o relatório HTML como artefato

## Licença

[MIT](LICENSE).
