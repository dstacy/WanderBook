import mongoose from 'mongoose';


const listSchema = mongoose.Schema({
    title: String,
    items: [{ name: String, category: String }], 
    creator: String,
    createAt: {
        type: Date,
        default: new Date()
    },
});

const listMessage = mongoose.model('ListMessage', listSchema);

export default listMessage;