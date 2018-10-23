
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
    con.query(`CREATE TABLE Jogador(
        cpf int not null PRIMARY KEY,
        nome varchar(200) not Null,
        idade int not null,
        status bit not null default 0,
        nota int not null,
        telefone varchar(200) not null
        );    
        
        CREATE TABLE pagamento(
        CdPagamento int not null AUTO_INCREMENT,
        valor int not null,
        cpfJogador int not null,
        data TIMESTAMP default current_timestamp(),
        PRIMARY KEY(CdPagamento),
        FOREIGN KEY(cpfJogador) REFERENCES Jogador(cpf) 
        ); `, function(error, results, fields){
            if(error) console.log('Error : ' + error);
            console.log('Resultado : ' + results);              
            console.log('Data Base criada');
            res.json({ result: "O script de carga inicial foi rodado e o banco está pronto para uso" });
        }) ;
    con.end();
}

api.cadastraPagamento = function(req,res){
    pagamento = req.body;
    var sql = "INSERT INTO Pagamento (valor, cpfJogador) VALUES ?";
    var values = [[pagamento.valor, req.params.cpf]];
    con.query(sql, [values], function(err, result){
        if (err) throw err;
        console.log("Number of records inserted" + result.affectedRows);
        
        res.json({msg : "Pagamento Cadastrado"});
    });

    con.end();
}

api.listaPagamentos = function(req, res){
    con.query('SELECT * FROM Pagamento', function(err, results){
        if(err) throw error;
        res.json(results);
    });
    
    con.end();

}

api.listaJogadores = function (req, res) {
    con.query('select * from jogador order by nome', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
}



api.inserirJogador = function (req, res) {
    jogador = req.body;
    var sql = "INSERT INTO JOGADOR (cpf, nome, idade, status, nota, telefone) VALUES ?";
    var values = [[jogador.cpf, jogador.nome, jogador.idade, 0, 0, jogador.telefone]];

    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);

        res.json({ msg: "Jogador cadastrado" });
    });

    con.end();

}

api.deletarJogador = function (req, res) {
    con.query('DELETE FROM jogador where cpf = ' + req.params.cpf, function (error, results, fields) {
        if (error) throw error;
        res.json(results.affectedRows);
    });
    con.end();
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

api.exibirHistoricoMelhorJogadorBaseadoEmTempo = function (req, res){

}

api.exibirHistoricoPiorJogadorBaseadoEmTempo = function (req, res){

}

api.jogadorQueFezMaisGols = function (req, res){

}

api.gravarAposta = function (req, res){

}

api.exibirResultadoAposta = function (req, res){

}

api.exibirResultadosDaPartida = function (req, res) {

}

api.alterarStatusPagamentoJogador = function (req, res) {

}

api.sortearTimes = function (req, res) {

}



module.exports = api;