const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const PostsController = require('../controllers/posts');
const file = require('../middleware/file');


router.post("", checkAuth,file, PostsController.createPost);

router.put("/:id", checkAuth,file,PostsController.updatePost);

router.get("/:id", PostsController.getPost)

router.delete("/:id",checkAuth,PostsController.deletePost);

router.get("",PostsController.getposts);

module.exports = router;