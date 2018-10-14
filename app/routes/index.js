var api = require('../api');

module.exports  = function(app) {
    
    app.get('/cargainicial', api.scriptInicial);

    app.route('/jogador')
    .get(api.listaJogadores)
    .post(api.inserirJogador)
    .delete(api.deletarJogador);

};