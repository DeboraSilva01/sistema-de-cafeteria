import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cardapioRoutes from "./src/routes/cardapioRoutes.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); // para receber JSON no POST/PUT
app.use(express.static(path.join(__dirname, "public"))); // front-end estático

// usa o router
app.use("/api/cardapio", cardapioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
