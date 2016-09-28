var server = module.exports = {};

global.window = global.document = global;

require('./game.logic.js');

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
        case 'p': this.logic.players.self.ping = 3*(Date.now() - parseFloat(message[1]));
                //console.log(this.logic.players.self.ping);
                
                this.logic.server_delay =this.logic.players.self.ping;
                this.logic.server_delay = 60;
            break;
        case 'i':
                this.logic.server_handle_input({angle: parseFloat(message[1]), time: parseFloat(message[2]), seq: parseInt(message[3]), apply_time : 0});
        break;
    }
    
};