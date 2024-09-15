const TransactionService = require('../Services/TransactionService');
const jwt = require('jsonwebtoken');
const moment = require('moment')


// Create a new transaction
const createTransaction = async (req, res) => {
  const { transactionType, account, category, amount, notes } = req.body;

  try {
    const decodedToken = jwt.decode(req.token, { complete: true });
    const userId = decodedToken.payload._id;

    const newTransaction = await TransactionService.createTransaction(userId, transactionType, account, category, amount, notes);

    res.status(201).json({ message: "Transaction created successfully", transaction: newTransaction });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await TransactionService.getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all transactions of a particular user
const userTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await TransactionService.getUserTransactions(userId);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const updateTransactions = async (req, res) => {
  const transactionId = req.query.id
  console.log('up', transactionId)
  const updateData = req.body;
  console.log('ud', updateData);

  try {
    // Ensure the transaction belongs to the authenticated user
    const transaction = await TransactionService.getTransactionById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or not authorized' });
    }

    const updatedTransaction = await TransactionService.updateTransaction(transactionId, updateData);
    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a transaction by ID
const deleteTransaction = async (req, res) => {
  const transactionId = req.query.id; // Get the transaction ID from query parameters

  try {
    const transaction = await TransactionService.deleteTransaction(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: error.message });
  }
};

// Filter transactions based on time range
const filterTransactions = async (req, res) => {
  const { range } = req.query;
  const userId = req.user._id;
  let startDate;

  switch (range) {
    case 'weekly':
      startDate = moment().subtract(1, 'week').startOf('day');
      break;
    case 'monthly':
      startDate = moment().subtract(1, 'month').startOf('day');
      break;
    case '3months':
      startDate = moment().subtract(3, 'months').startOf('day');
      break;
    case '6months':
      startDate = moment().subtract(6, 'months').startOf('day');
      break;
    case 'yearly':
      startDate = moment().subtract(1, 'year').startOf('day');
      break;
    default:
      return res.status(400).json({ error: 'Invalid range' });
  }

  console.log(`Filtering transactions for user ${userId} from ${startDate.toISOString()}`);

  try {
    const transactions = await TransactionService.getUserTransactionsByDate(userId, startDate);
    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for the given range' });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error filtering transactions:", error);
    res.status(500).json({ error: error.message });
  }
};

const getTransactionsByDate = async (req, res) => {
  const { date } = req.query;
  const userId = req.user._id;

  try {
    const transactions = await TransactionService.getUserTransactionsBySpecificDate(userId, date);
    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for the given date' });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: error.message });
  }
};




module.exports = {
  createTransaction,
  getAllTransactions,
  userTransactions,
  updateTransactions,
  deleteTransaction,
  filterTransactions,
  getTransactionsByDate
};
