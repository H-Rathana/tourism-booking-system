import app from "./app.js";
import cors from "cors";

app.use(cors());
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});