module.exports.successResponse = (status, error = false, message, result, token) => {
    return { status, error, message, result, token};
}

module.exports.errorResponse = (status = 500, error = true, message) => {
    return { status, error, message };
}