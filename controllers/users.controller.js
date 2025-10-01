const userService = require('../services/users.service');

const Signup = async (req, res) => {
    try {
        const userData = req.body;
        const response = await userService.Signup(userData);
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, message: 'An error occurred', error: error.message });
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json(
                {message: "email and password required"}
            )
        }
        const response = await userService.Login({ email, password });
        res.status(response.code).json(response);
    } catch (error) {
        res.status(500).json({ code: 500, message: 'An error occurred', error: error.message });
    }
}

module.exports = {
    Signup,
    Login,
};