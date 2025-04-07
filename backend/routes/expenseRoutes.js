const express = require("express");
const Expense = require("../models/expenseModel");
const router = express.Router();

// ➤ Get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ➤ Add a new expense
router.post("/", async (req, res) => {
  const { title, amount, category } = req.body;
  if (!title || !amount || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newExpense = new Expense({ title, amount, category });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ➤ Delete an expense
router.delete("/:id", async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
