const path = require('path');
const { randomName } = require('../../helpers/libs');
const fs = require('fs-extra');

const { Video, Comment } = require('../../models');
const controller = {};

controller.index = (req, res) => {
    res.send('Inicio');
};

controller.getAll = async (req, res) => {

    const videos = await Video.find().sort({timestamp: -1});

    for (let i = 0; i < videos.length; i++) {
        videos[i].filename = "http://localhost:3000/public/upload/" + videos[i].filename;
    }

    res.send({videos: videos});

};

controller.getById = async (req, res) => {

    const viewModel = {video: {}, comments: {}};
    let video = await Video.findOne({filename: {$regex: req.params.id_video}});

    if(!video){
        res.send({error: 'Video not found'});
    }else {

        video.views += 1;
        viewModel.video = video;
        await video.save();
        let comments = await Comment.find({video_id: video._id});

        viewModel.comments = comments;

        video.filename = "http://localhost:3000/public/upload/" + video.filename;

        res.send({data: viewModel});
    }


};

controller.create = (req, res) => {

    const saveVideo = async () => {
        const videoUrl = randomName();
        const videos = await Video.find({filename: videoUrl});
        if(videos.length > 0){
            saveVideo();
        }else {
            console.log(videoUrl);
            const videoTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase();
            console.log(ext);
            const newPath = path.resolve(`src/public/upload/${videoUrl}${ext}`);

            if(ext === '.mp4' || ext === '.mkv'){
                await fs.rename(videoTempPath, newPath);
                const newVideo = new Video({
                    title: req.body.title,
                    description: req.body.description,
                    filename: videoUrl + ext
                });
                await newVideo.save();
                res.send({ok: 'Video saved successfully!'});
            }else {
                await fs.unlink(videoTempPath);
                res.status(500).json({error: 'Only videos are allowed'});
            }

        }

    };

    saveVideo();


};

controller.remove = async (req, res) => {

    let video = await Video.findOne({filename: {$regex: req.params.id_video}});

    if(video){
        await fs.unlink(path.resolve('./src/public/upload/'+video.filename));
        await Comment.deleteOne({video_id: video.video_id});
        await video.remove();

        res.send({Ok: "Video deleted successfully!"});
    }
};

controller.like = async (req, res) => {
    let video = await Video.findOne({filename: {$regex: req.params.id_video}});

    if(video){
        video.likes += 1;
        await video.save();
        res.send({likes: video.likes});
    }else {
        res.status(404).json({error: 'Internal error'});
    }
};

controller.comment = async (req, res) => {

    let video = await Video.findOne({filename: {$regex: req.params.id_video}});

    if(video){

        const newComment = new Comment(req.body);
        newComment.avatar = "https://image.freepik.com/vector-gratis/perfil-avatar-hombre-icono-redondo_24640-14044.jpg";
        newComment.video_id = video._id;
        await newComment.save();

        res.send({Ok: "Comment saved successfully!"});
    }


};

module.exports = controller;
