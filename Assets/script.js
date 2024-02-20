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
        const notes = document.getElementById('notes').value;
        const receipt = document.getElementById('receipt').files[0]; // Assuming only one file

        if (description && !isNaN(amount) && category) {
            addExpense(description, amount, category, notes, receipt);
            expenseForm.reset();
        } else {
            alert('Please fill in all fields correctly.');
        }
    });

    function addExpense(description, amount, category, notes, receipt) {
        const expense = {
            description,
            amount,
            category,
            notes,
            receipt: receipt ? URL.createObjectURL(receipt) : null // Convert file to URL
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
                <p><strong>Notes:</strong> ${expense.notes}</p>
                <img src="${expense.receipt}" alt="Receipt"> <!-- Display receipt -->
                <button class="edit-expense-btn" data-id="${index}">Edit</button>
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

        // Add event listener for edit buttons
        const editButtons = document.querySelectorAll('.edit-expense-btn');
        editButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const id = parseInt(button.getAttribute('data-id'));
                populateFormForEdit(id);
            });
        });
    }

    function deleteExpense(id) {
        expenses.splice(id, 1);
        saveExpenses();
        displayExpenses();
    }

    function populateFormForEdit(id) {
        const expenseToEdit = expenses[id];
        document.getElementById('description').value = expenseToEdit.description;
        document.getElementById('amount').value = expenseToEdit.amount;
        document.getElementById('category').value = expenseToEdit.category;
        document.getElementById('notes').value = expenseToEdit.notes;

        // Remove the expense being edited from the expenses array
        expenses.splice(id, 1);

        // Update localStorage
        saveExpenses();

        // Update the display
        displayExpenses();
    }
});

