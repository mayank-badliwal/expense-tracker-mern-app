const express = require('express')

const { addTransaction } = require("../controllers/transactionController");
const { getAllTransaction, editTransaction, deleteTransaction } = require("../controllers/transactionController")

//router object
const router = express.Router();

//routes
//add transaction POST method
router.post('/add-transaction', addTransaction)
//edit transaction POST method
router.post('/edit-transaction', editTransaction)
//delete transaction POST method
router.post('/delete-transaction', deleteTransaction)

//get transactions
router.post('/get-transaction', getAllTransaction)

module.exports = router;