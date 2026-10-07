const setupSwagger = require("../swagger");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");

const authRoutes = require("./routes/AuthRoutes");
const farmerRoutes = require("./routes/FarmerRoutes");
const fieldRoutes = require("./routes/FieldRoutes");
const materialRoutes = require("./routes/MaterialRoutes");
const expenseRoutes = require("./routes/ExpenseRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const reportRoutes = require("./routes/ReportRoutes");
const dashboardRoutes = require("./routes/DashboardRoutes");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Farmer Management API is running",
    timestamp: new Date(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);

setupSwagger(app);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;
