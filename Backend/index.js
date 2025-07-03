require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');1
const cors = require('cors');
const connectDB = require('./config/connect');
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require('./routers/userRoutes');
const petRoutes = require('./routers/petRoutes');
const morgan = require('morgan');


app.use("/uploads", express.static("uploads"));
app.use(morgan('dev')); 
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1); // Exit the process with failure
  }
}
startServer();