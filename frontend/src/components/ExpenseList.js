import React, { useState } from 'react';
import axios from 'axios';

const ExpenseList = ({ expenses, setExpenses }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  // Calculate total expense amount
  const calculateTotalAmount = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // Filter expenses by selected category
  const filteredExpenses = selectedCategory
    ? expenses.filter((expense) => expense.category === selectedCategory)
    : expenses;

  const handleDelete = async (id) => {
    try {
      // Send DELETE request to backend
      const response = await axios.delete(`http://localhost:5000/api/expenses/${id}`);

      // Remove the deleted expense from the UI
      setExpenses(expenses.filter((expense) => expense._id !== id));

      alert(response.data.message); // Optional: Show success message
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Error deleting expense');
    }
  };

  return (
    <div>
      <h3>Expense List</h3>

      {/* Total Expense */}
      <p><strong>Total: ${calculateTotalAmount().toFixed(2)}</strong></p>

      {/* Category Filter */}
      <div>
        <label htmlFor="category">Filter by Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          {/* Add more categories as needed */}
        </select>
      </div>

      {filteredExpenses.length === 0 ? (
        <p>No expenses found for this category!</p>
      ) : (
        <ul>
          {filteredExpenses.map((expense) => (
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

export default ExpenseList;
