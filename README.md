# 📍 Restaurantes do Brasil

Este é um aplicativo web interativo desenvolvido para ajudar usuários a descobrir e explorar restaurantes, bares e cafés em qualquer cidade do Brasil, utilizando dados abrangentes da Google Places API.

O projeto permite que os usuários busquem estabelecimentos por **cidade e estado**, visualizando os resultados diretamente em um mapa interativo. Ele oferece funcionalidades de **filtragem por tipo de estabelecimento** (Restaurante, Bar, Café), **avaliação mínima** e **nível de preço**, proporcionando uma experiência de busca personalizada.

Ao clicar em um marcador no mapa ou em um item da lista, um modal detalhado é exibido, contendo informações essenciais como:

  * Nome do estabelecimento
  * Endereço completo
  * Fotos (se disponíveis)
  * Classificação e total de avaliações
  * Nível de preço
  * Status de funcionamento (aberto/fechado agora)
  * Horários de funcionamento
  * Número de telefone e website (se disponíveis)
  * Avaliações de usuários
  * Tipos de culinária/estabelecimento

## ✨ Funcionalidades

  * **Busca por Localidade:** Encontre estabelecimentos em qualquer cidade e estado do Brasil.
  * **Visualização em Mapa:** Todos os resultados são exibidos em um mapa do Google Maps, com marcadores clicáveis.
  * **Filtros Dinâmicos:**
      * **Tipos de Estabelecimento:** Filtre por "Restaurante", "Bar" ou "Café".
      * **Avaliação Mínima:** Defina uma classificação mínima para os resultados.
      * **Nível de Preço:** Filtre por faixas de preço ($, $$, $$$, $$$$).
  * **Detalhes Abrangentes:** Acesse um modal com informações detalhadas sobre cada local.
  * **Galeria de Fotos:** Visualize fotos dos estabelecimentos.
  * **Design Responsivo:** Interface otimizada para desktop e dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

  * **Frontend:**
      * **Next.js:** Framework React para construção da interface de usuário, com renderização no lado do servidor (SSR) para melhor performance e SEO.
      * **React:** Biblioteca JavaScript para a construção de componentes de UI.
      * **Tailwind CSS:** Framework CSS utilitário para estilização rápida e responsiva.
  * **Backend (API Route):**
      * **Next.js API Routes:** Funciona como um *backend* sem servidor para interagir com a Google Places API.
      * **Node.js:** Ambiente de execução do JavaScript.
  * **APIs Externas:**
      * **Google Maps JavaScript API:** Para o mapa interativo.
      * **Google Places API:** Para geocodificação, busca de locais e obtenção de detalhes dos estabelecimentos.

## 🌐 Acesse o Projeto Deployed

Você pode explorar o aplicativo em funcionamento através do seguinte link:

[Clique aqui para acessar o site](https://restaurantes-brasil.vercel.app/)

## 🔒 Licença

Este projeto está sob a proteção de **Direitos Autorais Reservados**. Todos os direitos sobre o código-fonte, design, conteúdo e quaisquer outros elementos presentes neste repositório são de propriedade exclusiva de Larissa Benvenuti. A reprodução, distribuição, modificação, exibição pública ou uso comercial, total ou parcial, sem autorização expressa por escrito do(s) detentor(es) dos direitos, é estritamente proibida.
