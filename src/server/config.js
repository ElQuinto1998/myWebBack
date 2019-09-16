const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const express = require('express');
const videoRoutes = require('../routes/videos/index');

module.exports = app => {

    app.set('port', process.env.PORT || 3000);

    app.use(morgan('dev'));
    app.use(multer({dest: path.join(__dirname,'../public/upload/temp')}).single('video'));
    app.use('/public', express.static(path.join(__dirname, '../public')));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    videoRoutes(app);

    return app;

};
