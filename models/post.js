const getDb = require('../util/database').getDb
const { ObjectId } = require('mongodb');

class FeedPost {

constructor (title, content, imageUrl, creator, createdAt){
        this.title = title;
        this.imageUrl = imageUrl;
        this.content = content;
        this.creator = creator;
        this.createdAt = createdAt;
}

async savePost (){
    
    const db = getDb();
    const postCollection = db.collection('posts');

    try{

        if(this._id){
            const result = await postCollection.updateOne( { _id: new ObjectId(this._id) },
            { $set: this });

            return  await postCollection.findOne({ _id: new ObjectId(this._id) });;
        }

        else{
        const result = postCollection.insertOne(this);
        return await postCollection.findOne({ _id: new ObjectId(this._id) });}

    }
    catch (error) {
        console.error('Error saving post:', error);
        throw error;
      }

}

static async fetchAll (){
    const db = getDb();
    return db.collection('posts').find().toArray();
}

static async findById(id){
    const db = getDb();

    const objectId = new ObjectId(id);
    return db.collection('posts').findOne({_id:objectId});
}

static async deletePost (postId){
    const db = getDb();

    const objectId = new ObjectId(postId);

    return db.collection('posts').deleteOne({_id:objectId})
}

}

module.exports = FeedPost;