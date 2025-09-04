import express from "express";
import questionsRouter from "./router/questions.mjs";
import answersRouter from "./router/answers.mjs";
import votesRouter from "./router/votes.mjs";

const app = express();
const port = 4000;

// Middleware
app.use(express.json());

// Routes
app.use("/questions", questionsRouter);
app.use("/questions", answersRouter);
app.use("/", votesRouter);

// Test endpoint
app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    message: "Internal server error."
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Endpoint not found."
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log("Available endpoints:");
  console.log("- GET /test");
  console.log("- GET /questions");
  console.log("- GET /questions/:questionId");
  console.log("- POST /questions");
  console.log("- PUT /questions/:questionId");
  console.log("- DELETE /questions/:questionId");
  console.log("- GET /questions/search?title=...&category=...");
  console.log("- POST /questions/:questionId/answers");
  console.log("- GET /questions/:questionId/answers");
  console.log("- DELETE /questions/:questionId/answers");
  console.log("- POST /questions/:questionId/vote");
  console.log("- POST /answers/:answerId/vote");
});
