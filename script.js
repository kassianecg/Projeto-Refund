// Seleciona os elementos do formulário.
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul");
const expenseQuantity = document.querySelector("aside header p span ")
const expenseTotal = document.querySelector("aside header h2")

// Adiciona um evento de input ao campo de valor para permitir apenas números.
amount.oninput = () => {
// Remove todos os caracteres que não são dígitos.
  let value = amount.value.replace(/\D/g, "")
// Transforma o valor em centavos (exemplo: 150/100 = 1.50 que é equivalente a R$1,50).
  value = Number(value) / 100
// Atualiza o valor do campo com apenas os dígitos.
  amount.value = formatCurrency(value)
}

function formatCurrency(value) {
  // formata o valor como moeda brasileira (R$).s
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
  // Retorna o valor formatado.
  return value
}

// Adiciona um evento de submit ao formulário para capturar os dados e evitar o comportamento padrão.
form.onsubmit = (event) => {
  // Previne o comportamento padrão do formulário (recarregar a página).
  event.preventDefault()

// Cria um novo objeto de despesa com os dados do formulário.
  const newExpense = {
    // Gera um ID único usando o timestamp atual.
    id: new Date().getTime(),
    // Captura o valor do campo de despesa.
    expense: expense.value,
    // Captura o ID da categoria selecionada.
    category_id: category.value,
    // Captura o nome da categoria selecionada.
    category_name: category.options[category.selectedIndex].text,
    // Captura o valor do campo de valor.
    amount: amount.value,
    // Captura a data e hora atual para o campo de criação.
    created_at: new Date(),
  }
  //console.log(newExpense)
  // Chama a função para adicionar a nova despesa à lista.
  expenseAdd(newExpense)
}

// Função para adicionar uma nova despesa à lista de despesas no DOM.
function expenseAdd(newExpense) {
  try {
    //throw new Error("Simulação de erro") // Simula um erro para testar o bloco catch.

    // Seleciona a lista de despesas no DOM. Certifique-se de que o seletor corresponda à estrutura do seu HTML. Aqui, estou assumindo que a lista de despesas é um elemento <ul> dentro do <aside>.
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o ícone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa (nome e valor)
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona nome e categoria na div das informações da despesa
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Cria o ícone de remoção
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "./img/remove.svg")
    removeIcon.setAttribute("alt", "remover")

    // Adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
    // Cria um elemento para o nome da despesa
    expenseList.append(expenseItem)

    // Limpa os campos do formulário após adicionar a despesa.
    formClear()

    // Atualiza os totais após adicionar a nova despesa.
    updateTotals()

    // Cria o conteúdo do item de despesa usando template literals.
  }catch (error){
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}

// Atualiza os totais
function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista (ul)
    const items = expenseList.children
    // Atualiza a quantidade de itens na lista
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // Variável para incrementar o total.
    let total = 0

    // Percorre cada item (li) da lista (ul)
    for(let item = 0; item < items.length; item ++){
      const itemAmount = items[item].querySelector(".expense-amount")
      // Remove os caracteres que não são dígitos ou vírgula, e substitui a vírgula por ponto para facilitar a conversão para número.
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
      // Converte o valor para número de ponto flutuante.
      value = parseFloat(value)

      // Verifica se é um  número válido
      if(isNaN(value)){
        return alert(
          "Não foi possível calcular o total. O valor não parecer ser um número."
        )
      }
      // Incrementa o valor total
      total += Number(value)
    }
    // Formata o total como moeda brasileira (R$).
    //expenseTotal.textContent = expenseTotal
    console.log(total)

    // Cria a span para adicionar o R$ formatado
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado.
    total = formatCurrency(total).toUpperCase().replace("R$", "")

    // Limpa o conteúdo do elemento
    expenseTotal.innerHTML = ""

    // Adiciona o símbolo de moeda e o total formatado ao elemento.
    expenseTotal.append(symbolBRL, total)

  } catch (error) {
    console.log(error)
    alert("Não foi possível calcular o total. Ocorreu um erro inesperado.")
    // alert("Não foi possível atualizar os totais.")
  }
}

// Evento que captura o clique no ícone de remoção usando delegação de eventos.
expenseList.addEventListener("click", function(event){
  // Verifica se o elemento clicado é o ícone de remoção e, se for, remove a despesa correspondente da lista.
  if (event.target.classList.contains("remove-icon")){
    //console.log(event)
    // Encontra o elemento pai mais próximo com a classe "expense" (o item da despesa) e o remove do DOM.
    const item = event.target.closest(".expense")
    //console.log(item)
    item.remove()
  }
  // Atualiza os totais após remover a despesa.
  updateTotals()
})

function formClear() {
  // Limpa os campos do formulário.
  expense.value = ""
  category.value = ""
  amount.value = ""

  // Define o foco de volta para o campo de despesa para facilitar a adição de múltiplas despesas.
  expense.focus()
}