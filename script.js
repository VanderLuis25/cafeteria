document.addEventListener("DOMContentLoaded", () => {
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatWindow = document.getElementById("chat-window");
  const chatBody = document.getElementById("chat-body");
  const chatInput = document.getElementById("chat-input");
  const closeChatBtn = document.getElementById("close-chat");

  // --- Base de conhecimento e produtos ---
  const knowledgeBase = [];

  // --- Lógica do Carrinho de Compras ---
  let cart = [];
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartIcon = document.getElementById("cart-icon");
  const closeCartBtn = document.getElementById("close-cart");
  const checkoutBtn = document.getElementById("checkout-btn");
  const paymentSection = document.getElementById("payment-section");
  const paymentButtons = document.querySelectorAll(".payment-btn");
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  // --- Lógica do Menu Hambúrguer ---
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Fecha o menu ao clicar em um link (para mobile)
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Alterna a visibilidade da janela de chat
  chatbotToggle.addEventListener("click", () => {
    chatWindow.classList.toggle("open");
    // Se a janela estiver abrindo, garanta que o input esteja habilitado
    if (chatWindow.classList.contains("open")) {
      chatInput.disabled = false;
      // Remove o botão de encerrar, se existir, para iniciar uma nova conversa
      const existingEndButton = chatBody.querySelector(".end-chat-btn");
      if (existingEndButton) existingEndButton.remove();
    } else {
      // Se estiver fechando, limpa a conversa
      clearChat();
    }
  });

  // Fecha a janela de chat
  closeChatBtn.addEventListener("click", () => {
    chatWindow.classList.remove("open");
    // Limpa a conversa ao fechar pelo botão 'X'
    clearChat();
  });

  // --- Lógica do Dropdown do Menu ---
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const dropbtn = dropdown.querySelector(".dropbtn");
    const dropdownContent = dropdown.querySelector(".dropdown-content");

    dropbtn.addEventListener("click", (event) => {
      // Previne que o link seja seguido se for um dropdown na mesma página
      if (
        dropbtn.getAttribute("href") === "menu.html" &&
        window.location.pathname.includes("menu.html")
      ) {
        event.preventDefault();
      }
      dropdownContent.classList.toggle("show");
    });
  });

  // Fecha o dropdown se o usuário clicar fora dele
  window.addEventListener("click", (event) => {
    if (!event.target.matches(".dropbtn")) {
      document
        .querySelectorAll(".dropdown-content.show")
        .forEach((openDropdown) => {
          openDropdown.classList.remove("show");
        });
    }
  });

  // --- Lógica para extrair dados da página ---
  function buildKnowledgeBase() {
    // Limpa para evitar duplicação ao re-chamar
    knowledgeBase.length = 0;

    // Extrai informações de seções principais
    document.querySelectorAll("section[id]").forEach((section) => {
      const title =
        section.querySelector("h1, h2")?.innerText.trim() || section.id;
      const content = section.innerText.replace(/\s+/g, " ").trim(); // Limpa e normaliza o texto
      if (content) {
        knowledgeBase.push({
          source: title,
          content: content.toLowerCase(),
          originalContent: content,
        });
      }
    });

    // Adiciona informações de produtos individualmente para respostas mais precisas
    document.querySelectorAll(".produto-card").forEach((card) => {
      const name = card.querySelector("h3")?.innerText.trim();
      const description = card.querySelector("p")?.innerText.trim();
      const price = card.querySelector(".preco")?.innerText.trim();
      if (name) {
        knowledgeBase.push({
          type: "product",
          source: name,
          // Conteúdo para busca inclui tudo
          content: `${name} ${description} ${price}`.toLowerCase(),
          // Detalhes separados para respostas específicas
          details: {
            name: name,
            description: description,
            price: price,
          },
        });
      }
    });
  }

  // Envia a mensagem ao pressionar Enter
  chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const userInput = chatInput.value.trim();
      if (userInput) {
        addMessage(userInput, "user");
        chatInput.value = "";
        generateBotResponse(userInput);
      }
    }
  });

  // Adiciona uma mensagem à janela de chat
  function addMessage(text, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", sender);
    messageElement.textContent = text;
    chatBody.appendChild(messageElement);
    // Rola para a mensagem mais recente
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Gera uma resposta do bot com base na entrada do usuário
  function generateBotResponse(userInput) {
    const lowerCaseInput = userInput.toLowerCase();
    let botResponse;

    // Respostas baseadas em palavras-chave
    if (lowerCaseInput.includes("olá") || lowerCaseInput.includes("oi")) {
      botResponse = "Olá! Bem-vindo ao Café Aroma. Como posso te ajudar?";
    } else if (
      lowerCaseInput.includes("obrigado") ||
      lowerCaseInput.includes("tchau")
    ) {
      botResponse = "De nada! Se precisar de algo mais, estou à disposição.";
    } else if (
      lowerCaseInput.includes("horário") ||
      lowerCaseInput.includes("funciona") ||
      lowerCaseInput.includes("aberto")
    ) {
      botResponse = findBestMatch("horário de funcionamento");
    } else {
      // Se não for uma saudação/despedida, busca na base de conhecimento
      botResponse = findBestMatch(lowerCaseInput);
    }

    // Se a busca não encontrar nada, retorna uma mensagem padrão
    if (!botResponse) {
      botResponse =
        "Desculpe, não encontrei uma resposta para isso. Você pode perguntar sobre nosso cardápio, localização ou sobre nós.";
    }

    // Adiciona a resposta do bot após um pequeno atraso para simular "pensamento"
    setTimeout(() => {
      addMessage(botResponse, "bot");
      // Se for uma mensagem de despedida, oferece a opção de encerrar
      if (
        lowerCaseInput.includes("obrigado") ||
        lowerCaseInput.includes("tchau")
      ) {
        addEndChatOption();
      }
    }, 500);
  }

  // Nova função para buscar a melhor resposta na base de conhecimento
  function findBestMatch(userInput) {
    const userWords = userInput.split(" ").filter((word) => word.length > 2);
    let bestMatch = { score: 0, response: null };

    knowledgeBase.forEach((item) => {
      let score = 0;
      userWords.forEach((word) => {
        if (item.content.includes(word)) {
          score++; // Pontuação base por palavra encontrada
        }
      });

      if (userInput.includes(item.source.toLowerCase())) {
        score += 10;
      }

      if (score > bestMatch.score) {
        bestMatch = { score: score, response: item };
      }
    });

    // Se a melhor resposta for uma seção inteira (texto longo),
    // vamos extrair e listar os produtos dela.
    // FAZEMOS ISSO APENAS SE A PERGUNTA DO USUÁRIO FOR MAIS LONGA, SUGERINDO UMA PERGUNTA ABERTA.
    if (
      bestMatch.response &&
      bestMatch.response.length > 200 &&
      userInput.split(" ").length > 2
    ) {
      const sectionTitle = knowledgeBase.find(
        (item) => item.originalContent === bestMatch.response.originalContent
      )?.source;

      if (sectionTitle) {
        const productNames = knowledgeBase
          .filter(
            (item) =>
              item.originalContent.length < 200 && // Filtra apenas os produtos
              bestMatch.response.originalContent
                .toLowerCase()
                .includes(item.source.toLowerCase()) // Verifica se o produto pertence à seção
          )
          .map((prod) => prod.source);
        return `Na seção "${sectionTitle}", temos: ${productNames.join(
          ", "
        )}. Sobre qual deles você gostaria de saber mais?`;
      }
    }

    // Se a melhor resposta for um produto, formata a resposta com base na intenção
    if (bestMatch.response && bestMatch.response.type === "product") {
      const product = bestMatch.response.details;
      const askedForPrice =
        userInput.includes("preço") ||
        userInput.includes("valor") ||
        userInput.includes("custa");

      if (askedForPrice) {
        return `O ${product.name} custa ${product.price}.`;
      }

      // Resposta padrão para "o que é" ou apenas o nome do produto
      return `${product.name}: ${product.description}.`;
    }

    return bestMatch.response?.originalContent || null; // Retorna o conteúdo original para seções ou nulo
  }

  // Adiciona o botão para encerrar a conversa
  function addEndChatOption() {
    // Remove qualquer botão antigo para evitar duplicatas
    const existingButton = chatBody.querySelector(".end-chat-btn");
    if (existingButton) {
      existingButton.remove();
    }

    const endButton = document.createElement("button");
    endButton.textContent = "Encerrar Conversa";
    endButton.classList.add("end-chat-btn");
    endButton.onclick = endChat;
    chatBody.appendChild(endButton);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Finaliza a conversa
  function endChat() {
    addMessage("Atendimento encerrado. Obrigado!", "bot");
    chatInput.disabled = true;
    // Fecha a janela do chat após 2 segundos
    setTimeout(() => {
      chatWindow.classList.remove("open");
      clearChat();
    }, 2000);
  }
  // --- Funções do Carrinho de Compras ---
  checkoutBtn.addEventListener("click", () => {
    if (cart.length > 0) {
      checkoutBtn.classList.add("hidden");
      paymentSection.classList.remove("hidden");
    } else {
      alert("Seu carrinho está vazio!");
    }
  });

  paymentButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const method = e.target.dataset.method;
      simulatePaymentAndPrint(method);
    });
  });

  function simulatePaymentAndPrint(method) {
    // 1. Gera o conteúdo da nota
    // Busca o campo de nome do cliente que estiver visível no carrinho
    const customerNameInput = document.querySelector(
      "#cart-sidebar input[type='text']"
    );
    const customerName = customerNameInput.value.trim();
    const receiptContainer = document.getElementById("receipt-to-print");
    const orderNumber = Math.floor(Math.random() * 100000);

    let receiptHTML = `
      <div class="receipt-header">
        <img src="./assets/logo2.png" alt="Café Aroma" class="logo-print">
        <h2>Café Aroma</h2>
        <p>Rua do Café, 123 - Centro</p>
        <p>Pedido #${orderNumber}</p>
      </div>
      <div class="receipt-info">
        <p><strong>Data:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
        ${
          customerName ? `<p><strong>Cliente:</strong> ${customerName}</p>` : ""
        }
        <p><strong>Pagamento:</strong> ${method.toUpperCase()}</p>
      </div>
      <div class="receipt-items">
        <div class="receipt-item-header">
          <span>Produto</span>
          <span>Total</span>
        </div>
    `;
    let totalPrice = 0;
    cart.forEach((item) => {
      const itemPrice = parseFloat(
        item.price.replace("R$ ", "").replace(",", ".")
      );
      const itemTotal = itemPrice * item.quantity;
      totalPrice += itemTotal;
      receiptHTML += `
        <div class="receipt-item">
          <span>${item.quantity}x ${item.name}</span>
          <span class="item-price">R$ ${itemTotal
            .toFixed(2)
            .replace(".", ",")}</span>
        </div>
      `;
    });
    receiptHTML += `
      </div>
      <div class="receipt-total">
        <span>Total</span>
        <span class="total-price">R$ ${totalPrice
          .toFixed(2)
          .replace(".", ",")}</span>
      </div>
      <div class="receipt-footer">
        <p>Obrigado e volte sempre!</p>
      </div>
    `;
    receiptContainer.innerHTML = receiptHTML;

    // 2. Aciona a impressão
    window.print();

    // 3. Limpa e reseta o carrinho após a impressão
    cart = [];
    updateCartView();
    if (customerNameInput) customerNameInput.value = ""; // Limpa o nome do cliente
    toggleCart();
    checkoutBtn.classList.remove("hidden");
    paymentSection.classList.add("hidden");
  }

  function toggleCart() {
    cartSidebar.classList.toggle("open");
    cartOverlay.classList.toggle("open");
  }

  cartIcon.addEventListener("click", toggleCart);
  closeCartBtn.addEventListener("click", toggleCart);
  cartOverlay.addEventListener("click", toggleCart);

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(".produto-card");
      const id = e.target.dataset.id;
      const name = card.querySelector("h3").innerText;
      const price = card.querySelector(".preco").innerText;
      const imgSrc = card.querySelector(".produto-img img").src;

      addToCart({ id, name, price, imgSrc });
    });
  });

  function addToCart(product) {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    updateCartView();
  }

  function updateCartView() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotalPrice = document.getElementById("cart-total-price");

    cartItemsContainer.innerHTML = ""; // Limpa a visualização

    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
    } else {
      cart.forEach((item) => {
        const itemPrice =
          parseFloat(item.price.replace("R$ ", "").replace(",", ".")) *
          item.quantity;
        totalPrice += itemPrice;
        totalItems += item.quantity;

        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        cartItemElement.innerHTML = `
          <img src="${item.imgSrc}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <p>${item.price}</p>
            <div class="quantity-controls">
              <button class="quantity-btn" onclick="updateQuantity('${
                item.id
              }', ${item.quantity - 1})">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn" onclick="updateQuantity('${
                item.id
              }', ${item.quantity + 1})">+</button>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);
      });
    }

    cartCount.innerText = totalItems;
    cartTotalPrice.innerText = `R$ ${totalPrice.toFixed(2).replace(".", ",")}`;
  }

  // Tornar a função acessível globalmente para o onclick
  window.updateQuantity = (id, newQuantity) => {
    const productIndex = cart.findIndex((item) => item.id === id);

    if (productIndex > -1) {
      if (newQuantity <= 0) {
        // Remove o item se a quantidade for 0 ou menor
        cart.splice(productIndex, 1);
      } else {
        cart[productIndex].quantity = newQuantity;
      }
    }

    updateCartView();
  };

  // Limpa o corpo do chat, mantendo a mensagem inicial
  function clearChat() {
    chatBody.innerHTML =
      '<div class="chat-message bot">Olá! Como posso ajudar você hoje?</div>';
  }

  // Extrai os dados da página assim que ela carregar
  buildKnowledgeBase();
});
