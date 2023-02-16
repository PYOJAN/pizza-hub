import app from "./app";
import { config } from "dotenv";
import { join } from "path";

config({ path: join(__dirname, "app", "config", ".env") });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`.🚀Server start on the http://localhost:${PORT}`);
});
