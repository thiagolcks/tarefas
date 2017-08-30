var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var redis = require('redis');

var app = express();

// Cria Cliente Redis
var clienteRedis = redis.createClient();

clienteRedis.on('connect', function () {
    console.log('Servidor Redis Conectado ...');
});

// Configuração do Renderizador de Páginas (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Captura o caminho '/' na URL
app.get('/', function (req, res) {
    var titulo = 'Lista de Tarefas';

    clienteRedis.lrange('tarefas', 0, -1, function (err, reply) {
        res.render('tarefas', {
            titulo: titulo,
            tarefas: reply
        });
    });
});

app.listen(3000);
console.log('Servidor Inicializado na Porta 3000 ...',
    'URL: http://localhost:3000/');

module.exports = app;