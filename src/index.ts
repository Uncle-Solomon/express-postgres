import * as express from "express";
import * as bodyParser from "body-parser";
import { AppDataSource } from "./data-source";
import { port } from "./config";
import app from "./app";
const handleError = (err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message);
};

AppDataSource.initialize()
  .then(async () => {
    app.listen(port);
    console.log(
      `Express server has started on port ${port}. Open http://localhost:${port}/users to see results`
    );
  })
  .catch((error) => console.log(error));
