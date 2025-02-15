import express from "express";

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (_, res) => {
  res.send("Hello World");
  return;
});

app.listen(port, () => console.log(`Listenting on http://localhost:${port}`));
