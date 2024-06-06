const Jwt = require("@hapi/jwt");
const InputError = require("./exceptions/InputError");

const TokenManager = {
    generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY,),
    generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY, "7d"),
    verifyRefreshToken: (refreshToken) => {
        try {
        const artifacts = Jwt.token.decode(refreshToken, process.env.REFRESH_TOKEN_KEY);
        return artifacts.decoded.payload;
        } catch (error) {
        throw new InputError("Refresh token tidak valid");
        }
    },
    };

module.exports = TokenManager;