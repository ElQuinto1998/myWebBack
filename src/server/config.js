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
    // Add headers
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });
    app.use(express.json());
    videoRoutes(app);

    return app;

};
