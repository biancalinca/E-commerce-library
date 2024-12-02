async function userLogout(req, res) {
    try {
        res.clearCookie("token")
        
        res.json({
            message: 'Deconectare reusita',
            error: false,
            success: true,
            data: []
        })
    } catch (err) {
        res.json({
            message: err.message || err  ,
            error: true,
            sucess: false
        }) 
    }
}

module.exports = userLogout