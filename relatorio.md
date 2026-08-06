# Relatório Técnico – Sistema de Gestão de Clientes

## 1. Introdução

Neste trabalho foi desenvolvida a interface de um Sistema de Gestão de Clientes utilizando apenas **HTML5** e **CSS3**. O objetivo foi criar uma página organizada, responsiva e de fácil utilização, aplicando os conceitos de HTML semântico e boas práticas de CSS estudados durante a disciplina.

Além da aparência do sistema, também foi dada atenção à organização do código e à acessibilidade, permitindo que a página seja utilizada em diferentes dispositivos e por diferentes tipos de usuários.

---

## 2. Utilização das Tags Semânticas

Durante o desenvolvimento da interface procurei utilizar as principais tags semânticas do HTML5 para deixar o código mais organizado e facilitar sua compreensão.

### `<header>`

A tag `<header>` foi utilizada para representar o cabeçalho da página. Nela estão o nome do sistema e os elementos principais que aparecem no topo da interface.

### `<nav>`

A navegação do sistema foi construída utilizando a tag `<nav>`, onde ficam os links para as principais áreas do sistema, como **Dashboard**, **Clientes**, **Relatórios**, **Configurações** e **Ajuda**.

### `<main>`

Todo o conteúdo principal da página foi colocado dentro da tag `<main>`, separando-o das demais partes da interface.

### `<section>`

As principais áreas da página foram divididas em seções utilizando `<section>`, como a área de cadastro e a área de visualização dos clientes.

Essa divisão torna o código mais organizado e facilita futuras alterações.

### `<article>`

Os blocos internos, como os cartões de informações e os painéis da página, foram organizados utilizando `<article>`, já que representam conteúdos independentes dentro da interface.

### `<aside>`

Foi utilizado um `<aside>` para apresentar informações complementares, como avisos, resumo do sistema e últimos cadastros.

### `<footer>`

No rodapé foi utilizada a tag `<footer>`, contendo informações como nome do sistema, direitos autorais e versão.

### `<form>`

O cadastro dos clientes foi desenvolvido utilizando a tag `<form>`, responsável por agrupar todos os campos de entrada de dados.

### `<fieldset>` e `<legend>`

Os campos do formulário foram separados em grupos utilizando `<fieldset>` e identificados por meio da tag `<legend>`, facilitando a organização visual e a leitura do formulário.

### `<table>`

Os clientes cadastrados são exibidos em uma tabela utilizando `<table>`, juntamente com as tags `<thead>`, `<tbody>` e `<tfoot>`, deixando a estrutura mais organizada.

---

## 3. Responsividade

Para que o sistema pudesse ser utilizado tanto em computadores quanto em celulares, foram utilizadas **Media Queries**.

Foram definidos diferentes pontos de adaptação para telas pequenas, médias e grandes.

Quando a página é aberta em dispositivos móveis, o formulário passa a ocupar apenas uma coluna, os elementos ficam empilhados e a tabela pode ser rolada horizontalmente, evitando que as informações fiquem cortadas.

Essa adaptação melhora bastante a experiência do usuário.

---

## 4. Utilização de Flexbox e CSS Grid

Durante o desenvolvimento foram utilizados dois recursos importantes do CSS.

### Flexbox

O Flexbox foi utilizado principalmente para organizar elementos em uma única direção, como:

- Cabeçalho;
- Menu de navegação;
- Botões;
- Rodapé.

Essa técnica facilita o alinhamento e a distribuição dos elementos na tela.

### CSS Grid

O CSS Grid foi utilizado para organizar áreas maiores da página, principalmente o conteúdo principal e os campos do formulário.

Com ele foi possível criar um layout mais organizado e fácil de adaptar para diferentes tamanhos de tela.

---

## 5. Acessibilidade

Também foram aplicadas algumas práticas básicas de acessibilidade.

Entre elas estão:

- Definição do idioma da página utilizando `lang="pt-BR"`;
- Utilização da meta viewport para dispositivos móveis;
- Associação de todos os campos aos seus respectivos `<label>`;
- Utilização correta da hierarquia de títulos;
- Contraste adequado entre texto e fundo;
- Destaque visual quando um campo recebe foco.

Essas práticas tornam a página mais fácil de utilizar tanto para pessoas quanto para tecnologias assistivas.

---

## 6. Boas Práticas de CSS

O arquivo CSS foi organizado em diferentes seções para facilitar sua manutenção.

Foram utilizadas variáveis CSS para definir cores, fontes e espaçamentos, evitando repetição de código.

Também foram criadas classes reutilizáveis para botões, campos de formulário e cartões, deixando o código mais limpo e organizado.

Além disso, foram adicionadas pequenas animações e efeitos de transição para melhorar a aparência da interface sem prejudicar o desempenho.

---

## 7. Organização do Projeto

O projeto foi dividido em arquivos separados, facilitando sua organização.

- **index.html** — estrutura da página utilizando HTML semântico;
- **style.css** — responsável pela estilização da interface;
- **README.md** — contém informações sobre o projeto;
- **relatorio.md** — documento que explica as decisões tomadas durante o desenvolvimento.

Essa separação facilita futuras alterações e segue uma boa prática bastante utilizada no desenvolvimento web.

---

## 8. Conclusão

O desenvolvimento deste projeto permitiu aplicar na prática os conceitos estudados sobre HTML5, CSS3, semântica, responsividade e organização de código.

A utilização das tags semânticas tornou a estrutura da página mais clara e organizada, enquanto o uso de **Flexbox**, **CSS Grid** e **Media Queries** possibilitou a criação de uma interface adaptável para diferentes dispositivos.

Mesmo sendo apenas uma interface estática, o projeto foi desenvolvido pensando em uma futura integração com JavaScript e um banco de dados, podendo servir como base para um sistema de gestão completo.

---

*Relatório desenvolvido como parte da disciplina de Desenvolvimento Web – agosto de 2026.*