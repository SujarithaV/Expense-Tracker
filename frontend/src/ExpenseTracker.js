import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  // Fetch expenses from the backend
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await axios.get('http://localhost:5000/api/expenses');
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    }
    fetchExpenses();
  }, []);

  // Handle adding a new expense
  const handleAddExpense = async () => {
    try {
      const newExpense = { title, amount, category };
      const response = await axios.post('http://localhost:5000/api/expenses', newExpense);
      setExpenses([...expenses, response.data]); // Add to the expense list
      setTitle('');
      setAmount('');
      setCategory('');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  // Handle deleting an expense
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div>
      <h3>Expense Tracker</h3>

      <div>
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          value={category}
          placeholder="Category"
          onChange={(e) => setCategory(e.target.value)}
        />
        <button onClick={handleAddExpense}>Add Expense</button>
      </div>

      <h4>Expenses List</h4>
      {expenses.length === 0 ? (
        <p>No expenses added yet!</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense._id}>
              <p><strong>{expense.title}</strong></p>
              <p>Amount: ${expense.amount}</p>
              <p>Category: {expense.category}</p>
              <button onClick={() => handleDelete(expense._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseTracker;
