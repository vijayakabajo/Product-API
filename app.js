const bodyParser = require("body-parser");
const express= require("express");
const mongoose= require("mongoose");

const app=express();



//DB CONNECTION
mongoose.connect("mongodb://localhost:27017/productapi")
.then(()=>{
    console.log("DB Connected");
})
.catch((err)=>{
    console.log(err);
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());



//Schema
const productSchema= new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});
//Model
const Product= new mongoose.model("Product", productSchema);




//Create Product
app.post("/api/v1/product/new",async (req, res)=>{
    const product= await Product.create(req.body)
    res
    .status(201)
    .json({
        success:true,
        product
    })
});




//Read Products
app.get("/api/v1/products",async (req, res)=>{
    const products= await Product.find();

    res.status(200)
    .json({
        success:true,
        products
    })
});




//Update Product
app.put("/api/v1/product/:id", async (req,res)=>{
    try{
        let product= await Product.findById(req.params.id);


        if(!product){                   //if product not found 
            return res.status(500)
            .json({
                success: false,
                message: "Product not found"
            })
        }

        product= await Product.findByIdAndUpdate(req.params.id, req.body, {
        new:true,                //should return the modified document rather than the original one
        useFindAndModify:true,  //method for updating a single document
        runValidators:true      //run any validators specified in the schema
        });

        res.status(200).json({
        success:true,
        product
        })
    }  catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});



//Delete Product
app.delete("/api/v1/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        
        if (product) {            //Check if the returned product exists before deleting
            await product.deleteOne();
        }

        res.status(200).json({
            success: true,
            message: "Product is Deleted"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});




app.listen(3000, ()=>{
    console.log("Server is working on http://localhost:3000");
})