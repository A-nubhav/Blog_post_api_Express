const bcrypt = require("bcryptjs");

const saltRounds = 12;

// Function to hash a password
const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (err) {
        throw err;
    }
};

// Function to verify a password
const verify= async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (err) {
        throw err;
    }
};

module.exports = { hashPassword, verify};
