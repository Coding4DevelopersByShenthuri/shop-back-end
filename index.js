const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});
const upload = multer({ storage: storage });

// MongoDB connection configuration
const uri = "mongodb+srv://shenthuri2001:Shenthu_Maran1007@cluster0.8q84a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,  // This ensures the connection works efficiently
  serverSelectionTimeoutMS: 20000  // Time out after 10 seconds
});

// Define Mongoose Schemas
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  dueDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }, // Reference to staff member
});

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  department: String,
  contactInfo: String,
});

// Create Mongoose models
const Task = mongoose.model('Task', TaskSchema);
const Staff = mongoose.model('Staff', StaffSchema);

// Run function to initialize MongoDB connection and set up API routes
async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    const productCollections = client.db("ProductInventory").collection("product");
    const staffCollections = client.db("StaffInventory").collection("staff");
    const taskCollection = client.db("TaskDatas").collection("task");

    console.log("Successfully connected to MongoDB!");

// Task CRUD routes
app.post('/upload-task', async (req, res) => {
  try {
    const staffId = req.body.staffId;

    // Check if the staff ID is valid and exists
    // staff = await Staff.find({_id: new ObjectId(staffId)});
    // if (staff) {
    //   return res.status(400).send({ error: "Assigned staff member does not exist" });
    // }

    // const task = new Task(req.body);
    // const result = await task.save();
    res.status(201).send(''staff'');
  } catch (error) {
    console.error("Error adding task:", error.message); // Detailed error logging
    res.status(500).send({ error: "Failed to save task. Please try again later." });
  }
});


app.get('/all-tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send({ error: "Failed to fetch tasks" });
  }
});

app.patch('/task/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid task ID format' });
  }

  try {
    const updateTaskData = req.body;
    const task = await Task.findByIdAndUpdate(id, updateTaskData, { new: true });
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }
    res.status(200).send(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send({ error: "Failed to update task" });
  }
});

