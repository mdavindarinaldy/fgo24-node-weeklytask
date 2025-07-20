const transactionRouter = require("express").Router();
const transactionController = require("../controllers/transactions.controller");

transactionRouter.get("/payment-methods", transactionController.getPaymentMethods);
transactionRouter.get("/seats", transactionController.getReservedSeats);

module.exports = transactionRouter;
