const joi = require('joi');
const blogModel = require('../models/blogs.model')
const jwtTool = require('../utils/jwt');

const validateBlog = async (req, res, next) => {
    const schema = joi.object({
        title: joi.string().required(),
        description: joi.string().optional().default(""),
        tags: joi.array().items(joi.string()).optional().default([]),
        state: joi.string().valid('draft', 'published').default('draft'),
        body: joi.string().required(),
    });
    try {
        await schema.validateAsync(req.body, { stripUnknown: true });
        const existingBlog = await blogModel.findOne({ title: req.body.title, userId: req.user._id });
        if (existingBlog) {
            return res.status(400).json({ message: 'Blog title must be unique' });
        }
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const validateEditBlog = async (req, res, next) => {
    const schema = joi.object({
        title: joi.string().optional(),
        description: joi.string().optional(),
        tags: joi.array().items(joi.string()).optional(),
        body: joi.string().optional(),
    });

    try {
        await schema.validateAsync(req.body, { stripUnknown: true });

        if (req.body.title) {
            const existingBlog = await blogModel.findOne({
                title: req.body.title,
                author: req.user._id,
                _id: { $ne: req.params.id }, 
            });

            if (existingBlog) {
                return res.status(400).json({ message: 'Blog title must be unique' });
            }
        }

        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const Authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwtTool.decode(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = { 
    validateBlog,
    validateEditBlog,
    Authenticate 
};