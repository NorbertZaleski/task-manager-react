import express from "express";

const app = express();

app.get("/api/transactions", (req, res)=> {
    res.send("you got many trans!");
});

app.listen(5001, () => {
    console.log("Server just started on port: 5001");
});