app.delete('/task/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: 'Invalid task ID format' });
  }

  try {
    const result = await Task.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send({ error: 'Task not found' });
    }
    res.status(200).send({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send({ error: "Failed to delete task" });
  }
});

    // New endpoint to get product quantities
    app.get('/stock_quantity', async (req, res) => {
      try {
        const products = await productCollections.find({}).toArray(); // Fetch all products
        const stockQuantities = products.reduce((acc, product) => {
          acc[product.category] = product.stock_quantity; // Assuming each product has category and quantity
          return acc;
        }, {});

        res.json(stockQuantities); // Send the stock quantities as JSON response
      } catch (error) {
        console.error("Error fetching stock quantities:", error);
        res.status(500).send({ error: "Failed to fetch stock quantities" });
      }
    });


    // Insert a product into the database (POST method)
    app.post('/upload-product', async (req, res) => {
      try {
        const data = req.body;
        const result = await productCollections.insertOne(data);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error uploading product:", error);
        res.status(500).send({ error: "Failed to upload product" });
      }
    });

    // Get all products from the database (GET method)
    app.get('/all-products', async (req, res) => {
      try {
        const products = await productCollections.find({}).toArray();
        res.status(200).send(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({ error: "Failed to fetch products" });
      }
    });

    // Update a product by ID (PATCH method)
    app.patch('/product/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid product ID format' });
      }

      try {
        const updateProductData = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: updateProductData };
        const result = await productCollections.updateOne(filter, updateDoc);

        if (!result.matchedCount) {
          return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send(result);
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send({ error: "Failed to update product" });
      }
    });

    // Delete a product by ID (DELETE method)
    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid product ID format' });
      }

      try {
        const result = await productCollections.deleteOne({ _id: new ObjectId(id) });
        if (!result.deletedCount) {
          return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send({ message: 'Product deleted successfully' });
      } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send({ error: "Failed to delete product" });
      }
    });

    // Get a single product by ID (GET method)
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid product ID format' });
      }

      try {
        const filter = { _id: new ObjectId(id) };
        const result = await productCollections.findOne(filter);

        if (!result) {
          return res.status(404).send({ error: 'Product not found' });
        }

        res.status(200).send(result);
      } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).send({ error: "Failed to fetch product" });
      }
    });

    // Route for uploading product image and storing image URL and path in MongoDB
    app.post('/upload-product-image', upload.single('image'), async (req, res) => {
      const productId = req.body.productId;  // Get the product ID from the request

      if (!ObjectId.isValid(productId)) {
        return res.status(400).send({ error: 'Invalid product ID format' });
      }

      try {
        // Extract the necessary details from the uploaded file
        const filePath = req.file.path; // The path where the file is stored on the server
        const fileName = req.file.filename; // The uploaded file's name
        const baseUrl = `${req.protocol}://${req.get('host')}`; // Base URL of the server
    
        // Create the desired imageUrl format
        const imageUrl = `/uploads/${fileName}`;

        // Create the desired imagePath format
        const absoluteImagePath = path.resolve(filePath);

        // Update the product document with image URL and path
        const updateDoc = {
          $set: {
            imageUrl: imageUrl,
            imagePath: absoluteImagePath,
          },
        };

        const filter = { _id: new ObjectId(productId) };  // Using ObjectId
        const result = await productCollections.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
          return res.status(404).send({ error: 'Product not found' });
        }

        res.status(200).send({
          message: 'Product image uploaded successfully',
          imageUrl: imageUrl,
          imagePath: absoluteImagePath,
        });
      } catch (error) {
        console.error("Error uploading product image:", error);
        res.status(500).send({ error: "Failed to upload product image" });
      }
    });

    // Reusable CRUD operations for staff
    // Insert a staff into the database (POST method)
    app.post('/add-staff', async (req, res) => {
      try {
        const data = req.body;
        const result = await staffCollections.insertOne(data);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error adding staff:", error);
        res.status(500).send({ error: "Failed to add staff" });
      }
    });

    // Get all staffs from the database (GET method)
    app.get('/all-staffs', async (req, res) => {
      try {
        const staffs = await staffCollections.find({}).toArray();
        res.status(200).send(staffs);
      } catch (error) {
        console.error("Error fetching staffs:", error);
        res.status(500).send({ error: "Failed to fetch staffs" });
      }
    });

    // Update a staff by ID (PATCH method)
    app.patch('/staff/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid staff ID format' });
      }

      try {
        const updateStaffData = req.body;
        const filter = { _id: new ObjectId(id) };
        const result = await staffCollections.updateOne(filter, { $set: updateStaffData });

        if (!result.matchedCount) {
          return res.status(404).send({ error: 'Staff not found' });
        }
        res.status(200).send(result);
      } catch (error) {
        console.error("Error updating staff:", error);
        res.status(500).send({ error: "Failed to update staff" });
      }
    });

    // Delete a staff by ID (DELETE method)
    app.delete('/staff/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid staff ID format' });
      }

      try {
        const result = await staffCollections.deleteOne({ _id: new ObjectId(id) });
        if (!result.deletedCount) {
          return res.status(404).send({ error: 'Staff not found' });
        }
        res.status(200).send({ message: 'Staff deleted successfully' });
      } catch (error) {
        console.error("Error deleting staff:", error);
        res.status(500).send({ error: "Failed to delete staff" });
      }
    });

    // Get a single staff by ID (GET method)
    app.get('/staff/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid staff ID format' });
      }

      try {
        const filter = { _id: new ObjectId(id) };
        const result = await staffCollections.findOne(filter);

        if (!result) {
          return res.status(404).send({ error: 'Staff not found' });
        }

        res.status(200).send(result);
      } catch (error) {
        console.error("Error fetching staff:", error);
        res.status(500).send({ error: "Failed to fetch staff" });
      }
    });

    // Route for uploading staff image and storing image URL and path in MongoDB
    app.post('/upload-staff-image', upload.single('image'), async (req, res) => {
      const staffId = req.body.staffId;  // Get the staff ID from the request


      if (!ObjectId.isValid(staffId)) {
        return res.status(400).send({ error: 'Invalid staff ID format' });
      }

      try {
        // Extract the necessary details from the uploaded file
        const filePath = req.file.path; // The path where the file is stored on the server
        const fileName = req.file.filename; // The uploaded file's name
        const baseUrl = `${req.protocol}://${req.get('host')}`; // Base URL of the server

        // Create the desired imageUrl format
       const imageUrl = `/uploads/${fileName}`;

       // Create the desired imagePath format
       const absoluteImagePath = path.resolve(filePath);

       // Update the staff document with image URL and path
       const updateDoc = {
          $set: {
            imageUrl: imageUrl,
            imagePath: absoluteImagePath,
          },
        };
        const filter = { _id: new ObjectId(staffId) };  // Using ObjectId
        const result = await staffCollections.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
          return res.status(404).send({ error: 'Staff not found' });
        }

        res.status(200).send({
          message: 'Staff image uploaded successfully',
          imageUrl: imageUrl,
          imagePath: absoluteImagePath,
        });
      } catch (error) {
        console.error("Error uploading staff image:", error);
        res.status(500).send({ error: "Failed to upload staff image" });
      }
    });

    // Confirm a successful MongoDB connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your MongoDB deployment successfully!");

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
