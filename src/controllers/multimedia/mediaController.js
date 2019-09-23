const path = require('path');
const {randomName} = require('../../helpers/libs');
const fs = require('fs-extra');

const {Multimedia, Comment} = require('../../models');
const controller = {};


controller.getAll = async (req, res) => {

    const files = await Multimedia.find({type_media: req.params.type_media}).sort({timestamp: -1});
    let likesCount = 0;
    let viewsCount = 0;

    for (let i = 0; i < files.length; i++) {
        files[i].filename = "http://localhost:3000/public/upload/" + files[i].filename;
        likesCount += files[i].likes;
        viewsCount += files[i].views;
    }

    res.send({files: files, likes: likesCount, views: viewsCount});

};

controller.getPopulars = async (req, res) => {

    const files = await Multimedia.find({type_media: req.params.type_media}).sort({views: -1}).limit(3);
    res.send({files: files});
};

controller.getById = async (req, res) => {

    let file = await Multimedia.findOne({id_media: req.params.id_media, type_media: req.params.type_media});

    if (!file) {
        res.send({error: 'File not found'});
    } else {

        file.views += 1;
        await file.save();
        let comments = await Comment.find({media_id: file._id});

        file.filename = "http://localhost:3000/public/upload/" + file.filename;

        res.send({file: file, comments: comments});
    }

};

controller.create = (req, res) => {

    const saveFile = async () => {
        const fileUrl = randomName(6);
        const files = await Multimedia.find({filename: fileUrl});
        if (files.length > 0) {
            saveFile();
        } else {
            const fileTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase();
            const newPath = path.resolve(`src/public/upload/${fileUrl}${ext}`);
            let typeMedia = '';

            if (ext) {

                if (ext === '.mp4' || ext === '.mkv') {
                    typeMedia = 'vdo';
                } else if (ext === '.jpg' || ext === '.jpeg' || ext === '.png'){
                    typeMedia = 'img';
                }
                else {
                    await fs.unlink(fileTempPath);
                    res.status(500).json({error: 'Only multimedia are allowed'});
                }

                await fs.rename(fileTempPath, newPath);
                const newFile = new Multimedia({
                    id_media: randomName(8),
                    title: req.body.title,
                    description: req.body.description,
                    filename: fileUrl + ext,
                    type_media: typeMedia
                });
                await newFile.save();
                res.send({ok: 'File saved successfully!'});

            }
        }

    };

    saveFile();


};

controller.remove = async (req, res) => {

    let file = await Multimedia.findOne({_id: req.params.id_media, type_media: req.params.type_media});

    if (file) {
        await fs.unlink(path.resolve('./src/public/upload/' + file.filename));
        await Comment.deleteOne({media_id: file._id});
        await file.remove();

        res.send({Ok: "File deleted successfully!"});
    }
};

controller.like = async (req, res) => {
    let file = await Multimedia.findOne({id_media: req.params.id_media});

    if (file) {
        file.likes += 1;
        await file.save();
        res.send({likes: file.likes});
    } else {
        res.status(404).json({error: 'Internal error'});
    }
};

controller.comment = async (req, res) => {

    let file = await Multimedia.findOne({id_media: req.params.id_media});

    if (file) {

        const newComment = new Comment(req.body);
        newComment.avatar = "https://image.freepik.com/vector-gratis/perfil-avatar-hombre-icono-redondo_24640-14044.jpg";
        newComment.media_id = file._id;
        await newComment.save();

        res.send({message: "Comment saved successfully!"});
    }


};

module.exports = controller;
