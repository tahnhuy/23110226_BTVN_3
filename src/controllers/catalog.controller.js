const { Major } = require('../models');
const { successResponse } = require('../utils/responseHandler');

const listMajors = async (req, res, next) => {
    try {
        const majors = await Major.findAll({
            where: { isActive: true },
            order: [['sortOrder', 'ASC'], ['name', 'ASC']],
            attributes: ['id', 'code', 'name']
        });
        return successResponse(res, 200, 'OK', { majors });
    } catch (error) {
        next(error);
    }
};

module.exports = { listMajors };
