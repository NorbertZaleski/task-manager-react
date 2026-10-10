import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { configDotenv } from "dotenv";
import routes from "./routes/index.js";
import rateLimiter from "./middleware/rateLimiter.js";
configDotenv();

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.set('trust proxy', 1);

//middleware
app.use(express.json());
//app.use(rateLimiter);
//app.use(authenticator);

app.use('/api', routes);

connectDB().then(()=> {
    app.listen(PORT, () => {
        console.log("Server just started on port: ", PORT);
    });
});

