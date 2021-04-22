const express = require('express');
const multer = require('multer');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const Post = require('../models/post');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = Error("invalid mime type");
        if(isValid){
            error = null;
        }
        cb(error, "images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];

        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});
  
router.post("", checkAuth,multer({storage:storage}).single("image"), (req,res,next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(201).json({
        message:'Post added',
        post: {
            ...createdPost,
            _id: createdPost._id
        }
        });
    });

});

router.put("/:id", checkAuth,multer({storage:storage}).single("image"), (req, res, next) => {
    let imagePath= req.body.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.body._id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    Post.updateOne({_id:req.params.id}, post).then(result => {
        console.log(result);
        res.status(200).json({message: "Update successful!"});
    });
});

router.get("/:id", (req,res,next) => {
    Post.findById(req.params.id).then(post => {
        if(post) {
        res.status(200).json(post);
        }else {
        res.status(404).json({message: 'Post not found!'})
        }
    });
})

router.delete("/:id",checkAuth,(req, res, next)=>{
    console.log('wqer');
    Post.deleteOne({
        _id: req.params.id
        })
        .then(()=>{
        console.log('Deleted');
        res.status(200).json({message:"Post deleted!"})
        })
});

router.get("",(req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.currentpage;
    const postQuery = Post.find();
    let posts;
    if(pageSize && currentPage){
        postQuery 
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(documents => {
            posts = documents
            return Post.count();
        })
        .then(count => {
        res.status(200).json({
            message: 'Post fetchedsuccesfully',
            posts:posts,
            maxPosts: count
        })
        });
});

module.exports = router;