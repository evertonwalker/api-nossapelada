
var mysql = require('mysql');
var api = {}

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    port: '3306',
    database: 'nossapelada'
})


api.scriptInicial = (req, res) => {
    con.query(`CREATE TABLE IF NOT  EXISTS Jogador(
        cpf int not null PRIMARY KEY,
        nome varchar(200) not Null,
        idade int not null,
        status bool,
        nota int not null,
        telefone varchar(200) not null
        )`
        , (error, results, fields) => {
            if (error) {
                console.log(error);
            } else {
                res.write("Carga inicial rodado com sucesso")
                console.log('Data Base criada');
                res.end();
            }
        });
}

api.listaJogadores = function (req, res) {
    con.query('select * from jogador;', function (error, results, fields) {
        if (error) error;
        res.json(results);
    });
}



api.inserirJogador = function (req, res) {
    jogador = req.body;
    var sql = "INSERT INTO JOGADOR (cpf, nome, idade, status, nota, telefone) VALUES ?";
    var values = [[jogador.cpf, jogador.nome, jogador.idade, false, 0, jogador.telefone]];

    con.query(sql, [values], function (err, result) {
        if (err) {
            res.json({ code: 500, message: err });
        } else {
            console.log("Number of records inserted: " + result.affectedRows);
            res.json({ code: 200, message: "Jogador cadastrado" });
        }
    });

}

api.deletarJogador = function (req, res) {
    con.query('DELETE FROM jogador where cpf = ' + req.params.cpf, function (error, results, fields) {
        if (error) {
            res.json({ code: 500, message: error })
        } else {
            res.json({ code: 200, message: 'O Jogador foi excluído com sucesso' });
        }
    });
}

api.sortearTimes = function (req, res) {

}


api.alterarStatusPagamentoJogador = function (req, res) {

}

api.verificarStatusJogador = function (req, res) {

}

api.pontuarJogador = function (req, res) {

}

api.verificarCraqueDaPelada = function (req, res) {

}

api.verificarBolaMuchaDaPelada = function (req, res) {

}

api.exibirHistoricoMelhorJogadorBaseadoEmTempo = function (req, res) {

}

api.exibirHistoricoPiorJogadorBaseadoEmTempo = function (req, res) {

}

api.jogadorQueFezMaisGols = function (req, res) {

}

api.gravarAposta = function (req, res) {

}

api.exibirResultadoAposta = function (req, res) {

}

api.exibirResultadosDaPartida = function (req, res) {

}

api.alterarStatusPagamentoJogador = function (req, res) {

}

api.sortearTimes = function (req, res) {

}



module.exports = api;