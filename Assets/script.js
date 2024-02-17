document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expenseForm');
    const expenseList = document.getElementById('expenseList');

    // Load expenses from local storage
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Display existing expenses
    displayExpenses();

    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value.trim();

        if (description && !isNaN(amount) && category) {
            addExpense(description, amount, category);
            expenseForm.reset();
        } else {
            alert('Please fill in all fields correctly.');
        }
    });

    function addExpense(description, amount, category) {
        const expense = {
            id: Date.now(),
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
        if (!expenseList) return; // Check if expenseList is null

        expenseList.innerHTML = '';

        expenses.forEach(function (expense) {
            const expenseItem = document.createElement('div');
            expenseItem.classList.add('expense-item');
            expenseItem.innerHTML = `
                <p><strong>Description:</strong> ${expense.description}</p>
                <p><strong>Amount:</strong> $${expense.amount.toFixed(2)}</p>
                <p><strong>Category:</strong> ${expense.category}</p>
                <button class="delete-btn" data-id="${expense.id}">Delete</button>
            `;
            expenseList.appendChild(expenseItem);
        });

        // Add event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const id = parseInt(button.getAttribute('data-id'));
                if (confirm('Are you sure you want to delete this expense?')) {
                    deleteExpense(id);
                }
            });
        });
    }

    function deleteExpense(id) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveExpenses();
        displayExpenses();
    }
});
