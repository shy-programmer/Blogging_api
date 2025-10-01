const joi = require('joi');
const userModel = require('../models/users.model')

const validateSignup = async (req, res, next) => {
    const schema = joi.object({
        first_name: joi.string().required(),
        last_name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
    });
    try {
        await schema.validateAsync(req.body);
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        next();
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
};

module.exports = { 
    validateSignup 
};