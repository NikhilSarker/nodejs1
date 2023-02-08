//Import required module

const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

//Mongo config stuff
//const dbUrl = "mongodb://nikhil:sarker@127.0.0.1:27017/fashionhousedb?authMechanism=DEFAULT&authSource=fashionhousedb";
const dbUrl = "mongodb+srv://nikhil:sarker@cluster0.xtksq0y.mongodb.net/fashionhousedb?retryWrites=true&w=majority";
const client = new MongoClient(dbUrl);

//Set up express app and port number

const app = express();
const port = process.env.PORT || 8888;

// set up template engine

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


//Set up static file path
app.use(express.static(path.join(__dirname, "public")));

//convert form data to JSON for easier use
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




// var links = [
//   {
//     name:"Home",
//     path:"/"
//   },
//   {
//     name:"Products",
//     path:"#"
//   },
//   {
//     name:"Services",
//     path:"#"
//   },
//   {
//     name:"About Us",
//     path:"#"
//   },
//   {
//     name:"Contact",
//     path:"#"
//   }
// ]

// Page Routes
// app.get("/", (request, response)=>{

//   //response.status(200).send("test page");
//   response.render("index", {title: "Home", menu: links});
// });
app.get("/", async (request, response) => {
  products = await getProducts();
  response.render("index", { title: "Home", product: products });
});
app.get("/about", async (request, response) => {
  products = await getProducts();
  response.render("about", { title: "About", product: products });
});
app.get("/product", async (request, response) => {
  products = await getProducts();
  response.render("product", { title: "Product", product: products });
});
app.get("/contact", async (request, response) => {
  products = await getProducts();
  response.render("contact", { title: "Contact", product: products });
});


///////////////////////
app.get("/admin/product", async (request, response) => {
  products = await getProducts();
  response.render("product-list", {
    title: "product admin page",
    product: products
  });
});

app.get("/admin/product/add", async (request, response) => {
  products = await getProducts();
  response.render("product-add", {
    title: "add product",
    product: products
  });
});

//Set up server listener
app.listen(port, ()=>{
  console.log(`listening on http://localhost:${port}`);
});




//Form processing paths
app.post("/admin/product/add/submit", async (request, response) => {
  //For a post form, the data is retrieved through the body
  //request.body.<field_name>
  let newProduct = {
    color: request.body.color,
    material: request.body.material,
    product: request.body.product
  };
  await addproduct(newProduct);
  response.redirect("/admin/product");
});
//MONGO FUNCTIONS
/* Function to connect to DB and return the "testdb" database. */
async function connection() {
  await client.connect();
  db = client.db("fashionhousedb");
  return db;
}

/* Function to select all documents from menuLinks. */
async function getProducts() {
  db = await connection();
  var results = db.collection("products").find({});
  res = await results.toArray(); //convert to an array
  return res;
}

//Function to insert a new document into menuLink
async function addproduct(product) {
  db = await connection();
  await db.collection("products").insertOne(product);
  console.log("product added");
}