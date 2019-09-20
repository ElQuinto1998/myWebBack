const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const express = require('express');
const mediaRouter  = require('../routes/multimedia/mediaRouter');
const bodyParser = require('body-parser');

module.exports = app => {

    app.set('port', process.env.PORT || 3000);

    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(multer({dest: path.join(__dirname,'../public/upload/temp')}).single('file'));
    app.use('/public', express.static(path.join(__dirname, '../public')));
    app.use(express.urlencoded({extended: false}));

    //Headers
    app.use(function (req, res, next) {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);

        next();
    });

    app.use(express.json());

    mediaRouter(app);

    return app;

};
