const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iy3km.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    console.log("db connected");
    const database = client.db("pc-hub");
    const productCollection = database.collection("products");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post("/product" , async (req,res) =>{
      const product =  req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    })

    app.delete("/product/:id" , async (req , res) =>{
      const id = req.params.id;
      const result = await productCollection.deleteOne({_id : ObjectId(id)})
      res.send(result);
    })

  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Pc-Hub!");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
