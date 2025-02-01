module.exports = (req, res, next) => {
    console.log(req)
    if (req.session.user) {
        return next();
    }
    res.status(401).send('Acesso não autorizado!');
};
