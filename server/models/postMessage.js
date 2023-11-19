import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    site: String,
    pros: String,
    cons: String,
    message: String,
    name: String,
    state: String,
    amps: String,
    pets: String,
    sewer: String,
    water: String,
    waterfront: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    isPrivate: { type: Boolean, default: false },
})

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;