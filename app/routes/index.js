var api = require('../api');

module.exports  = function(app) {
    
    app.get('/api/cargainicial', api.scriptInicial);

    app.get('/', (req, res) => {
        res.write('Bem vindo api nossa pelada.');
        res.end();
    });

    app.route('/api/jogador/')
    .get(api.listaJogadores)
    .post(api.inserirJogador);
   

    app.route('/api/jogador/:cpf')
    .delete(api.deletarJogador);

    app.route('/api/pagamento/')
    .get(api.listaPagamentos);

    app.route('/api/pagamento/')
    .post(api.cadastraPagamento);

    app.route('/api/jogadoresPagos')
    .get(api.listaJogadoresPagos);

    app.route('/api/time')
    .post(api.inserirTime);

    app.route('/api/jogadorTime')
    .post(api.inserirJogadorTime);

    app.route('api/pontuarJogador')
    .put(api.pontuarJogador);

};