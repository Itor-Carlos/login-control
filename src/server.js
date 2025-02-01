const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const { sequelize, connectDB } = require('./database');
const User = require('./models/User');
require('dotenv').config();

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        store: new PgSession({
            conObject: {
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
            },
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 },
    })
);

const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

app.use('/auth', authRoutes);

app.get('/dashboard', authMiddleware, (req, res) => {
    res.send(`Bem-vindo, ${req.session.user.username}!`);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);

    try {
        await sequelize.sync({ force: false });
        console.log('Banco de dados sincronizado!');
    } catch (err) {
        console.error('Erro ao sincronizar o banco:', err.message);
    }
});
