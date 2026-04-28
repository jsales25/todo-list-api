import express, { Request, Response } from "express";
import cors from "cors";
import { pool } from "./db"; 

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 1. BUSCAR TODAS AS TAREFAS
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar tarefas:", err);
    res.status(500).json({ message: "Erro ao buscar tarefas no banco." });
  }
});

// 2. CRIAR UMA NOVA TAREFA
app.post("/todos", async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "O texto é obrigatório." });
  }

  try {
    const query = "INSERT INTO todos (text, completed) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(query, [text, false]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao salvar tarefa:", err);
    res.status(500).json({ message: "Erro ao salvar tarefa." });
  }
});

// 3. APAGAR TODAS AS CONCLUÍDAS
app.delete("/todos/completed", async (req: Request, res: Response) => {
  try {
    await pool.query("DELETE FROM todos WHERE completed = true");
    res.status(204).send();
  } catch (err) {
    console.error("Erro ao limpar concluídas:", err);
    res.status(500).json({ message: "Erro ao limpar tarefas concluídas." });
  }
});

// 4. ATUALIZAR STATUS DE UMA TAREFA
app.patch("/todos/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { completed } = req.body;

  try {
    const query = "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *";
    const result = await pool.query(query, [completed, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar tarefa:", err);
    res.status(500).json({ message: "Erro ao atualizar tarefa." });
  }
});

// 5. DELETAR UMA TAREFA POR ID
app.delete("/todos/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Tarefa não encontrada." });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Erro ao deletar tarefa:", err);
    res.status(500).json({ message: "Erro ao deletar tarefa." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
