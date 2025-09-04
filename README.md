# Q&A Website API - Express Server

A comprehensive REST API for a Question and Answer website built with Express.js and PostgreSQL. This API allows users to create, read, update, and delete questions and answers, as well as vote on content.

## Features

### Questions Management
- ✅ Create new questions with title, description, and category
- ✅ View all questions
- ✅ View specific question by ID
- ✅ Update question title, description, and category
- ✅ Delete questions
- ✅ Search questions by title or category

### Answers Management
- ✅ Create answers for questions (max 300 characters)
- ✅ View all answers for a specific question
- ✅ Delete all answers for a question (cascades when question is deleted)

### Voting System
- ✅ Vote on questions (upvote/downvote)
- ✅ Vote on answers (upvote/downvote)

## Technology Stack

- **Backend**: Express.js
- **Database**: PostgreSQL
- **Language**: JavaScript (ES6 modules)
- **Package Manager**: npm

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up PostgreSQL database:
   - Create a database named `quora-mock`
   - Update the connection string in `utils/db.mjs` if needed

4. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:4000`

## API Endpoints

### Questions

#### Create a Question
- **POST** `/questions`
- **Body**: 
  ```json
  {
    "title": "What is the capital of France?",
    "description": "This is a basic geography question asking about the capital city of France.",
    "category": "Geography"
  }
  ```
- **Success**: `201 Created` - `{"message": "Question created successfully."}`
- **Error**: `400 Bad Request` - `{"message": "Invalid request data."}`

#### Get All Questions
- **GET** `/questions`
- **Success**: `200 OK` - `{"data": [{"id": 1, "title": "...", "description": "...", "category": "..."}]}`

#### Get Question by ID
- **GET** `/questions/:questionId`
- **Success**: `200 OK` - `{"data": {"id": 1, "title": "...", "description": "...", "category": "..."}}`
- **Error**: `404 Not Found` - `{"message": "Question not found."}`

#### Update Question
- **PUT** `/questions/:questionId`
- **Body**: Same as create question
- **Success**: `200 OK` - `{"message": "Question updated successfully."}`

#### Delete Question
- **DELETE** `/questions/:questionId`
- **Success**: `200 OK` - `{"message": "Question post has been deleted successfully."}`

#### Search Questions
- **GET** `/questions/search?title=France&category=Geography`
- **Success**: `200 OK` - `{"data": [{"id": 1, "title": "...", "description": "...", "category": "..."}]}`

### Answers

#### Create Answer
- **POST** `/questions/:questionId/answers`
- **Body**: 
  ```json
  {
    "content": "The capital of France is Paris."
  }
  ```
- **Success**: `201 Created` - `{"message": "Answer created successfully."}`
- **Error**: `400 Bad Request` - `{"message": "Answer content cannot exceed 300 characters."}`

#### Get Answers for Question
- **GET** `/questions/:questionId/answers`
- **Success**: `200 OK` - `{"data": [{"id": 1, "content": "..."}]}`

#### Delete All Answers for Question
- **DELETE** `/questions/:questionId/answers`
- **Success**: `200 OK` - `{"message": "All answers for the question have been deleted successfully."}`

### Voting

#### Vote on Question
- **POST** `/questions/:questionId/vote`
- **Body**: 
  ```json
  {
    "vote": 1
  }
  ```
- **Success**: `200 OK` - `{"message": "Vote on the question has been recorded successfully."}`
- **Note**: Use `1` for upvote, `-1` for downvote

#### Vote on Answer
- **POST** `/answers/:answerId/vote`
- **Body**: 
  ```json
  {
    "vote": -1
  }
  ```
- **Success**: `200 OK` - `{"message": "Vote on the answer has been recorded successfully."}`

## Database Schema

### Questions Table
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR(255) NOT NULL)
- `description` (TEXT NOT NULL)
- `category` (VARCHAR(100) NOT NULL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Answers Table
- `id` (SERIAL PRIMARY KEY)
- `question_id` (INTEGER REFERENCES questions(id) ON DELETE CASCADE)
- `content` (VARCHAR(300) NOT NULL)
- `created_at` (TIMESTAMP)

### Question Votes Table
- `id` (SERIAL PRIMARY KEY)
- `question_id` (INTEGER REFERENCES questions(id) ON DELETE CASCADE)
- `vote` (INTEGER CHECK (vote IN (1, -1)))
- `created_at` (TIMESTAMP)

### Answer Votes Table
- `id` (SERIAL PRIMARY KEY)
- `answer_id` (INTEGER REFERENCES answers(id) ON DELETE CASCADE)
- `vote` (INTEGER CHECK (vote IN (1, -1)))
- `created_at` (TIMESTAMP)

## Error Handling

The API includes comprehensive error handling for:
- Invalid request data
- Missing required fields
- Resource not found (404)
- Database errors (500)
- Invalid vote values
- Content length validation

## Project Structure

```
├── app.mjs                 # Main application file
├── package.json           # Dependencies and scripts
├── router/
│   ├── questions.mjs      # Question-related routes
│   ├── answers.mjs        # Answer-related routes
│   └── votes.mjs          # Voting routes
└── utils/
    └── db.mjs             # Database connection and initialization
```

## Testing

Test the API using tools like Postman, curl, or any HTTP client:

```bash
# Test server
curl http://localhost:4000/test

# Create a question
curl -X POST http://localhost:4000/questions \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Question", "description": "This is a test", "category": "Test"}'

# Get all questions
curl http://localhost:4000/questions
```

## Development

The server uses nodemon for automatic restart during development. The database tables are automatically created when the server starts.

## License

This project is created for educational purposes as part of a backend skill checkpoint.
