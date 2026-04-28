import { Pool } from 'pg';
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config();

// Configura a "piscina" de conexões com o banco
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Testa a conexão ao iniciar
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
  } else {
    console.log('Conectado ao PostgreSQL com sucesso!');
  }
});
