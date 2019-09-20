const express = require('express');
const router = express.Router();

const media = require('../../controllers/multimedia/mediaController');

module.exports = app => {

    router.get('/multimedia/:type_media', media.getAll);
    router.get('/multimedia/:type_media/:id_media', media.getById);
    router.post('/multimedia', media.create);
    router.post('/multimedia/:id_media/like', media.like);
    router.post('/multimedia/:id_media/comment', media.comment);
    router.delete('/multimedia/:type_media/:id_media', media.remove);

    app.use(router);

};
