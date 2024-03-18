require('dotenv').config();
var user = process.env.MONGO_DB_USER;
var password = process.env.MONGO_DB_PASSWORD;

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const server = express();
server.use(bodyParser.json())
const port = 3000;

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  category: String
});

const Product = mongoose.model("Products", productSchema);

main().catch(err => console.log(err));

async function main() {
  mongoose.connect(`mongodb+srv://${user}:${password}@cluster0safasd.ahiq61f.mongodb.net/test?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
}

server.get("/", async (request, response) => {
  response.set("Content-Type", "text/html");

  let html = "<html><head><style>";
  html += "table {";
  html += "  border-collapse: collapse;";
  html += "  width: 80%;";
  html += "  border: 2px solid black;";
  html += "}";
  html += "th, td {";
  html += "  border: 1px solid black;";
  html += "  padding: 8px;";
  html += "  text-align: left;";
  html += "}";
  html += "th {";
  html += "  background-color: #f2f2f2;";
  html += "}";
  html += "</style></head><body>";

  html += "<h1>DressStore</h1>";

  html += "<table><tr><th>Id</th><th>Name</th><th>Description</th><th>Price</th><th>Quantity</th><th>Category</th></tr>";

  const products = await Product.find();

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    html += "<tr><td>" + product._id
      + "</td><td>" + product.name
      + "</td><td>" + product.description
      + "</td><td>" + product.price
      + "</td><td>" + product.quantity
      + "</td><td>" + product.category
      + "</td></tr>"
  }

  html += "</table>";

  html += "</body></html>";

  response.send(html);
});

server.get("/api/products", async (request, response) => {
  var kw = request.query.name;
  console.log('Keyword:', kw);

  const products = await Product.find();

  if (kw) {
    let filteredProducts = products.filter(p => p.name.toLowerCase().includes(kw.toLowerCase()));
    response.send(filteredProducts)
  } else {
    response.send(products)
  }
});

server.get("/api/products/:id", async (request, response) => {

  const product = await Product.findById(request.params.id);
  response.send(product)
});

server.post("/api/products", (request, response) => {
  const body = request.body;

  const newProduct = new Product({ name: body.name, description: body.description, price: body.price, quantity: body.quantity, category: body.category });
  newProduct.save();

  response.send(newProduct)
});

server.put("/api/products/:id", async (request, response) => {

  const product = await Product.findById(request.params.id);

  if (product) {
    product.name = request.body.name;
    product.description = request.body.description;
    product.price = request.body.price;
    product.quantity = request.body.quantity;
    product.category = request.body.category;

    await product.save();
  }

  response.send(product);
});

server.delete("/api/products/:id", async (request, response) => {

  await Product.findOneAndDelete({ _id: request.params.id });

  response.send();
});

server.delete("/api/products", async (request, response) => {
  try {
    console.log(Product.deleteMany({}))
    await Product.deleteMany({});

    response.status(200).send("Alla produkter har tagits bort.");
  } catch (error) {
    console.error("Fel vid borttagning av produkter:", error);
    response.status(500).send("Ett fel uppstod vid borttagning av produkter.");
  }
});

server.listen(port, () => {
  console.log("Server startad");
});
