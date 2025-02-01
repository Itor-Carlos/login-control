const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.create({ username, password });
        res.status(201).send('Usuário registrado com sucesso!');
    } catch (err) {
        res.status(400).send('Erro ao registrar usuário!');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send('Credenciais inválidas!');
        }

        req.session.user = { id: user.id, username: user.username };
        res.send('Login bem-sucedido!');
    } catch (err) {
        res.status(500).send('Erro no servidor!');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Erro ao fazer logout!');
        res.send('Logout bem-sucedido!');
    });
});

module.exports = router;
