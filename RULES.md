# RULES

## Objetivo do projeto

Este projeto e um simulador 3D de camera para gerar um prompt textual com base em:

- azimute
- elevacao
- distancia

O foco do projeto e:

- visualizacao simples no navegador
- codigo modular
- responsabilidades pequenas
- testes automatizados em modulos previsiveis

## Stack e execucao

- O projeto roda no navegador sem bundler.
- O HTML de entrada e `index.html`.
- O JavaScript usa ES Modules.
- `three.js` e carregado por CDN no navegador.
- Em modulos internos, o acesso ao `THREE` deve passar por `src/vendor/three-context.js`.
- O projeto deve ser servido por HTTP. Nao abrir com `file://`.

Comandos atuais:

```bash
npm install
npx http-server .
npm test
npm run test:watch
npm run coverage
```

## Estrutura obrigatoria

### Entrada

- `index.html`: composicao da pagina
- `assets/styles/app.css`: estilos globais
- `src/main.js`: bootstrap da aplicacao

### Codigo-fonte

- `src/app`: orquestracao principal
- `src/animation`: animacoes e transicoes
- `src/config`: configuracoes estaticas
- `src/interaction`: mouse, touch, hover, drag
- `src/prompt`: geracao do prompt final
- `src/scene`: criacao e atualizacao da cena 3D
- `src/services`: integracoes com APIs do navegador
- `src/state`: regras e estado da aplicacao
- `src/ui`: controladores de interface
- `src/utils`: funcoes puras e reutilizaveis
- `src/vendor`: adaptadores para dependencias globais

### Testes

- `tests/` espelha a organizacao de `src/` sempre que fizer sentido.
- Arquivos de teste devem terminar com `.test.js`.
- `tests/setup.js` centraliza setup global do ambiente de testes.

## Regras de arquitetura

- Cada modulo deve ter responsabilidade estreita.
- Evitar arquivos monoliticos.
- Evitar misturar regras de negocio com DOM.
- Evitar misturar calculo matematico com bind de eventos.
- Evitar misturar construcao de cena com atualizacao de estado.
- `App` deve compor dependencias, nao concentrar regras detalhadas.
- Funcoes puras devem ficar em `utils`, `prompt` ou `state` quando possivel.
- Integracoes com navegador devem ficar em `ui` ou `services`.
- A cena 3D deve ser manipulada por modulos em `scene`.

## Regras de dependencia

- Nao acessar `globalThis.THREE` diretamente fora de `src/vendor/three-context.js`.
- Modulos devem depender de modulos menores sempre que possivel.
- Preferir injecao de dependencias em controladores.
- Evitar imports cruzados desnecessarios entre camadas.
- `app` pode depender das outras pastas.
- Pastas de baixo nivel nao devem depender de `app`.

## Regras de codigo

- Usar JavaScript ES Modules.
- Manter metodos curtos e com nome claro.
- Preferir nomes explicitos a abreviacoes.
- Evitar comentarios obvios.
- Manter ASCII por padrao.
- Preservar o estilo atual do projeto: classes pequenas, factories separadas, utilitarios isolados.
- Se um arquivo crescer demais ou misturar mais de uma decisao relevante, dividir.

## Regras para novas features

- Novas regras de prompt entram em `src/prompt` ou `src/state`.
- Novas interacoes entram em `src/interaction`.
- Novos elementos 3D entram em `src/scene/factories` ou `src/scene`.
- Novas configuracoes fixas entram em `src/config/app-config.js`.
- Se a feature adicionar comportamento testavel, o teste deve ser criado no mesmo ciclo.

## Regras de testes

- Toda funcao pura nova deve ter teste unitario.
- Toda regra de clamp, snap, normalizacao ou interpolacao deve ter teste.
- Todo controlador com fluxo proprio deve ter ao menos um teste comportamental.
- Testes devem priorizar comportamento observavel, nao implementacao interna.
- Mocks devem ser usados para browser APIs, DOM pesado e partes nao essenciais do `Three.js`.
- Coverage deve ser gerada com `npm run coverage`.

## Regras de Git

- `node_modules/` nao deve ser versionado.
- `coverage/` nao deve ser versionado.
- Artefatos temporarios nao devem entrar em commit.
- Antes de commitar, o ideal e rodar pelo menos:

```bash
npm test
```

## Regra de manutencao

- O projeto deve continuar simples de abrir, simples de servir e simples de testar.
- Qualquer refatoracao nova deve manter ou melhorar a separacao atual de responsabilidades.
