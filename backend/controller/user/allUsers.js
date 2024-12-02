const userModel = require('../../models/userModel')

async function allUsers(req, res) {
    try {

        console.log("all users", req.userId)

        const startTime = Date.now();
        const allUsers = await userModel.find()
        const endTime = Date.now();

        console.log(`allUsers query took ${endTime - startTime} ms`);
        
        res.status(200).json({
            message: "toti utilizatorii",
            data: allUsers,
            success: true,
            error: false
        })
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = allUsers