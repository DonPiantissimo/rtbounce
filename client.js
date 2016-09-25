var logic = {};
var graphics = {};

var test =0;

window.onload = function() {
	var p_width = 400;
	var p_height = 200;
	var ball_radius = 5;

	var start = {
		speed : 0.15,
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
	

	logic = new game_logic(start);
	graphics = new game_graphics(start);
	graphics.create_scene();	
	draw();

	
};



document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

document.onmousedown = function () {
    logic.players.self.mouseDown = true;
};
document.onmouseup = function () {
    logic.players.self.mouseDown = false;
};


function onMouseUpdate(e) {
    if (logic.players.self.mouseDown || logic.players.self.ball.arrow.active){
	input = {mouse_down : logic.players.self.mouseDown, x : e.pageX, y : e.pageY, time : Date.now()};
	//logic.players.self.inputs.push({mouse_down : logic.players.self.mouseDown, x : e.pageX, y : e.pageY, time : Date.now()});
	logic.apply_input(logic.players.self,input);
	}
}

function draw(){
//	if (logic.players.self.inputs[0])
//		document.getElementById("scores").innerHTML = logic.players.self.inputs[logic.players.self.inputs.length-1].x + "-" + logic.players.self.inputs.length;

	logic.physics_update(logic.players.self);
        graphics.renderer.render(graphics.scene, graphics.camera);
	graphics.ballUpdate(logic.players.self.ball);
	graphics.theCamera();
	requestAnimationFrame(draw);
};
