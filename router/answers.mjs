import express from "express";
import connectionPool from "../utils/db.mjs";

const router = express.Router();

// POST /questions/:questionId/answers - Create an answer for a question
router.post("/:questionId/answers", async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;

    if (!questionId || isNaN(questionId)) {
      return res.status(400).json({
        message: "Invalid question ID."
      });
    }

    // Validate required fields
    if (!content) {
      return res.status(400).json({
        message: "Invalid request data."
      });
    }

    // Validate content is not empty and not longer than 300 characters
    if (content.trim() === "") {
      return res.status(400).json({
        message: "Invalid request data."
      });
    }

    if (content.length > 300) {
      return res.status(400).json({
        message: "Answer content cannot exceed 300 characters."
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

    // Create the answer
    await connectionPool.query(
      "INSERT INTO answers (question_id, content) VALUES ($1, $2)",
      [questionId, content.trim()]
    );

    res.status(201).json({
      message: "Answer created successfully."
    });
  } catch (error) {
    console.error("Error creating answer:", error);
    res.status(500).json({
      message: "Unable to create answers."
    });
  }
});

// GET /questions/:questionId/answers - Get all answers for a question
router.get("/:questionId/answers", async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId || isNaN(questionId)) {
      return res.status(400).json({
        message: "Invalid question ID."
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

    // Get all answers for the question
    const result = await connectionPool.query(
      "SELECT id, content FROM answers WHERE question_id = $1 ORDER BY id ASC",
      [questionId]
    );

    res.status(200).json({
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({
      message: "Unable to fetch answers."
    });
  }
});

// DELETE /questions/:questionId/answers - Delete all answers for a question
router.delete("/:questionId/answers", async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId || isNaN(questionId)) {
      return res.status(400).json({
        message: "Invalid question ID."
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

    // Delete all answers for the question
    await connectionPool.query(
      "DELETE FROM answers WHERE question_id = $1",
      [questionId]
    );

    res.status(200).json({
      message: "All answers for the question have been deleted successfully."
    });
  } catch (error) {
    console.error("Error deleting answers:", error);
    res.status(500).json({
      message: "Unable to delete answers."
    });
  }
});

export default router;
