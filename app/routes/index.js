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

};