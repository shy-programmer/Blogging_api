const blogModel = require('../models/blogs.model');
const jwtTool = require('../utils/jwt');

const getAllPublishedBlogs = async (query) => {
    const { author, title, tags, sortBy = 'createdAt', order = 'desc', limit = 20, page = 1 } = query;
    const search = { state: 'published' };
    if (author) {
        search.author = author;
    }
    if (title) {
        search.title = { $regex: title, $options: 'i' };
    }
    if (tags) {
        search.tags = { $in: tags.split(',').map(tag => tag.trim()) };
    }
    const validSortFields = ['read_count', 'reading_time', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const blogs = await blogModel.find(search)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ [sortField]: sortOrder })
    return ({
        code: 200,
        message: 'Published blogs retrieved successfully',
        data: blogs,
    });
}

const getPublishedBlog = async (blogId) => {
    const blog = await blogModel.findOneAndUpdate(
        { _id: blogId, state: 'published' },
        { $inc: { read_count: 1 } },  
        { new: true }
    ).populate('author', 'first_name last_name email');

    if (!blog) {
        return {
            code: 404,
            message: 'Blog not found or unpublished',
        };
    }

    return {
        code: 200,
        message: 'Blog retrieved successfully',
        data: blog,
    };
};

const getUserBlogs = async (author, query) => {
    const { state, limit = 10, page = 1 } = query;
    const search = { author };
    if (state) {
        search.state = state;
    }
    const blogs = await blogModel.find(search)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ createdAt: -1 });
    return ({
        code: 200,
        message: 'User blogs retrieved successfully',
        data: blogs,
    });
}

const createBlog = async (blogData) => {
    const blog = await blogModel.create(blogData);
    return ({
        code: 201,
        message: 'Blog created successfully',
        data: blog,
    });
}

const publishBlog = async (author, blogId) => {
    const blog = await blogModel.findOneAndUpdate(
        { _id: blogId, author: author },
        { state: 'published' },
        { new: true }
    );
    if (!blog) {
        return {
            code: 404,
            message: 'Blog not found or you are not the author',
        };
    }
    return {
        code: 200,
        message: 'Blog published successfully',
        data: blog,
    };
}

const editBlog = async (author, blogId, blogData) => {
    const {title, description, tags, body} = blogData;
    const updatedData = {}
    if (title) {updatedData.title = title}
    if (description) {updatedData.description = description}
    if (tags) {updatedData.tags = tags}
    if (body) {updatedData.body = body}
    const blog = await blogModel.findOneAndUpdate(
        { _id: blogId, author: author },
        updatedData,
        { new: true }
    );
    if (!blog) {
        return {
            code: 404,
            message: 'Blog not found or you are not the author',
        };
    }
    return {
        code: 200,
        message: 'Blog updated successfully',
        data: blog
    };
}

const deleteBlog = async (author, blogId) => {
    const blog = await blogModel.findOneAndDelete(
        { _id: blogId, author: author }
    );
    if (!blog) {
        return {
            code: 404,
            message: 'Blog not found or you are not the author',
        };
    }
    return {
        code: 200,
        message: 'Blog deleted successfully',
    };
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


