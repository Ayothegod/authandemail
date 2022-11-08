import jwt from 'jsonwebtoken'

function auth(req,res,next) {
    const token = req.header('auth-token')
    if(!token) return res.status(401).send("Access Denied")

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}