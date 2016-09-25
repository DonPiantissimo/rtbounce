 //   global.window = global.document = global;

var game_logic = function (start) {
	this.players = {
		self : new game_player(start)
			};	

	this.constants = {
		mouse_speed : 0.02,
		ball_speed : start.speed,
		ball_radius : start.radius, //used for limits, slightly smaller than visual radius
		field_width : start.planeWidth,
		field_height : start.planeHeight,
		fps : (1/60)*1000
			};
	
	this.obstacles = [];
	this.set_obstacles(start.obstacles);
	this.update_time = Date.now();
        this.connect();
};



//if( 'undefined' != typeof global ) {
//    global.game_logic = game_logic;
//}



var game_player = function (start) {
	this.ball = {
		pos : {
			x: start.self.x,
			y: start.self.y
			},
		angle : 0,
		arrow : {
			active : false,
			angle : Math.PI/2,
			last_rot : 0 
			},
		hor_speed : 0,
		ver_speed : 0
		};
	this.inputs = [];
	this.input_seq = 0;
//	this.input_seq = {
//			start: 0,
//			checked: 0,
//			end:0
//		};
	
	//this.input_log = [];
	this.input_log = {};
	this.mouseDown = false;	
	};

var input_log_node = function (angle,time,seq) {
	this.angle = angle;
	this.time = time;
	this.seq = seq;
	this.apply_time = {start : 0, end : 0};
	this.next = null;
};

game_logic.prototype.set_obstacles = function(obst) {
	var out_limits = {
			bottom : this.constants.field_height/2,
			top : -this.constants.field_height/2,			
			right : -this.constants.field_width/2,
			left : this.constants.field_width/2,
			hor_max : this.constants.field_width/2,
			hor_min : -this.constants.field_width/2,
			ver_max : this.constants.field_height/2,
			ver_min : -this.constants.field_height/2
			};
	this.obstacles.push(out_limits);

	if (obst)
	for (var i=0;i<obst.length;i++)
		this.obstacles.push(obst[i]);
};

game_logic.prototype.check_obstacle_collision = function(player) {
	var obstacle_check;
	for (var i=0;i<this.obstacles.length;i++){
		obstacle_check = this.obstacles[i];
		if (player.ball.pos.x > obstacle_check.hor_min && player.ball.pos.x < obstacle_check.hor_max &&
			(
				((player.ball.pos.y <= obstacle_check.bottom) && ((player.ball.pos.y + this.constants.ball_radius) >= obstacle_check.bottom) && (player.ball.ver_speed > 0))
					||
			   	((player.ball.pos.y >= obstacle_check.top) && ((player.ball.pos.y - this.constants.ball_radius) <= obstacle_check.top) && (player.ball.ver_speed < 0))
			)
		   )
				player.ball.ver_speed = -player.ball.ver_speed;
						
		
		if (player.ball.pos.y > obstacle_check.ver_min && player.ball.pos.y < obstacle_check.ver_max &&
			(
				((player.ball.pos.x <= obstacle_check.left) && ((player.ball.pos.x + this.constants.ball_radius) >= obstacle_check.left) && (player.ball.hor_speed > 0))
					||
			   	((player.ball.pos.x >= obstacle_check.right) && ((player.ball.pos.x - this.constants.ball_radius) <= obstacle_check.right) && (player.ball.hor_speed < 0))
			)
		   )
				player.ball.hor_speed = -player.ball.hor_speed;
						
	}

};


/*game_logic.prototype.apply_inputs = function(player) {
	if (player.inputs[0]) {
            if (player.inputs[0].mouse_down || player.ball.arrow.active) {
                player.ball.arrow.active = true;
                var i=0;
		while (player.inputs[i] && player.inputs[i].mouse_down)
			i++;
		player.ball.arrow.angle = this.get_angle(player.inputs[i-1],player.ball.pos);
		if (player.inputs[i]) { //meaning we exited while because mouse is not down
			player.ball.arrow.active = false;
			player.ball.angle=player.ball.arrow.angle;
			this.launch_ball(player);
			this.shift_inputs(player,i+1);
		}
            }
            else {
                this.shift_inputs(player,1);
            }
            player.inputs = []; //inputs have been handled, reset them
        }
};

game_logic.prototype.shift_inputs = function(player,pos){
    while (player.inputs[pos] && !player.inputs[pos].mouse_down)
        pos++;
    if (player.inputs[pos]){
        player.inputs.splice(0,pos);
        this.apply_inputs(player);
    }
};*/

game_logic.prototype.apply_inputs = function(player){
    
    if (player.inputs[0]) {
        var i=0;
        if (player.inputs[0].mouse_down){
            player.ball.arrow.active = true;
            i=this.getLastInput(player,1);
            player.ball.arrow.angle = this.get_angle(player.inputs[i],player.ball.pos);
            i++;
        }
        if (player.inputs[i] && player.ball.arrow.active){
        //means it's a mouse up input
            player.ball.angle = player.ball.arrow.angle = this.get_angle(player.inputs[i],player.ball.pos);

	//list log	    
	    if (player.input_log.head){
		player.input_log.tail.next = new input_log_node(player.ball.angle,player.inputs[i].time, player.input_seq+1);
		player.input_log.tail = player.input_log.tail.next;
		player.input_seq++; 
		}
	    else {
		player.input_log.head = new input_log_node(player.ball.angle,player.inputs[i].time,player.input_seq);
		player.input_log.tail = player.input_log.head;
		player.input_seq++;
		}

	//array log
	    //player.input_seq.end++;
	    //player.input_log[player.input_seq.end] = {angle: player.ball.angle, time: player.inputs[i].time, seq: player.input_seq.end};
	    
	    this.launch_ball(player);
            player.ball.arrow.active = false;
            if (this.cleanDeadInputs(player,i+1))
                this.apply_inputs(player);
        }
        player.inputs = [];
    }
};

