const express = require('express');
const router = express.Router();
const transactionController = require('../Controller/TransactionController');
const auth = require('./../Middleware/auth')

router.post('/transactions', auth, transactionController.createTransaction);
router.get('/alltransactions', auth, transactionController.getAllTransactions);
router.get('/usertransactions', auth, transactionController.userTransactions);
router.post('/updateTransaction', auth, transactionController.updateTransactions);
router.delete('/deletetransactions', auth, transactionController.deleteTransaction);
router.get('/transactions/filter', auth, transactionController.filterTransactions); 
router.get('/transactions/date', auth, transactionController.getTransactionsByDate);



module.exports = router;
