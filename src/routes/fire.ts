import dotenv from 'dotenv';
import * as mongodb from 'mongodb';
dotenv.config();

const password : string = process.env.MONGO_PASS;

const dbName : string = 'vineyard';

const uri : string = `mongodb+srv://admin:${password}@cluster0.g8t21.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const { MongoClient } = mongodb;

// Use connect method to connect to the server
MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, client) {
    console.log("Connected successfully to server");

    const db : mongodb.Db = client.db(dbName);

    insertDocuments(db, () => {
        client.close();
    })
});

const insertDocuments = (db : mongodb.Db, callback : () => void) => {
    const collection = db.collection('config');

    collection.insertMany([
        {a: 1}, {a: 2}, {a: 3}
    ], (err, result) => {
        console.log(result);
        callback();
    });
}

export async function get(req) {
    console.log(req.query.get("id"));
    return {
        status: 200,
        body: {
            key: process.env.FIRE_KEY
        }
    }
}

export async function post(req) {
    console.log(req.query.get("id"));
    console.log(req);
    return {
        status: 200,
        body: {
            resp: req,
            key: process.env.FIRE_KEY
        }
    }
}