const mongoose = require('mongoose');
const path = require('path');
const { Schema } = mongoose;

const multimediaSchema = new Schema({
    id_media: {type: String},
    title: {type: String},
    description: {type: String},
    filename: {type: String},
    views: {type: Number, default: 0},
    likes: {type: Number, default: 0},
    timestamp: {type: Date, default: Date.now},
    type_media: {type: String}

});

multimediaSchema.virtual('uniqueId')
    .get(function () {
        return this.filename.replace(path.extname(this.filename), '');
    });

module.exports = mongoose.model('Multimedia', multimediaSchema);
