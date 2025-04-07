import React, { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [filterCategory, setFilterCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || !category || !date) return;

    const newExpense = {
      name,
      amount: parseFloat(amount),
      category,
      date,
    };

    if (isEditing && currentIndex !== null) {
      const updated = [...expenses];
      updated[currentIndex] = newExpense;
      setExpenses(updated);
      setIsEditing(false);
      setCurrentIndex(null);
    } else {
      setExpenses([...expenses, newExpense]);
    }

    setName('');
    setAmount('');
    setCategory('');
    setDate('');
  };

  const handleDelete = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  const handleEdit = (index) => {
    const expense = expenses[index];
    setName(expense.name);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date);
    setIsEditing(true);
    setCurrentIndex(index);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory = !filterCategory || expense.category === filterCategory;
    const matchesDateRange =
      (!startDate || new Date(expense.date) >= new Date(startDate)) &&
      (!endDate || new Date(expense.date) <= new Date(endDate));
    return matchesCategory && matchesDateRange;
  });

  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const exportToCSV = () => {
    const headers = ['Name', 'Amount', 'Category', 'Date'];
    const rows = expenses.map((exp) => [exp.name, exp.amount, exp.category, exp.date]);

    let csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Expense Tracker 💸</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Expense Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">{isEditing ? 'Update Expense' : 'Add Expense'}</button>
      </form>

      <div style={{ marginBottom: '20px' }}>
        <label>Filter by Category: </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Filter by Date Range: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span style={{ margin: '0 10px' }}>to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <h3>Total Spent: ${totalSpent.toFixed(2)}</h3>

      <button onClick={exportToCSV} style={{ marginBottom: '20px' }}>
        📥 Export to CSV
      </button>

      <h4>Category Totals:</h4>
      <ul>
        {Object.entries(categoryTotals).map(([cat, total], index) => (
          <li key={index}>
            {cat}: ${total.toFixed(2)}
          </li>
        ))}
      </ul>

      <h4>Expenses List:</h4>
      <ul>
        {filteredExpenses.map((expense, index) => (
          <li key={index}>
            {expense.name} - ${expense.amount.toFixed(2)} - {expense.category} - {expense.date}
            <button onClick={() => handleEdit(index)} style={{ marginLeft: '10px' }}>
              ✏️ Edit
            </button>
            <button
              onClick={() => handleDelete(index)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              🗑️ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
