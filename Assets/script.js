document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expenseForm');
    const expenseList = document.getElementById('expenseList');

    // Load expenses from local storage
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Display existing expenses
    displayExpenses();

    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;

        if (description && !isNaN(amount) && category) {
            addExpense(description, amount, category);
            expenseForm.reset();
        } else {
            alert('Please fill in all fields correctly.');
        }
    });

    function addExpense(description, amount, category) {
        const expense = {
            description,
            amount,
            category
        };

        expenses.push(expense);
        saveExpenses();
        displayExpenses();
    }

    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function displayExpenses() {
        expenseList.innerHTML = '';

        let totalAmountSpent = 0; // Initialize total amount spent

        expenses.forEach(function (expense, index) {
            const expenseItem = document.createElement('div');
            expenseItem.classList.add('expense-item');
            expenseItem.innerHTML = `
                <p><strong>Description:</strong> ${expense.description}</p>
                <p><strong>Amount:</strong> $${expense.amount.toFixed(2)}</p>
                <p><strong>Category:</strong> ${expense.category}</p>
                <button class="delete-btn" data-id="${index}">Delete</button> <!-- Add delete button here -->
            `;
            expenseList.appendChild(expenseItem);
            
            // Update total amount spent
            totalAmountSpent += expense.amount;
        });

        // Update the content of the totalAmount element
        const totalAmountElement = document.getElementById('totalAmount');
        totalAmountElement.textContent = `Total Amount Spent: $${totalAmountSpent.toFixed(2)}`;


        // Highlight the most recent expense
        const mostRecentExpense = expenseList.firstElementChild;
        if (mostRecentExpense) {
            mostRecentExpense.classList.add('highlight');
            setTimeout(function () {
                mostRecentExpense.classList.remove('highlight');
            }, 3000); // Highlight for 3 seconds
        }
        
         // Add event listeners to delete buttons
         const deleteButtons = document.querySelectorAll('.delete-btn');
         deleteButtons.forEach(function (button) {
             button.addEventListener('click', function () {
                 const id = parseInt(button.getAttribute('data-id'));
                 deleteExpense(id);
             });
         });
    }

    function deleteExpense(id) {
        expenses = expenses.filter((expense, index) => index !== id);
        saveExpenses();
        displayExpenses();
    }
});
