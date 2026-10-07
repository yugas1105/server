const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Duplicate key
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Duplicate value already exists",
            error: err.keyValue,
        });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: Object.values(err.errors).map(
                (error) => error.message
            ),
        });
    }

    return res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
    });
};

module.exports = errorHandler;