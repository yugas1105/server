require("dotenv").config();
const connectDB = require("./src/config/db.js");
const jwt = require("jsonwebtoken");
const app = require("./src/app");

const port = process.env.PORT || 5000;


const startServer = async () => {
    await connectDB();

    app.listen(port, () => {
    console.log(`🚀 Server is running on port -`, process.env.PORT);
    console.log(`🔑 Api_Key -`, process.env.API_KEY);
    console.log(`📄 Swagger Docs available at http://localhost:${process.env.PORT}/api-docs`);

    // ✅ DEMO TOKEN (for testing)
    // const demoToken = jwt.sign(
    //     { id: "demoUserId", role: "admin" },
    //     process.env.JWT_SECRET,
    //     { expiresIn: process.env.JWT_EXPIRE }
    // );
    // console.log(`🔐 Demo JWT Token: ${demoToken}`);
});
};

startServer();