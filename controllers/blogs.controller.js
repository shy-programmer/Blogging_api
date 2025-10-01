const blogService = require('../services/blogs.service');

const getAllPublishedBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 20, author, title, tags, sortBy, order } = req.query;
        const response = await blogService.getAllPublishedBlogs({ page, limit, author, title, tags, sortBy, order });
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message || "An error occurred while retrieving published blogs" });
    }
}

const getPublishedBlog = async (req, res) => {
    try {
        const { id: blogId } = req.params;
        const response = await blogService.getPublishedBlog(blogId);
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, new: "na here", message: error.message || "An error occurred while retrieving the published blog" });
    }
}

const getUserBlogs = async (req, res) => {
    try {
        const author = req.user.id;
        const { state, page = 1, limit = 10 } = req.query;
        const response = await blogService.getUserBlogs(author, { state, page, limit });
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message || "An error occurred while retrieving user blogs" });
    }
}

const createBlog = async (req, res) => {
    try {
        const {title, description, tags, body} = req.body;
        const blogData = {
            title,
            description,
            tags,
            body,
            author: req.user.id
        }
        const response = await blogService.createBlog(blogData);
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message || "An error occurred while creating the blog" });
    }
}

const publishBlog = async (req, res) => {
    try {
        const author = req.user.id;
        const { id: blogId } = req.params;
        const response = await blogService.publishBlog(author, blogId);
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message || "An error occurred while publishing the blog" });
    }
}

const editBlog = async (req, res) => {
    try {
        const author = req.user.id;
        const { id: blogId } = req.params;
        const blogData = req.body;
        const response = await blogService.editBlog(author, blogId, blogData);
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message || "An error occurred while editing the blog" });
    }
}

const deleteBlog = async (req, res) => {
    try {
        const author = req.user.id;
        const { id: blogId } = req.params;
        const response = await blogService.deleteBlog(author, blogId);
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message || "An error occurred while deleting the blog" });
    }
}

module.exports = {
    getAllPublishedBlogs,
    getPublishedBlog,
    getUserBlogs,
    createBlog,
    publishBlog,
    editBlog,
    deleteBlog,
};

