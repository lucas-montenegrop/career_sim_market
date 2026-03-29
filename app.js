import express from "express";
import apiRouter from "#api";
import errorHandler from "#middleware/errorHandler";
import getUserFromToken from "#middleware/getUserFromToken";

const app = express();

app.use(express.json());
app.use(getUserFromToken);
app.use(apiRouter);
app.use(errorHandler);

export default app;
