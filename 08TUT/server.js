const express = require('express');
const { cp, rmSync } = require('fs');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;


// custom middleware loger 
app.use(logger);

// Cross Origin Ressource Sharing 

const whiteliste = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];
const corsOption = {
    origin: (origin, callback) => {
        if (whiteliste.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSucessStatus: 200
}

app.use(cors(corsOption));

// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());


// serve static files 
app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/subdir', express.static(path.join(__dirname, '/public')));


// Pour activer les routes mise dans le fichier des root.js
app.use('/', require('./routes/root'));

app.use('/subdir', require('./routes/subdir'));

app.use('/employees', require('./routes/api/employees'));








// app.use('/')

// DIFFERENCE ENTRE APP.USE ET APP.ALL
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" })
    } else {
        res.type('txt').send("404 Not Found")
    }
})


app.use(errorHandler);

app.listen(PORT, () => console.log(`Le serveur tourne sur ${PORT}`));

//myEmitter.emit('log', 'Log event emitted');

