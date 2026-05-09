// TODO: Cấu hình kết nối MySQL bằng Sequelize
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize();

module.exports = sequelize;
