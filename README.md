# ☕ Café Aroma - Site Institucional com Chatbot Inteligente

Este é o projeto de um site completo para a cafeteria fictícia "Café Aroma". O site é totalmente responsivo e foi desenvolvido com HTML, CSS e JavaScript puro. O principal destaque do projeto é um chatbot com inteligência artificial, capaz de extrair informações dinamicamente do conteúdo da página para responder às perguntas dos usuários de forma contextual.

_(Sugestão: tire um print da tela inicial do seu site, suba em um site como o [Imgur](https://imgur.com/) e substitua o link acima pela URL da sua imagem)_

---

## ✨ Funcionalidades Principais

O projeto conta com diversas funcionalidades para garantir uma experiência de usuário completa e moderna.

### Design e Navegação

- **Totalmente Responsivo:** Layout que se adapta perfeitamente a desktops, tablets e celulares.
- **Navegação Intuitiva:** Menu principal com dropdown no desktop e menu lateral (hambúrguer) em dispositivos móveis.
- **Scroll Suave:** Efeito de rolagem suave ao clicar nos links de navegação (implementado via CSS).

### Páginas

- **Página Inicial (`index.html`):**

  - **Seção "Sobre"**: Apresenta a cafeteria com um carrossel de imagens automático e interativo.
  - **Seção "Produtos"**: Exibe os principais produtos com um link para o cardápio completo.
  - **Seção "Localização"**: Mostra informações de contato e um mapa interativo do Google Maps.

- **Página de Cardápio (`menu.html`):**
  - **Listagem Completa:** Produtos organizados por categorias ("Bebidas Clássicas" e "Bebidas Especiais").
  - **Seção Informativa:** Detalhes sobre os diferentes tipos e qualidades de grãos de café.

### 🤖 Chatbot com Inteligência Artificial

O chatbot é a funcionalidade mais avançada do projeto, construído para ser um assistente virtual útil e dinâmico.

- **Base de Conhecimento Dinâmica:** Ao carregar a página, o script "lê" todo o conteúdo textual (produtos, descrições, seções) e cria uma base de dados interna. Isso significa que qualquer alteração no HTML é automaticamente refletida nas respostas do bot, sem precisar alterar o JavaScript.
- **Análise de Intenção:** O chatbot consegue diferenciar a intenção do usuário. Por exemplo:
  - Se o usuário pergunta **"o que é café duplo?"**, ele retorna apenas a descrição.
  - Se o usuário pergunta **"qual o valor do café duplo?"**, ele retorna apenas o preço.
- **Respostas Contextuais:**
  - Responde a perguntas sobre **produtos específicos** (ex: "fale sobre o Irish Coffee").
  - Responde a perguntas sobre **categorias inteiras** (ex: "quais são as bebidas especiais?"), listando todos os itens da categoria.
  - Fornece informações sobre **localização, contato e sobre a empresa**.
- **Interface Amigável:** Janela de chat moderna, com opção de fechar e encerrar a conversa.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Para a estruturação semântica do conteúdo.
- **CSS3:** Para estilização, layout (Flexbox e Grid), animações e responsividade (Media Queries).
- **JavaScript (ES6+):** Para toda a interatividade, manipulação do DOM e a lógica complexa do chatbot.

---

## 🚀 Como Executar o Projeto

Como o projeto utiliza apenas tecnologias front-end, não é necessário um servidor ou processo de build.

1.  Clone ou baixe este repositório.
2.  Abra a pasta do projeto no seu explorador de arquivos.
3.  Clique duas vezes no arquivo `index.html` para abri-lo no seu navegador padrão.

---

## 📂 Estrutura de Arquivos

```
cafeteria/
├── assets/
│   ├── img/          # Imagens de produtos, carrossel, etc.
│   └── logo2.png
├── index.html        # Página inicial
├── menu.html         # Página do cardápio
├── style.css         # Estilos principais e responsividade
├── menu.css          # Estilos específicos da página de cardápio
├── script.js         # Lógica de interatividade e do chatbot
└── README.md         # Este arquivo
```

---

## 👨‍💻 Autor

**Vander Luís**

_Projeto desenvolvido como parte de um portfólio de desenvolvimento web, demonstrando habilidades em front-end e lógica de programação com JavaScript._

---
