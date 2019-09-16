const express = require('express');
const router = express.Router();

const video = require('../../controllers/videos/videos');

module.exports = app => {

    router.get('/', video.index);

    router.get('/videos', video.getAll);
    router.get('/videos/:id_video', video.getById);
    router.post('/videos', video.create);
    router.post('/videos/:id_video/like', video.like);
    router.post('/videos/:id_video/comment', video.comment);
    router.delete('/videos/:id_video', video.remove);

    app.use(router);

};
