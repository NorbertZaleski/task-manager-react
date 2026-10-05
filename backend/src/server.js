import express from "express";
import { connectDB } from "./config/db.js";
import { configDotenv } from "dotenv";
import routes from "./routes/index.js";
configDotenv();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use('/api', routes);

connectDB().then(()=> {
    app.listen(PORT, () => {
        console.log("Server just started on port: ", PORT);
    });
});

