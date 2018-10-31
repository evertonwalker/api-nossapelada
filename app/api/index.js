
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
        );    
        
        CREATE TABLE IF NOT  EXISTS pagamento(
        CdPagamento int not null AUTO_INCREMENT,
        valor int not null,
        cpfJogador int not null,
        data TIMESTAMP,
        PRIMARY KEY(CdPagamento),
        FOREIGN KEY(cpfJogador) REFERENCES Jogador(cpf) 
        );
        
        CREATE TABLE TIME(
        cd_time int not null AUTO_INCREMENT,
        nome VARCHAR(200),
        PRIMARY KEY(cd_time));
        
        CREATE TABLE TIME_JOGADOR(
        cpf_jogador int not null,
        cd_time int not null,
        PRIMARY KEY(cpf_jogador, cd_time),
        FOREIGN KEY(cpf_jogador) REFERENCES JOGADOR(cpf),
        FOREIGN KEY(cd_time) REFERENCES TIME(cd_time));`, (error, results, fields) => {
            if (error) {
                console.log(error);
            } else {
                res.write("Carga inicial rodado com sucesso")
                console.log('Data Base criada');
                res.end();
            }
        });        

}

function inserirPagamento(valor, cpf, data){
    var sql = "INSERT INTO Pagamento (valor, cpfJogador, data) VALUES ?";
    console.log(valor);
    console.log(cpf);
    console.log(data);
    var values = [[valor, cpf, data]];
    con.query(sql, [values], function(err, result){
        if (err) throw err;
        return true;
    }) 
}


api.cadastraPagamento = function(req,res){
    pagamento = req.body;
    con.query("SELECT MAX(data) data from pagamento WHERE cpfJogador = " + pagamento.cpf, function(err, result, fields){
        if(err) throw err;
        if(result != null) {
            console.log(result[0].data);
            console.log(pagamento.data);
            var date1 = new Date(result[0].data);
            var date2 = new Date(pagamento.data);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));          
            console.log(diffDays);            
            if( diffDays > 30 ) {
                console.log("é maior que 30");
                // if(inserirPagamento(pagamento.valor, req.params.cpf, pagamento.data)){
                //     res.json({msg : "Pagamento Cadastrado"});
                // }
                var sql = "INSERT INTO Pagamento (valor, cpfJogador, data) VALUES ?";
                var values = [[pagamento.valor, pagamento.cpf, pagamento.data]];
                con.query(sql, [values], function(err, resultado){
                 if (err) throw err;
                     console.log("Number of records inserted" + resultado.affectedRows);                    
                     res.json({message : "Pagamento Cadastrado", code: 200});                    
                });
            }else{
                res.json({message : "O Pagamento não pode ser registrado, pois ainda não se passaram 30 dias desde o pagamento anterior", code: 509})                
            }
        }
        else{
            var sql = "INSERT INTO Pagamento (valor, cpfJogador, data) VALUES ?";
            var values = [[pagamento.valor, pagamento.cpf, pagamento.data]];
            con.query(sql, [values], function(err, resultado){
             if (err) throw err;
                 console.log("Number of records inserted" + resultado.affectedRows);                    
                 res.json({message : "Pagamento Cadastrado", code: 200})                     
            });
            
        }
    });  

    
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

api.listaJogadoresPagos = function (req, res) {
    con.query('select * from jogador ' +
        ' where exists(select * from pagamento ' +
                      'where pagamento.cpfJogador = jogador.cpf ' + 
                      ' AND DATEDIFF(CURDATE(), pagamento.data) > 30);', function(error, results){
                            if(error) throw error;
                            res.json(results);
                      });
}



api.inserirJogador = function (req, res) {
    jogador = req.body;
    var sql = "INSERT INTO JOGADOR (cpf, nome, idade, status, nota, telefone) VALUES ?";
    var values = [[jogador.cpf, jogador.nome, jogador.idade, false, 0, jogador.telefone]];

    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);

        res.json({ message: "Jogador cadastrado", code: 200 });
    });
}

api.deletarJogador = function (req, res) {
    con.query('DELETE FROM jogador where cpf = ' + req.params.cpf, function (error, results, fields) {
        if (error) throw error;
        res.json(results.affectedRows);
    });
}


api.inserirTime = function (req, res) {
    time = req.body;
    var sql = "INSERT INTO TIME(nome) ?";
    var values = [[time.nome]];

    con.query(sql,[values], function(err, result){
        if(err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);

        res.json({ message: "Time Cadastrado", code: 200});
    }).end();

}

api.inserirJogadorTime = function(req, res){
    jogadorTime = req.body;

    var sql = "INSERT INTO TIME_JOGADOR(cpf_jogador, cd_time) ?";
    var values = [[jogadorTime.cpf, jogadorTime.cdTime]];
    con.query(sql, values, function(err, results){
        if(err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);

        res.json({ message: "Os jogadores pro Time foram cadastrados com sucesso" , code : 200});
    }).end();
}

api.sortearTimes = function (req, res) {

}


api.alterarStatusPagamentoJogador = function (req, res) {

}

api.verificarStatusJogador = function (req, res) {

}

api.pontuarJogador = function (req, res) {
    pontos = req.body;

    var sql = "UPDATE Jogador SET nota = " + pontos.nota;
    con.query(sql , function(err, result){
        if(err) throw err;
        
        console.log("Number of records updated: " + result.affectedRows);
        res.json({ message: "Nota para o jogador atualizada" , code : 200});
    }).end();

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