const Post = require('../models/post');

exports.createPost =  (req,res,next) => {
    
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
    }).catch(error => {
        res.status(500).json({
            message: "Creating a post failed!"
        })
    });

}

exports.updatePost =  (req, res, next) => {
    let imagePath= req.body.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.body._id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({_id:req.params.id, creator: req.userData.userId}, post).then(result => {
        if(result.n > 0){
            res.status(200).json({message: "Update successful!"});
        }else {
            res.status(401).json({message: "Not authorized!"});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Couldn't update post!"
        })
    });
}

exports.getPost = (req,res,next) => {
    Post.findById(req.params.id).then(post => {
        if(post) {
        res.status(200).json(post);
        }else {
        res.status(404).json({message: 'Post not found!'})
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching post failed!"
        })
    });
}

exports.deletePost = (req, res, next)=>{
    Post.deleteOne({
        _id: req.params.id,
        creator:req.userData.userId
        })
        .then(result =>{
            if(result.n > 0){
                res.status(200).json({message: "Deleted successful!"});
            }else {
                res.status(401).json({message: "Not authorized!"});
            }
        }).catch(error => {
            res.status(500).json({
                message: "Fetching post failed!"
            })
        });
}

exports.getposts = (req, res, next) => {
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
        }).catch(error => {
            res.status(500).json({
                message: "Fetching post failed!"
            })
        });;
}