game_logic.prototype.apply_input = function(player, input){
	if (input.mouse_down) {
		player.ball.arrow.active=true;
		player.ball.arrow.angle = this.get_angle(input, player.ball.pos);
	}
	else if (player.ball.arrow.active){
		player.ball.angle = player.ball.arrow.angle = this.get_angle(input, player.ball.pos);

		//list log
		if (player.input_log.head){
			player.input_log.tail.next = new input_log_node(player.ball.angle,input.time, player.input_seq+1);
			player.input_log.tail = player.input_log.tail.next;
			player.input_seq++; 
			}
		else {
			player.input_log.head = new input_log_node(player.ball.angle,input.time,player.input_seq);
			player.input_log.tail = player.input_log.head;
			player.input_seq++;
			}
		

		//array log
		//player.input_seq.end++;
		//player.input_log[player.input_seq.end] = {angle: player.ball.angle, time: input.time, apply_time: 0, seq: player.input_seq.end, active : false};
                this.socket.send(Date.now()+'');
		this.launch_ball(player);
		player.ball.arrow.active = false;
	}
};

game_logic.prototype.getLastInput = function(player,pos){
    while (player.inputs[pos] && player.inputs[pos].mouse_down)
        pos++;
    return(pos-1);
};

game_logic.prototype.cleanDeadInputs = function(player,pos){
    
    while (player.inputs[pos] && !player.inputs[pos].mouse_down)
        pos++;
    player.inputs.splice(0,pos);
    if (player.inputs[0]) return true;
    return false;
};


game_logic.prototype.physics_update = function(player) {
        //document.getElementById("scores").innerHTML = this.players.self.ball.ver_speed + "-" + this.players.self.ball.pos.y;
	document.getElementById("scores").innerHTML = this.players.self.ball.ver_speed + "-" + this.players.self.ball.hor_speed;
	
	//this.apply_inputs(player);
	
	var curdate = Date.now();

	//list log
	if (player.input_log.head && !player.input_log.tail.apply_time.start){
		player.input_log.tail.apply_time.start = this.update_time;
		player.input_log.tail.apply_time.end = curdate;
	}
	
	//array log	
	//if (player.input_log[player.input_seq.end].apply_time)
	//	player.input_log[player.input_seq.end].apply_time = curdate;

	var dt = curdate - this.update_time;
	this.update_time = curdate;
	player.ball.pos.x += player.ball.hor_speed*dt;
	player.ball.pos.y += player.ball.ver_speed*dt;
	this.check_obstacle_collision(player);	
	};
        
game_logic.prototype.server_physics_update = function() {
    
    var curdate = Date.now() - this.server_delay;
    
    var seq = this.server_angle(this.players.self);
    
    var dt = curdate - this.update_time;
    this.players.self.ball.pos.x += this.players.self.ball.hor_speed*dt;
    this.players.self.ball.pos.y += this.players.self.ball.ver_speed*dt;
    this.check_obstacle_collision(this.players.self);
    
    //send data
};

game_logic.prototype.client_correction = function(player,proc_inputs){
	player.ball.pos.x = proc_inputs.pos.x;
	player.ball.pos.y = proc_inputs.pos.y;
	player.ball.angle = proc_inputs.angle;
	this.launch_ball(player);
	while (player.input_log.head.seq<proc_inputs.seq)
		player.input_log.head = player.input_log.head.next;

	var time_processed = proc_inputs.time;
	var input_processing = player.input_log.head;
	var dt;
	while (input_processing){
		dt =this.constants.fps; 
		while (time_processed<input_processing.apply_time.start){
			time_processed+=this.ball_step(player,dt);
		}
		dt=input_processing.apply_time.start-time_processed;
		player.ball.pos.x +=player.ball.hor_speed*dt;
		player.ball.pos.y +=player.ball.ver_speed*dt;
		time_processed = input_processing.apply_time.start;		

		dt=input_processing.apply_time.end - input_processing.apply_time.start;
		player.ball.angle = input_processing.angle;
		this.launch_ball(player);

		time_processed+=this.ball_step(player,dt);

		input_processing = input_processing.next;
	}

	dt = this.constants.fps;
	while(time_processed<this.update_time-dt){
		time_processed += this.ball_step(player,dt);
	}
	this.ball_step(player,this.update_time - time_processed);	
};

game_logic.prototype.ball_step = function(player,dt){
	player.ball.pos.x += player.ball.hor_speed*dt;
	player.ball.pos.y += player.ball.ver_speed*dt;
	this.check_obstacle_collision(player);
	return dt;
};

game_logic.prototype.get_angle = function(positions_end, positions_start) { return Math.atan((positions_end.y-positions_start.y)/(positions_end.x-positions_start.x));};
game_logic.prototype.launch_ball = function(player) {
        player.ball.hor_speed = Math.cos(player.ball.angle) * this.constants.ball_speed;
	player.ball.ver_speed = Math.sin(player.ball.angle) * this.constants.ball_speed;
};

game_logic.prototype.connect = function() {
    this.socket = io.connect();
    
    this.socket.on('connect',function(){
       this.players.self.state = 'connecting';
    }.bind(this));
    
    //this.socket.on('onconnected', this.onconnected.bind(this));
};

