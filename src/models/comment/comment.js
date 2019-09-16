const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const CommentSchema = new Schema({
    video_id: {type: ObjectId},
    name: {type: String},
    email: {type: String},
    message: {type: String},
    avatar: {type: String},
    timestamp: {type: Date, default: Date.now},
});

module.exports = model('Comment', CommentSchema);
