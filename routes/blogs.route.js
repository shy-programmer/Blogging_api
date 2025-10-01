const express = require('express');
const router = express.Router()
const blogController = require('../controllers/blogs.controller');
const blogMiddleware = require('../middlewares/blogs.middleware');


router.get('/user', blogMiddleware.Authenticate, blogController.getUserBlogs);

router.get('/', blogController.getAllPublishedBlogs);
router.get('/:id', blogController.getPublishedBlog);

router.use(blogMiddleware.Authenticate);

router.post('/', blogMiddleware.validateBlog, blogController.createBlog);
router.put('/:id/publish', blogController.publishBlog);
router.put('/:id', blogMiddleware.validateEditBlog, blogController.editBlog);
router.delete('/:id', blogController.deleteBlog);


module.exports = router;



