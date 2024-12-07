require('dotenv').config();
const mongoDb = require ('mongodb');
const MongoClient = mongoDb.MongoClient;

let _gtDb;

const mongoConnect = (callback) =>{

    MongoClient.connect(`mongodb+srv://${process.env.Mongo_URL}`)
    .then(client=>{
        console.log('connected');
        _gtDb = client.db();
        callback();
    }).catch(err=>{
        console.log(err);
    });
}

const getDb = ()=>{
    if(_gtDb){
        return _gtDb;
    }
    console.log('no db');
    throw 'No database found';
} 

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;