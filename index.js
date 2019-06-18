const express = require('express');
const fs = require('fs');
const mongo = require('mongodb');
const port = 2222;
const app = express();
const router = express.Router();
const DbName = 'SaferHere';
const thisUrl = "mongodb://localhost:27017/";
const { ObjectId } = mongo.ObjectId
let db;

// db.on('open', () => {
//     console.log("Connection to Db established");
// });
// db.on('error', console.error.bind(console, 'MongoDb Connection Error'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
 

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.post('/add', (req, res) => {
    const data = req.body;
    console.log('req body is', data);
    db.collection('SaferHere').insertOne(data, (err, result) => {
        if (err) {
            res.status(500).json({ body: err });
        } else {
            res.json(result);
        }
    })
});

app.get('/allDoc', (req, res) => {
    db.collection('SaferHere').find({}).toArray((err, result) => {
        if (err) {
            res.status(500).json({ message: err.message });
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/aDoc/:id', (req, res) => {
    const { id } = req.params;

    db.collection('SaferHere').findOne({"_id": ObjectId(id)}, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.message })
        } else {
            console.log('result is', result);
            res.json(result);
        }
    });
});

app.put('/update', (req, res) => {
    const { id } = req.params;
    const data = req.body;
    console.log(data);
    db.collection('SaferHere').updateOne({ "_id": ObjectId(id) }, {$set: data}, {upsert: true}, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.mesage });
            console.log(err.message)
        } else {
            // res.status(200).json({ message: result });
            res.json(result);
        }
    })
});

app.delete('/delete', (req, res) => {
    const { id } = req.params;
    db.collection('SaferHere').deleteOne({ "_id": ObjectId(id) }, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.mesage });
            console.log(err.message)
        } else {
            res.status(200).json({ message: 'Delete Successful' })
        }
    })
})

app.listen(port, () => {
    console.log(`listenig at ${port}`);
    mongo.connect(thisUrl, (err, client) => {
        if (err) {
            console.log(err.message);
        } else {
            if (client) {
                db = client.db(DbName);
                console.log('connection established');
            } else {
                console.log(err.message);
            }
        }
    });
})

