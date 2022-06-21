const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verifyToken = require('../middleware/auth');

// @route: POST /api/posts
// @desc:  Create post
// @access: Private
router.post('/', verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: 'Title is required' });
  }
  try {
    const newPost = new Post({
      title,
      description,
      url: url.startsWith('https://') ? url : `https://${url}`,
      status: status || 'TO LEARN',
      user: req.userId,
    });

    await newPost.save();
    res.json({ success: true, message: 'Happy learming', post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route: GET /api/posts
// @desc:  Get post
// @access: Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate('user', [
      'username',
    ]);
    return res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route: PUT /api/posts/:id
// @desc:  Update post
// @access: Private
router.put('/:id', verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: 'Title is required' });
  }
  try {
    let updatedPost = {
      title,
      description: description || '',
      url: (url.startsWith('https://') ? url : `https://${url}`) || '',
      status: status || 'TO LEARN',
      user: req.userId,
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId };
    updatedPost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    );

    // User not authorized to update post or post is not found
    if (!updatedPost) {
      return res.status(401).json({
        success: true,
        message: 'Post not found or user not authorized',
      });
    }
    res.send({
      success: true,
      message: 'Excelent progress!',
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// @route: DELETE /api/posts/:id
// @desc:  Delete post
// @access: Private
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition);
    // User not authorized to update post or post is not found
    if (!deletedPost) {
      return res.status(401).json({
        success: true,
        message: 'Post not found or user not authorized',
      });
    }
    res.send({
      success: true,
      message: 'Excelent progress!',
      post: deletedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router;
