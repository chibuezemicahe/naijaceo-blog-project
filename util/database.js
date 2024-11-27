const mongoDb = require ('mongodb');
const MongoClient = mongoDb.MongoClient;

let _gtDb;

const mongoConnect = (callback) =>{

    MongoClient.connect('mongodb+srv://chibuezemicahe:d1ulrE7sUS60S616@cluster0.bk64p.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
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