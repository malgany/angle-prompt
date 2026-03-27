# Angle Prompt

Simulador 3D para explorar angulo, elevacao e distancia de camera e gerar um prompt textual a partir da posicao escolhida.

## Requisitos

- Node.js 20+ recomendado
- npm 10+ recomendado

## Instalar dependencias

```bash
npm install
```

## Rodar o projeto

Como o projeto usa modulos ES no navegador, rode por um servidor HTTP simples em vez de abrir o `index.html` direto no `file://`.

Opcao 1, sem instalar nada no projeto:

```bash
npx http-server .
```

Depois abra no navegador o endereco mostrado no terminal, normalmente:

```text
http://127.0.0.1:8080
```

## Estrutura principal

```text
index.html
assets/styles/app.css
src/
  app/
  animation/
  config/
  interaction/
  prompt/
  scene/
  services/
  state/
  ui/
  utils/
  vendor/
tests/
```

## Rodar os testes

Executa a suite uma vez:

```bash
npm test
```

Executa em modo watch:

```bash
npm run test:watch
```

## Cobertura de testes

Gera o relatorio de coverage:

```bash
npm run coverage
```

O Vitest imprime o resumo no terminal e tambem gera o relatorio HTML em:

```text
coverage/index.html
```

## Scripts disponiveis

```bash
npm test
npm run test:watch
npm run coverage
```

## Observacoes

- O projeto carrega `three.js` por CDN no navegador.
- Os testes rodam com `Vitest` + `jsdom`.
- Se a porta padrao do servidor estiver ocupada, o `http-server` informa a alternativa no terminal.
