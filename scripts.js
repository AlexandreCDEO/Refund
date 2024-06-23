//Seleciona os elementos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const title = document.getElementById("title");
const category = document.getElementById("category");

// Seleciona os elementos da lista
const itensList = document.querySelector("ul");

const expensesNumber = document.getElementById("expensesNumber");

let expensesTotal = document.getElementById("expensesTotal")


// Captura o evento de input para formatar o valor.
amount.oninput = () => {

    // Obtem o valor atual do input e remove os caracteres não numéricos.
    let value = amount.value.replace(/\D/g, "");
    
    // Transformar o valor em centavos
    value = Number(value) / 100

    amount.value = formatCurrencyBRL(value);
}

function formatCurrencyBRL(value) {
    // Formata o valor no padrão BRL (Real Brasileiro)
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    // Retorna o valor formatado
    return value;
}

form.onsubmit = (event) => {
    event.preventDefault();

    const newExpense = {
        id: new Date().getTime(),
        title: title.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        create_at: new Date(),
    }

    expenseAdd(newExpense);
    
}

function expenseAdd(newExpense) {
    try {
        // Cria o elemento para adicionar na lista
        const expenseItem = document.createElement("li");
        expenseItem.classList.add("expense");
        const expenseIcon = document.createElement("img");
        expenseIcon.setAttribute("src", `assets/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute("alt", `ícone de ${newExpense.category_name}`);

        // Cria a info da despesa
        const expenseInfo = document.createElement("div");

        // Cria o título da despesa
        const expenseTitle = document.createElement("span");
        expenseTitle.textContent = newExpense.title
        
        // Cria a descrição da categoria da despesa
        const expenseCategory = document.createElement("span");
        expenseCategory.textContent = newExpense.category_name;

        // adiciona título e categoria na div das informações da despesa
        expenseInfo.append(expenseTitle, expenseCategory)

        const expenseinfoValue = document.createElement("div")
        expenseinfoValue.innerHTML = `<span><small>R$</small><strong class="expense-amount">${newExpense.amount.toUpperCase().replace("R$", "")}</strong></span>
                                      <img class="removeIcon" src="assets/remove.svg" alt="ícone para remover ítem da lista">`                              
                                        
        // Adiciona informaçções no item
        expenseItem.append(expenseIcon, expenseInfo, expenseinfoValue);

        // adiciona o item na lista
        itensList.append(expenseItem);

        // Atualiza os totais
        updateTotals();
        
        // Limpa formulário
        formClear();

    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas.");
        console.log(error);
    }
}

function updateTotals() {
    try {
        const itens = itensList.children
        expensesNumber.textContent = `${itens.length} ${itens.length > 1 ? "Despesas": "Despesa"}`

        let total = 0

        for(let item = 0; item < itens.length; item++) {
            const itemAmount = itens[item].querySelector(".expense-amount");
            let value = itemAmount.textContent.replace(/[^0-9.,]/g, "").replace(",",".");
            value = parseFloat(value);

            if(isNaN(value)){
                return alert("Não foi possível calcular o total. O valor não parece ser um número");
            }

            total += Number(value);
            console.log(total)
        }

        console.log(expensesTotal)
        expensesTotal.textContent = formatCurrencyBRL(total).toUpperCase().replace("R$","");

    } catch (error) {
        console.log(error);
        alert("Não foi possível atualizar os totais.")
    }
}

itensList.addEventListener("click", function(event){

    if(event.target.classList.contains("removeIcon")) {
        const item = event.target.closest(".expense");
        item.remove()
        updateTotals()
    }
})

function formClear() {
    amount.value = "";
    title.value = "";
    category.value = "";

    title.focus();
}



