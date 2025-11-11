import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cardapioRoutes from "./src/routes/cardapioRoutes.js";

const app = express();
const PORT = 3000;

// Corrige __dirname no ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors()); // 🚀 Corrige erro de CORS
app.use(express.json()); // Permite receber JSON
app.use(express.static(path.join(__dirname, "public"))); // Serve o front

// Rotas da API
app.use("/api/cardapio", cardapioRoutes);

// Teste de rota raiz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
