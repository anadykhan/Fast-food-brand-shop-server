const express = require("express");
const cors = require("cors")
require('dotenv').config()
const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9bsrsbd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const brandCollection = client.db('brandDB').collection('brand')
        const productCollection = client.db('productDB').collection('product')
        const cartCollection = client.db('productDB').collection('cart')
        const locationCollection = client.db('brandDB').collection('location')

        app.get('/addedbrandlist', async (req, res) => {
            try {
                const cursor = brandCollection.find()
                const result = await cursor.toArray()
                res.send(result)
            } catch (error) {
                res.send(error)
            }
        })

        app.get('/addedcartlist', async (req, res) => {
            try {
                const cursor = cartCollection.find()
                const result = await cursor.toArray()
                res.send(result)
            } catch (error) {
                res.send(error)
            }
        })

        app.get('/addedlocationlist', async (req, res) => {
            try {
                const cursor = locationCollection.find()
                const result = await cursor.toArray()
                res.send(result)
            } catch (error) {
                res.send(error)
            }
        })

        app.get('/addedproductlist', async (req, res) => {
            try {
                const cursor = productCollection.find()
                const result = await cursor.toArray()
                res.send(result)
            } catch (error) {
                res.send(error)
            }
        })

        app.post('/addedbrand', async (req, res) => {
            try {
                const newBrand = req.body;
                console.log(newBrand);
                const result = await brandCollection.insertOne(newBrand)
                res.send(result)
            } catch (error) {
                console.error(error);
            }
        });

        app.post('/addedproduct', async (req, res) => {
            try {
                const newProduct = req.body;
                console.log(newProduct);
                const result = await productCollection.insertOne(newProduct)
                res.send(result)
            } catch (error) {
                console.error(error);
            }
        });

        app.put('/updateproduct/:id', async (req, res) => {
            try {
                const id = req.params.id
                const filter = { _id: new ObjectId(id) }
                const options = { upsert: true }
                const updatedProducts = req.body
                const finalProduct = {
                    $set: {
                        image: updatedProducts.image,
                        name: updatedProducts.name,
                        brandID: updatedProducts.brandID,
                        brandName: updatedProducts.brandName,
                        type: updatedProducts.type,
                        price: updatedProducts.price,
                        des: updatedProducts.des
                    }
                }

                const result = await productCollection.updateOne(filter, finalProduct, options)
                res.send(result)

            } catch (error) {
                console.log(error)
            }
        })

        app.post('/addedcart', async (req, res) => {
            try {
                const newCart = req.body
                console.log(newCart)
                const result = await cartCollection.insertOne(newCart)
                res.send(result)
            } catch {
                console.log(error)
            }
        })

        app.delete('/deletecart/:id', async(req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running")
})

app.listen(port, () => {
    console.log('Server is sunning on port' + port)
})
