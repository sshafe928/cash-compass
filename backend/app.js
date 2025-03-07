const { MongoClient } = require("mongodb");
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require("dotenv").config();
const EntriesRoute = require("./routes/Entries");
const UserRoute = require("./routes/Users.js");
const connectDB = require("./db/connect");
const port = 5000

// Middleware
app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())


//Body Parser
app.use(express.urlencoded({extended : false}));


//Routes
app.use('/api/dashboard', require('./routes/photoRoutes'));
app.use('/api/budget', require('./routes/eventRoutes'));
app.use('/api/history', require('./routes/newsRoutes'));
app.use('/api/forms', require('./routes/eagleRoutes'));
app.use('/api/login', require('./routes/eagleRoutes'));
app.use('/api/signup', require('./routes/eagleRoutes'));


// Local Middleware
const notFound = require('./middleware/not-found');
app.use(notFound);


const initServer = async() => {
    try {
        await connectDB("mongodb+srv://admin_man:trN9Eb44Y4vSo5E6@task-manager-practice.ru0bz.mongodb.net/cipher-users?retryWrites=true&w=majority");
        app.listen(port, () => {
            console.log("Listening on port 5000");
        })
    } catch(err) {
        console.log(err);
    }
}
initServer();