import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pg from "pg";
const { Pool } = pg;
dotenv.config();
const connectionString = process.env.DATABASE_URL;

const app = express();

const pool = new Pool({ connectionString });

app.use(cors());
app.use(express.static("client"));
app.use(express.json());

app.get("/", (req, res) => {});
app.get("/todos", async (req, res) => {
  const todos = await pool.query("SELECT * FROM todos");
  res.json(todos.rows);
});
app.get("/todos/:id", async (req, res) => {
  const todo = await pool.query("SELECT * FROM todos WHERE id = $1", [
    req.params.id,
  ]);
  res.json(todo.rows);
});
app.post("/todos", (req, res) => {
  pool.query("INSERT INTO todos (name) VALUES ($1) RETURNING *", [
    req.body.name,
  ]);
  res.json({ message: "success" });
});
app.patch("/todos/:id", (req, res) => {
  pool.query("UPDATE todos SET name = $2 WHERE id = $1", [
    req.params.id,
    req.body.name,
  ]);
  res.json({ message: "success" });
});
app.delete("/todos/:id", (req, res) => {
  pool.query("DELETE FROM todos WHERE id = $1", [req.params.id]);
  res.json({ message: "success" });
});
app.get("/*", (req, res) => {
  res.status(404);
  res.json({ message: "Not found" });
});

app.listen(3000, () => {
  console.log("Server runnnig on http://localhost:3000");
});
