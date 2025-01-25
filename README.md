# Teste Vox Tecnologia

## Descrição do Projeto

Este projeto foi desenvolvido utilizando o **Angular 19**, explorando as novidades da versão, como as novas sintaxes (`@if`, `@for`) e aplicando boas práticas de clean code e organização de componentes. O objetivo foi criar uma aplicação funcional e com uma estrutura limpa e escalável, seguindo as diretrizes propostas.

---

## Funcionalidades Implementadas

### 1. **Novidades do Angular 19**

- Utilização das novas sintaxes `@if` e `@for` para melhorar a legibilidade do código.

### 2. **Estrutura de Telas**

- **Tela Home**: Página inicial com um layout funcional.
- **MenuNav (Header)**: Navegação integrada no topo.
- **Tela de Registro**: Funciona tanto para criação quanto para edição de registros (pré-preenchimento quando um ID é fornecido).

### 3. **Código Limpo**

- Componentes devidamente separados.
- Tipagem de interfaces para garantir maior segurança e previsibilidade no desenvolvimento.

### 4. **Máscaras**

- Adicionadas máscaras para **CPF** e **CEP**.

### 5. **Validações**

- Utilização do **ZOD** para validações simples e eficientes.

### 6. **Chamadas HTTP**

- Configuração do **Axios** para realizar as requisições ao backend.

### 7. **UUID**

- Implementação de UUID para geração de IDs randômicos, garantindo maior segurança.

---

## Melhorias Realizadas

- **UUID para IDs randômicos mais seguros**.
- **Máscaras** para **CPF** e **CEP**.
- **Validações** com **ZOD**.
- **Chamadas HTTP** com **Axios**.

- Sugestão de melhorias:
  - Alteração de algumas chamadas HTTP de **PATCH** para **PUT**, dependendo da necessidade de envio de dados (caso apenas um campo precise ser atualizado, o **PATCH** seria ideal).
  - Uso de bibliotecas modernas de UI para facilitar a implementação e melhorar a aparência visual da aplicação.

---

## Funcionalidades Não Implementadas

Conforme solicitado, o foco foi dado ao bom funcionamento dos elementos e à proximidade do layout proposto. Algumas funcionalidades e bibliotecas não foram incluídas para evitar poluição do código:

- **Rota PUT e DELETE**: Não implementadas, pois não foram solicitadas no escopo do projeto.
- **Bibliotecas Adicionais**: Algumas bibliotecas interessantes não foram utilizadas para manter o projeto limpo.
- **Campo número**: Não implementado, pois não foi especificado no escopo do projeto.

---

## Como Executar o Projeto

### Pré-requisitos

- Node.js 20
- Angular CLI 19

### Passos para executar

1. **Clone o repositório:**

   ```bash
   git clone
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Inicie o servidor:**

   ```bash
   npm run mock
   ```

   **Acesse a aplicação:**

   ```bash
   npm run start
   ```
