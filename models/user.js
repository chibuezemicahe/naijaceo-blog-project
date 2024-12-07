const { ObjectId } = require('mongodb');

const getDb = require('../util/database').getDb

class User{
    constructor (email, password, name, status){

        this.email = email;
        this.password = password;
        this.name = name;
        this.status = status || 'active';
    }

    async saveUser (){
       
        const db = getDb();

        const userCollection = db.collection('users');

         const existingUser = await userCollection.findOne({ email : this.email})

        if (existingUser ){
            throw new Error('This email is already registered');
        }

        else{
            const result = await userCollection.insertOne(this);
            
            const newUserDoc = await userCollection.findOne({ _id: result.insertedId });
            return newUserDoc;
        }

    }

    static async findUser (email,userId){
        const db = getDb();
        
        const query = {}

        if (userId){
            try{
                query._id = new ObjectId(userId);
            }   
            catch(error){
                throw new Error('Invalid User ID format');
            }
         }
         
        if (email){
            query.email = email;
        }

        const fetchUser = await db.collection('users').findOne(query);

        return fetchUser;
    }
}

module.exports = User;