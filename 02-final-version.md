# CSI606-2025-01 - Trabalho Final - Resultados

**Discente:** Nicolas de Oliveira Gomes

### Resumo

O projeto "PitStop" é um sistema web desenvolvido para facilitar a gestão e o controle financeiro de manutenções de veículos. Ele permite aos usuários cadastrar automóveis e registrar um histórico detalhado de revisões, incluindo os custos associados a cada serviço. A aplicação conta com uma interface moderna e intuitiva, oferecendo um dashboard analítico com gráficos interativos e relatórios dinâmicos. O sistema foi construído utilizando React no frontend e Node.js com SQLite no backend, integrando regras de negócio fluidas e armazenamento de dados eficiente.

### 1. Funcionalidades implementadas

* **Gestão de Veículos (CRUD):** Cadastro, listagem e exclusão de veículos contendo modelo, ano, placa e quilometragem.
* **Gestão de Revisões (CRUD):** Registro, edição, exclusão e listagem do histórico de revisões (tipo, data, valor e descrição) associadas a um veículo específico.
* **Filtro e Busca:** Barra de pesquisa instantânea para filtrar a lista de veículos pelo modelo ou pela placa.
* **Validação de Dados:** Validações em formulários no frontend e tratamento de requisições no backend.
* **Interface Responsiva:** Design responsivo e temático, otimizado para navegadores desktop.

### 2. Funcionalidades previstas e não implementadas

* **Alertas para Revisões Futuras:** A proposta original previa o controle de revisões "futuras". Embora o sistema permita o cadastro de datas posteriores ao dia atual, não foi implementado um sistema proativo de alertas, notificações ou calendário dinâmico para avisar o usuário sobre a proximidade dessas revisões.

### 3. Outras funcionalidades implementadas

* **Dashboard Analítico (Business Intelligence):** Painel interativo exibindo métricas gerais do sistema (total de veículos cadastrados, total de manutenções e a movimentação financeira total).
* **Gráficos Interativos:** Implementação da biblioteca *Recharts* para gerar um gráfico de barras que contabiliza e exibe visualmente os tipos de serviços automotivos mais realizados.
* **Gestão Financeira e Totalizadores:** Inclusão do campo de custos ("Valor R$") nas manutenções, com o sistema calculando e formatando automaticamente o custo total gasto por cada veículo.
* **Relatório Dinâmico com Ordenação:** Tela dedicada de relatório de veículos, contendo uma tabela que realiza cruzamento de dados do banco (JOIN) para exibir a quantidade de revisões por carro e permitindo ordenação instantânea por diversos critérios (ordem alfabética, ano, quilometragem e número de revisões).

### 4. Principais desafios e dificuldades

* **Evolução do Esquema do Banco de Dados:** Durante o desenvolvimento, surgiu a necessidade de adicionar a funcionalidade financeira (custos). O desafio foi adaptar as tabelas do SQLite já criadas e reestruturar as consultas no backend (utilizando comandos como `LEFT JOIN` e `GROUP BY`) para enviar dados totalizados ao frontend sem perder o desempenho.
* **Sincronização de Estado no React:** Garantir que ações como excluir ou editar uma revisão atualizassem imediatamente o "Custo Total" exibido na tela e o Histórico de Serviços sem a necessidade de recarregar a página da web, exigindo um bom controle dos *Hooks* (`useState` e `useEffect`).
* **Estilização e Imersão Visual:** Implementar uma imagem de fundo temática (oficina) via CSS (`::before`) exigiu a aplicação cuidadosa de filtros (`brightness` e `blur`) e contraste de cores para garantir que a acessibilidade e a legibilidade dos formulários e textos não fossem comprometidas.

### 5. Instruções para instalação e execução

**Pré-requisitos:** É necessário possuir o ambiente [Node.js](https://nodejs.org/) instalado na máquina.

**Passo 1: Iniciando o Backend (Servidor e Banco de Dados)**
1. Abra um terminal e navegue até a pasta do backend: `cd backend`
2. Instale as dependências do projeto: `npm install`
3. Inicie o servidor: `npm run dev`
*(O servidor rodará na porta 3001 e o arquivo `database.db` do SQLite será criado automaticamente).*

**Passo 2: Iniciando o Frontend (Interface)**
1. Abra um novo terminal e navegue até a pasta do frontend: `cd frontend`
2. Instale as dependências (incluindo React Router e Recharts): `npm install`
3. Inicie a aplicação web: `npm run dev`
*(O Vite iniciará o projeto, que poderá ser acessado pelo navegador através do link `http://localhost:5173`).*

### 6. Referências

* W3C. HTML & CSS Standards. Disponível em: https://www.w3.org
* React Documentation. Disponível em: https://react.dev
* Recharts - A composable charting library built on React components. Disponível em: https://recharts.org
* Express Node.js web application framework. Disponível em: https://expressjs.com
* SQLite Documentation. Disponível em: https://sqlite.org/docs.html
