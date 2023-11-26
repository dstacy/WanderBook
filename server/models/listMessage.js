import mongoose from 'mongoose';


const listSchema = mongoose.Schema({
    title: String,
    items: [{ name: String, category: String }], 
    creator: String,    
    isPublic: Boolean,
    createdAt: {
        type: Date,
        default: new Date()
    },
});

var listMessage = mongoose.model('ListMessage', listSchema);

export default listMessage;