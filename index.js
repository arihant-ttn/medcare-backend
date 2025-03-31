import express from "express";
import http from "http";
import api from "./routes/index.js";
import config from "./config/index.js";
import passport from "passport";
import cors from 'cors';



const app = express();
const server = http.createServer(app);
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(passport.initialize());
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Use API routes

app.use("/", api);

// Start the server
server.listen(config.serverPort, () => {
  console.log(`Server is running on port ${config.serverPort}`);
});
