const controller = {};

controller.index = (req, res) => {
    res.send('Inicio');
};

controller.getAll = (req, res) => {

};

controller.getById = (req, res) => {

};

controller.create = (req, res) => {
    console.log(req.file);
    res.send('It works');
};

controller.like = (req, res) => {

};

controller.comment = (req, res) => {

};

controller.remove = (req, res) => {

};

module.exports = controller;
