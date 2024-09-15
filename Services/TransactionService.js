const Transaction = require('./../Models/TransactionModel');

// Create a new transaction
const createTransaction = async (userId, transactionType, account, category, amount, notes) => {
  const newTransaction = new Transaction({
    userId: userId,
    transactionType: transactionType,
    account: account,
    category: category,
    amount: amount,
    notes: notes
  });

  await newTransaction.save();
  return newTransaction;
};

// Get all transactions
const getAllTransactions = async () => {
  const transactions = await Transaction.find();
  return transactions;
};

// Get all transactions of a particular user
const getUserTransactions = async (userId) => {
  const transactions = await Transaction.find({ userId: userId });
  return transactions;
};

// Function to get a transaction by ID and userId
const getTransactionById = async (transactionId) => {
    return await Transaction.findOne({ _id: transactionId});
  };

// Update a transaction by ID
const updateTransaction = async (transactionId, updatedFields) => {
    const updatedTransaction = await Transaction.findByIdAndUpdate(transactionId, updatedFields, { new: true, runValidators: true });
    return updatedTransaction;
  };

// Function to delete a transaction by ID
const deleteTransaction = async (transactionId) => {
    return await Transaction.findByIdAndDelete(transactionId);
  };

  // Get user transactions filtered by date
const getUserTransactionsByDate = async (userId, startDate) => {
  try {
    console.log(`Querying transactions for user ${userId} from ${startDate.toISOString()}`);
    const transactions = await Transaction.find({
      userId: userId,
      date: { $gte: startDate.format('MM/DD/YYYY') } // Compare with string date format
    }).exec();
    console.log('Found transactions:', transactions);
    return transactions;
  } catch (error) {
    throw new Error("Error fetching transactions: " + error.message);
  }
};

const getUserTransactionsBySpecificDate = async (userId, date) => {
  try {
    const transactions = await Transaction.find({
      userId: userId,
      date: date
    }).exec();
    return transactions;
  } catch (error) {
    throw new Error("Error fetching transactions: " + error.message);
  }
};


module.exports = {
  createTransaction,
  getAllTransactions,
  getUserTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getUserTransactionsByDate,
  getUserTransactionsBySpecificDate
};
