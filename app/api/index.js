
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
        cpf varchar(11) not null PRIMARY KEY,
        nome varchar(200) not Null,
        idade int not null,        
        nota int not null,
        telefone varchar(11) not null
        );  

        CREATE TABLE IF NOT  EXISTS pagamento(
        CdPagamento int not null AUTO_INCREMENT,
        valor int not null,
        cpfJogador varchar(11) not null,
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
        FOREIGN KEY(cd_time) REFERENCES TIME(cd_time));
        
                
        CREATE TABLE PARTIDA(
            id_partida int not null AUTO_INCREMENT,
            time1 int not null,
            time2 int not null,
            timeVencedor int,
            status ENUM('criada', 'andamento', 'finalizada'),
            placar varchar(10),
            melhorJogador varchar(11),
            piorJogador varchar(11),
            PRIMARY KEY(id_partida));
    
            ALTER TABLE PARTIDA
            ADD CONSTRAINT fk_time01
            FOREIGN KEY(time1)
            REFERENCES time(cd_time)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
            ADD CONSTRAINT fk_time02
            FOREIGN KEY(time2)
            REFERENCES time(cd_time)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
            ADD CONSTRAINT fk_jogador01
            FOREIGN KEY(melhorJogador)
            REFERENCES jogador(cpf)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
            ADD CONSTRAINT fk_jogador02
            FOREIGN KEY(piorJogador)
            REFERENCES jogador(cpf)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION;

        CREATE TABLE GOLS(
            partida int not null,
            jogador varchar(11) not null,
            gols int not null,
            PRIMARY KEY(partida, jogador),
            FOREIGN KEY(partida) REFERENCES partida(id_partida),
            FOREIGN KEY(jogador) REFERENCES jogador(cpf));

    `, (error, results, fields) => {
            if (error) {
                console.log(error);
            } else {
                res.write("Carga inicial rodado com sucesso")
                console.log('Data Base criada');
                res.end();
            }
        });

}

api.cadastraPagamento = function (req, res) {

    if (req.body.cpf === undefined) {
        res.json({ code: 509, message: "Selecione um jogador para inserir o pagamento." });
        return;
    }

    if (req.body.valor !== undefined) {
        if (req.body.valor < 0) {
            res.json({ code: 509, message: "O valor não pode ser menor que 0" });
            return;
        }
    } else {
        res.json({ code: 509, message: "O valor do pagamento não pode ser vazio" });
        return;
    }

    if (req.body.data !== undefined) {
        let data = new Date();
        let dateSplit = req.body.data.split('-');
        let dateResquest = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2]);

        if (dateResquest.getTime() <= data.getTime()) {
            res.json({ code: 509, message: "Não selecione uma data menor do que o dia atual" });
            return;
        }
    } else {
        res.json({ code: 509, message: "Selecione o dia do pagamento do jogador" });
        return;
    }

    pagamento = req.body;

    con.query("SELECT MAX(data) data from pagamento WHERE cpfJogador = " + pagamento.cpf, function (err, result, fields) {
        if (err) {
            console.log(err);
        }
        if (result != null) {
            console.log(result[0].data);
            console.log(pagamento.data);
            var date1 = new Date(result[0].data);
            var date2 = new Date(pagamento.data);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            console.log(diffDays);
            if (diffDays > 30) {
                console.log("é maior que 30");
                // if(inserirPagamento(pagamento.valor, req.params.cpf, pagamento.data)){
                //     res.json({msg : "Pagamento Cadastrado"});
                // }
                var sql = "INSERT INTO Pagamento (valor, cpfJogador, data) VALUES ?";
                var values = [[pagamento.valor, pagamento.cpf, pagamento.data]];
                con.query(sql, [values], function (err, resultado) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Number of records inserted" + resultado.affectedRows);
                        res.json({ message: "Pagamento Cadastrado", code: 200 });
                    }

                });
            } else {
                res.json({ message: "O Pagamento não pode ser registrado, pois ainda não se passaram 30 dias desde o pagamento anterior", code: 509 })
            }
        }
        else {
            var sql = "INSERT INTO Pagamento (valor, cpfJogador, data) VALUES ?";
            var values = [[pagamento.valor, pagamento.cpf, pagamento.data]];
            con.query(sql, [values], function (err, resultado) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Number of records inserted" + resultado.affectedRows);
                    res.json({ message: "Pagamento Cadastrado", code: 200 })
                }
            });

        }
    });


}

api.listaPagamentos = function (req, res) {
    con.query('SELECT * FROM Pagamento', function (err, results) {
        if (err) throw error;
        res.json(results);
    });


}

api.listaJogadores = function (req, res) {
    con.query('select * from jogador order by nome', function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    });
}

api.listaJogadoresPagos = function (req, res) {
    con.query(`select * from jogador 
         where exists(select * from pagamento 
         where pagamento.cpfJogador = jogador.cpf 
        AND DATEDIFF(CURDATE(), pagamento.data) < 30);`, function (error, results) {
            if (error) throw error;
            res.json(results);
        });
}


function validarNomeSemNumeros(texto) {
    return !!texto.match(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/);
}

function ValidarCpf(cpf) {
    return !!cpf.match(/^[0-9]{11}$/);
}

function validarIdade(idade) {
    return !!idade.match(/^[0-9]{2}$/);
}

api.inserirJogador = function (req, res) {

    if (req.body.nome !== undefined) {
        retornoValidacao = validarNomeSemNumeros(req.body.nome);
        if (!retornoValidacao) {
            res.json({ code: 509, message: "O nome não está no padrão para ser salvo" });
            return;
        }
    } else {
        res.json({ code: 509, message: "O nome não pode ser vazio." });
        return;
    }

    if (req.body.cpf !== undefined) {
        retornoValidacao = ValidarCpf(req.body.cpf);
        if (!retornoValidacao) {
            res.json({ code: 509, message: "O cpf deve ter 11 caracteres e sendo apenas números." });
            return;
        }
    } else {
        res.json({ code: 509, message: "O cpf não pode ser vazio" });
        return;
    }

    if (req.body.telefone !== undefined) {
        retornoValidacao = ValidarCpf(req.body.telefone);
        if (!retornoValidacao) {
            res.json({ code: 509, message: "O número deve ter 11 caracteres e sendo 2 do ddd, e 9 referente ao telefone, todos númericos" });
            return;
        }
    } else {
        res.json({ code: 509, message: "O telefone não pode ser vazio." });
        return;
    }


    if (req.body.idade !== undefined) {
        if (req.body.idade > 0) {
            let idade = `${req.body.idade}`;
            if (idade.length < 2) {
                res.json({ code: 509, message: "A idade deve ter apenas 2 caracteres e todos númericos" });
                return;
            }
        } else {
            res.json({ code: 509, message: "A idade não pdoe ser negativa" });
            return;
        }
    } else {
        res.json({ code: 509, message: "A idade não pode ser vazio." });
        return;
    }


    jogador = req.body;

    var sql = "INSERT INTO JOGADOR (cpf, nome, idade, nota, telefone) VALUES ?";
    var values = [[jogador.cpf, jogador.nome, jogador.idade, 0, jogador.telefone]];

    con.query(sql, [values], function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("Number of records inserted: " + result.affectedRows);
            res.json({ message: "Jogador cadastrado", code: 200 });
        }

    });
}

api.deletarJogador = function (req, res) {
    con.query('DELETE FROM jogador where cpf = ' + req.params.cpf, function (error, results, fields) {
        if (error) {
            console.log(error);
        } else {
            console.log(results.affectedRows);
            res.json({ code: 200, message: "Jogador apagado com sucesso" });
        }
    });
}


api.listarTimes = function (req, res) {
    con.query('SELECT * from time order by nome', function (err, results) {
        if (err) throw err;

        res.json(results);
    })

}

api.pegarIdTime = function (req, res) {

    var nomeTime = req.params.nome;
    console.log(nomeTime);
    var sql = 'select cd_time from time where nome = ?';
    con.query(sql, [nomeTime], function (err, result) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.json({ codigoTime: result[0].cd_time });
        }
    });
}

api.inserirTime = function (req, res) {

    if (req.body.timeUm !== undefined) {
        timeUm = req.body.timeUm;
    } else {
        res.json({ code: 509, message: "Time um não está definido" });
        return;
    }

    if (req.body.timeDois !== undefined) {
        timeDois = req.body.timeDois;
    } else {
        res.json({ code: 509, message: "Time Dois não está definido" });
        return;
    }

    var sql = "INSERT INTO TIME(nome) VALUES ?";
    var values = [[timeUm], [timeDois]];

    con.query(sql, [values], function (err, result) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Number of records inserted: " + result.affectedRows);
            res.json({ message: "Times Cadastrados", code: 200 });
        }

    });




}


api.inserirJogadorTime = function (req, res) {

    time = req.body;
    var values = time.jogadores.map(j => [j.cpf, time.id]);
    var sql = "INSERT INTO TIME_JOGADOR(cpf_jogador, cd_time) VALUES ?";
    con.query(sql, [values], function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log("Number of records inserted: " + results.affectedRows);
            res.json({ message: "Os jogadores pro Time foram cadastrados com sucesso", code: 200 });
        }
    });

}

api.listarTimeJogador = function (req, res) {
    con.query("select * from time_jogador order by cd_time", function (err, result) {
        if (err) throw err;
        res.json(result);
    })
}


api.pontuarJogador = function (req, res) {
    jogador = req.body;

    var sql = "UPDATE Jogador SET nota = " + jogador.nota + " WHERE cpf = " + jogador.cpf;
    con.query(sql, function (err, result) {
        if (err) throw err;

        console.log("Number of records updated: " + result.affectedRows);
        res.json({ message: "Nota para o jogador atualizada", code: 200 });
    });


}

api.verificarCraqueDaPelada = function (req, res) {
    con.query("select nome from jogador where nota = (select MAX(nota) from jogador)", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
}

api.verificarBolaMuchaDaPelada = function (req, res) {
    con.query("select nome from jogador where nota = (select MIN(nota) from jogador)", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
}


api.inserirPartida = function (req, res) {
    partida = req.body;

    var sql = "INSERT INTO PARTIDA(time1, time2, timeVencedor, placar, melhorJogador, piorJogador) VALUES ? ";
    var values = [[partida.time1, partida.time2, partida.timeVencedor, partida.placar, partida.melhorJogador, partida.piorJogador]];

    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);

        res.json({ message: "Partida cadastrada com sucesso", code: 200 });
    })
}

api.listarPartida = function (req, res) {
    con.query("SELECT * from partida order by id_partida", function (err, result) {
        if (err) throw err;
        res.json(result);
    });
}

api.inserirGols = function (req, res) {
    gols = req.body;

    var sql = "INSERT INTO Gols(partida, jogador, gols) VALUES ?";
    var values = [[gols.partida, gols.jogador, gols.gols]];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);

        res.json({ message: "Gols cadastrados com sucesso", code: 200 });

    });
}

api.listarGols = function (req, res) {
    con.query("SELECT * from gols order by partida", function (err, result) {
        if (err) throw err;

        res.json(result);
    });
}

api.criarPartida = (req, res) => {





}


api.golsPorJogadores = function (req, res) {
    con.query("select nome, SUM(gols) gols from gols inner join jogador ON gols.jogador = jogador.cpf group by jogador", function (err, result) {
        if (err) throw err;
        res.json(result);
    })
}

api.golPorJogador = function (req, res) {
    con.query("select nome, SUM(gols) gols from gols inner join jogador ON gols.jogador = jogador.cpf WHERE jogador.cpf = " + req.params.jogador + " group by jogador"
        , function (err, result) {
            if (err) throw err;
            res.json(result);
        });
}




api.jogadorQueFezMaisGols = function (req, res) {
    con.query("select nome from jogador inner join gols ON jogador.cpf = gols.jogador WHERE gols.gols = (select MAX(gols) from gols)", function (err, result) {
        if (err) throw err;
        res.json(result);
    })

}








module.exports = api;