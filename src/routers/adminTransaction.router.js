const adminTransactionRouter = require("express").Router();
const adminTransactionController = require("../controllers/adminTransaction.controller");

adminTransactionRouter.post("/payment-methods", adminTransactionController.addPaymentMethod);
adminTransactionRouter.get("/sales", adminTransactionController.getSalesData);

module.exports = adminTransactionRouter;
