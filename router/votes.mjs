import express from "express";
import connectionPool from "../utils/db.mjs";

const router = express.Router();

// POST /questions/:questionId/vote - Vote on a question
router.post("/questions/:questionId/vote", async (req, res) => {
  try {
    const { questionId } = req.params;
    const { vote } = req.body;

    if (!questionId || isNaN(questionId)) {
      return res.status(400).json({
        message: "Invalid question ID."
      });
    }

    // Validate vote value
    if (vote !== 1 && vote !== -1) {
      return res.status(400).json({
        message: "Invalid vote value."
      });
    }

    // Check if question exists
    const questionCheck = await connectionPool.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );

    if (questionCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found."
      });
    }

    // Record the vote
    await connectionPool.query(
      "INSERT INTO question_votes (question_id, vote) VALUES ($1, $2)",
      [questionId, vote]
    );

    res.status(200).json({
      message: "Vote on the question has been recorded successfully."
    });
  } catch (error) {
    console.error("Error voting on question:", error);
    res.status(500).json({
      message: "Unable to vote question."
    });
  }
});

// POST /answers/:answerId/vote - Vote on an answer
router.post("/answers/:answerId/vote", async (req, res) => {
  try {
    const { answerId } = req.params;
    const { vote } = req.body;

    if (!answerId || isNaN(answerId)) {
      return res.status(400).json({
        message: "Invalid answer ID."
      });
    }

    // Validate vote value
    if (vote !== 1 && vote !== -1) {
      return res.status(400).json({
        message: "Invalid vote value."
      });
    }

    // Check if answer exists
    const answerCheck = await connectionPool.query(
      "SELECT id FROM answers WHERE id = $1",
      [answerId]
    );

    if (answerCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Answer not found."
      });
    }

    // Record the vote
    await connectionPool.query(
      "INSERT INTO answer_votes (answer_id, vote) VALUES ($1, $2)",
      [answerId, vote]
    );

    res.status(200).json({
      message: "Vote on the answer has been recorded successfully."
    });
  } catch (error) {
    console.error("Error voting on answer:", error);
    res.status(500).json({
      message: "Unable to vote answer."
    });
  }
});

export default router;
