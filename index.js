import express from "express";
import http from "http";
import api from "./routes/index.js";
import config from "./config/index.js";
import session from "express-session";
import passport from "passport";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: "http://localhost:3001", // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(
  session({
    secret: "mySecretKey", // Replace with a strong secret in .env
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Use API routes

app.use("/", api);

// Start the server
server.listen(config.serverPort, () => {
  console.log(`Server is running on port ${config.serverPort}`);
});
