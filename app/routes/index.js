var api = require('../api');

module.exports = function (app) {

    app.get('/api/cargainicial', api.scriptInicial);

    app.get('/', (req, res) => {
        res.write('Bem vindo api nossa pelada.');
        res.end();
    });

    app.route('/api/jogador/')
        .get(api.listaJogadores)
        .post(api.inserirJogador);

    app.route('/api/melhorJogador/')
        .get(api.verificarCraqueDaPelada);

    app.route('/api/piorJogador/')
        .get(api.verificarBolaMuchaDaPelada);

    app.route('/api/jogador/:cpf')
        .delete(api.deletarJogador);

    app.route('/api/pagamento/')
        .get(api.listaPagamentos);

    app.route('/api/pagamento/')
        .post(api.cadastraPagamento);

    app.route('/api/jogadoresPagos')
        .get(api.listaJogadoresPagos);

    app.route('/api/time')
        .get(api.listarTimes)
        .post(api.inserirTime);

    app.get('/api/time/:nome', api.pegarIdTime);

    app.route('/api/timejogador')
        .get(api.listarTimeJogador)
        .post(api.inserirJogadorTime);

    app.route('/api/pontuarJogador/')
        .put(api.pontuarJogador);

    app.route('/api/partida/')
        .get(api.listarPartida)
        .post(api.inserirPartida);

    app.get('/api/partida/:id', api.pegarPartida);

    app.post('/api/partidastart/', api.comecarPartida);

    app.route('/api/gols')
        .get(api.listarGols)
        .post(api.inserirGols);

    app.post('/api/partidaend/', api.encerrarPartida);

    app.get('/api/andamento/', api.verificarPartidaAndamento);

    app.route('/api/golsJogadores')
        .get(api.golsPorJogadores);

    app.route('/api/golsPorJogador/:jogador')
        .get(api.golPorJogador);

    app.route('/api/artilheiro')
        .get(api.jogadorQueFezMaisGols);

};