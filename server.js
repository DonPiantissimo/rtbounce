var server = module.exports = {games : {}, game_count: 0},
        UUID        = require('node-uuid');

global.window = global.document = global;

require('./game.logic.js');

UUID        = require('node-uuid');

server.createGame = function(player){
    	var p_width = 400;
	var p_height = 200;
	var ball_radius = 5;
        
    	var start = {
		speed : 0.1,
		radius : ball_radius,
		self : {
			x : -p_width / 2 + 8 * ball_radius,
			y : p_height / 8,
			rotation : Math.PI/2
			},
		obstacles : {},
		height : 480,
		width : 720,
		obstacle_depth : 10,
		wall_depth : 20,
		planeWidth : p_width,
		planeHeight : p_height
	};
    start.host = player;
    this.logic = new game_logic(start);
    player.send('p');
    this.draw();
};

server.draw = function (){
    setInterval(this.logic.server_physics_update.bind(this.logic),15);
};

server.onMessage = function(player, data){
    //console.log(data);
    var message = data.split('-');
    //console.log(parseFloat(message[1]));
    switch(message[0]) {
        case 'p': var ping = 3*(Date.now() - parseFloat(message[1]));
                //console.log(this.logic.players.self.ping);
                
                if (player.game.logic.server_delay<ping)
                    player.game.logic.server_delay = ping;
            break;
        case 'i':
                player.game.logic.server_handle_input(player,{angle: parseFloat(message[1]), time: parseFloat(message[2]), seq: parseInt(message[3]), apply_time : 0});
                
        break;
        
        case 's' : if (player.game.player_start)
                        player.game.logic.server_update();
                    else
                        player.game.player_start++;
        break;
    }
    
};

server.find_game = function(player){
    if(this.game_count){
        var joined = false;
        for (var gameid in this.games){
            if(!this.games.hasOwnProperty(gameid)) continue;
            var game_instance = this.games[gameid];
            if (game_instance.player_count<2){
                joined = true;
                game_instance.player_client = player;
                game_instance.logic.players.other.instance = player;
                game_instance.player_count++;
                
                game_instance.player_client.game = game_instance;
                game_instance.logic.players.other.instance = player;
                game_instance.player_client.send('p-c');
                game_instance.player_client.send('s');
                game_instance.player_host.send('s');
                
                
                game_instance.active = true;
                
                //this.startGame(game_instance);
            }
        }
        
        if(!joined)
            this.create_game(player);
        
    } else
        this.create_game(player);
};

server.create_game = function(player){
    var thegame = {
        id : UUID(),
        player_host : player,
        player_client : null,
        player_count : 1,
        player_start : 0
    };
    var p_width = 400;
    var p_height = 200;
    var ball_radius = 5;

    var start = {
        speed: 0.1,
        radius: ball_radius,
        self: {
            x: -p_width / 2 + 8 * ball_radius,
            y: p_height / 8,
            rotation: Math.PI / 2
        },
        obstacles: {},
        height: 480,
        width: 720,
        obstacle_depth: 10,
        wall_depth: 20,
        planeWidth: p_width,
        planeHeight: p_height,
        game_instance : thegame
    };
    
    this.games[thegame.id] = thegame;
    this.game_count++;
    thegame.logic = new game_logic(start);
    player.game = thegame;
    player.hosting = true;
    player.send('p-h');
    
    
    return thegame;
};