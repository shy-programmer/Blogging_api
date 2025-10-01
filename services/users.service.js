const userModel = require('../models/users.model');
const jwtTool = require('../utils/jwt');

const Signup = async (userData) => {
    const user = await userModel.create(userData);

    const token = jwtTool.encode({
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
    });
    return ({
        code: 201,
        message: 'User created successfully',
        data: { user, token },
    })
}

const Login = async ({email, password}) => {
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
        return ({
            code: 401,
            message: 'Invalid credentials',
        });
    }

    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
        return ({
            code: 401,
            message: 'Invalid credentials',
        });
    }

    const token = jwtTool.encode({
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
    });
    return ({
        code: 200,
        message: 'User signed in successfully',
        data: { user, token },
    });
}

module.exports = {
    Signup,
    Login,
};