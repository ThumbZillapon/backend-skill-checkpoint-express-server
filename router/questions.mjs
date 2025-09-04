import express from "express";
import connectionPool from "../utils/db.mjs";

const router = express.Router();

// GET /questions - Get all questions
router.get("/", async (req, res) => {
  try {
    const result = await connectionPool.query(
      "SELECT id, title, description, category FROM questions ORDER BY id DESC"
    );
    
    res.status(200).json({
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      message: "Unable to fetch questions."
    });
  }
});

// GET /questions/search - Search questions by title or category
router.get("/search", async (req, res) => {
  try {
    const { title, category } = req.query;

    // Validate that at least one search parameter is provided
    if (!title && !category) {
      return res.status(400).json({
        message: "Invalid search parameters."
      });
    }

    let query = "SELECT id, title, description, category FROM questions WHERE 1=1";
    const params = [];
    let paramCount = 0;

    if (title) {
      paramCount++;
      query += ` AND title ILIKE $${paramCount}`;
      params.push(`%${title}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND category ILIKE $${paramCount}`;
      params.push(`%${category}%`);
    }

    query += " ORDER BY id DESC";

    const result = await connectionPool.query(query, params);

    res.status(200).json({
      data: result.rows
    });
  } catch (error) {
    console.error("Error searching questions:", error);
    res.status(500).json({
      message: "Unable to fetch a question."
    });
  }
});

// GET /questions/:questionId - Get a specific question by ID
router.get("/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    
    if (!questionId || isNaN(questionId)) {
      return res.status(400).json({
        message: "Invalid question ID."
      });
    }

    const result = await connectionPool.query(
      "SELECT id, title, description, category FROM questions WHERE id = $1",
      [questionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found."
      });
    }

    res.status(200).json({
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({
      message: "Unable to fetch questions."
    });
  }
});

// POST /questions - Create a new question
router.post("/", async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Invalid request data."
      });
    }

    // Validate title and description are not empty strings
    if (title.trim() === "" || description.trim() === "" || category.trim() === "") {
      return res.status(400).json({
        message: "Invalid request data."
      });
    }

    const result = await connectionPool.query(
      "INSERT INTO questions (title, description, category) VALUES ($1, $2, $3) RETURNING id",
      [title.trim(), description.trim(), category.trim()]
    );

    res.status(201).json({
      message: "Question created successfully."
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({
      message: "Unable to create question."
    });
  }
});

// PUT /questions/:questionId - Update a question by ID
router.put("/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const { title, description, category } = req.body;

    if (!questionId || isNaN(questionId)) {
      return res.status(400).json({
        message: "Invalid question ID."
      });
    }

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Invalid request data."
      });
    }

    // Validate title and description are not empty strings
    if (title.trim() === "" || description.trim() === "" || category.trim() === "") {
      return res.status(400).json({
        message: "Invalid request data."
      });
    }

    // Check if question exists
    const checkResult = await connectionPool.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found."
      });
    }

    // Update the question
    await connectionPool.query(
      "UPDATE questions SET title = $1, description = $2, category = $3 WHERE id = $4",
      [title.trim(), description.trim(), category.trim(), questionId]
    );

    res.status(200).json({
      message: "Question updated successfully."
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({
      message: "Unable to update question."
    });
  }
});

// DELETE /questions/:questionId - Delete a question by ID
router.delete("/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId || isNaN(questionId)) {
      return res.status(400).json({
        message: "Invalid question ID."
      });
    }

    // Check if question exists
    const checkResult = await connectionPool.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found."
      });
    }

    // Delete the question (answers will be deleted automatically due to CASCADE)
    await connectionPool.query(
      "DELETE FROM questions WHERE id = $1",
      [questionId]
    );

    res.status(200).json({
      message: "Question post has been deleted successfully."
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({
      message: "Unable to delete question."
    });
  }
});

export default router;
