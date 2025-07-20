const transactionRouter = require("express").Router();
const transactionController = require("../controllers/transactions.controller");

transactionRouter.get("/payment-methods", transactionController.getPaymentMethods);
transactionRouter.get("/seats", transactionController.getReservedSeats);
transactionRouter.post("", transactionController.addTransaction);

module.exports = transactionRouter;
