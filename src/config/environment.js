
module.exports = {
    port: process.env.PORT || 9002,
    node_env: process.env.NODE_ENV || "development",
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/dwitter",
    jwt_token: process.env.JWT_SECRET || "A7HL0W9DT6NS",
    jwt_token_exp: process.env.JWT_SECRET_EXP || 60 * 15,
    jwt_refresh_token: process.env.JWT_REFRESH_SECRET || "J3PL1C2DA2GV",
    jwt_refresh_token_exp: process.env.JWT_REFRESH_SECRET_EXP || "1d",
}
