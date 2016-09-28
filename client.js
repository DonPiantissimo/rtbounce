var logic = {};
var graphics = {};

var test =0;

window.onload = function() {
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
	

	logic = new game_logic(start);
	graphics = new game_graphics(start);
	graphics.create_scene();	
        //graphics.setObstacles(start.obstacles);
	draw();

	
};
/*
function makeObstacles(){
    var obstacleWidth =40, fieldWidth = 400,fieldHeight=200,     obstacleHeight = 10,
    obstacleDepth = 10;
    
    var obstacle = [
        {pos:{x:-7 * fieldWidth / 16 + obstacleWidth,y:1 * fieldHeight / 4} },
        {pos:{x:-7 * fieldWidth / 16 + obstacleWidth,y:-1 * fieldHeight / 4} },
        {pos:{x:-7 * fieldWidth / 16 + obstacleWidth,y:0} },
        {pos:{x:-4 * fieldWidth / 16 + obstacleWidth,y:0.5 * fieldHeight / 4} },
        {pos:{x:-4 * fieldWidth / 16 + obstacleWidth,y:-0.5* fieldHeight / 4} },
        {pos:{x:-4 * fieldWidth / 16 + obstacleWidth,y:1.5* fieldHeight / 4} },
        {pos:{x:-4 * fieldWidth / 16 + obstacleWidth,y:-1.5* fieldHeight / 4} },
        {pos:{x:-1 * fieldWidth / 16 + obstacleWidth,y:1* fieldHeight / 4} },
        {pos:{x:-1 * fieldWidth / 16 + obstacleWidth,y:-1* fieldHeight / 4} },
        {pos:{x:3 * fieldWidth / 16 + obstacleWidth,y:0.4* fieldHeight / 4} },
        {pos:{x:3 * fieldWidth / 16 + obstacleWidth,y:-0.4* fieldHeight / 4} },
        {pos:{x:3 * fieldWidth / 16 + 2*obstacleWidth,y:-0.4* fieldHeight / 4} },
        {pos:{x:3 * fieldWidth / 16 + 2*obstacleWidth,y:-0.4* fieldHeight / 4} },
        {pos:{x:-1 * fieldWidth / 16 + obstacleWidth,y:0} },
        
        {pos:{x:-1 * fieldWidth / 16 + 0.5 * (obstacleWidth + obstacleHeight),y:fieldHeight / 4 + 0.5 * (obstacleWidth + obstacleHeight)} },
        {pos:{x:-1 * fieldWidth / 16 + 0.5 * (obstacleWidth + obstacleHeight),y:-fieldHeight / 4 - 0.5 * (obstacleWidth + obstacleHeight)} },
        {pos:{x:3 * fieldWidth / 16 + 0.5 * (obstacleWidth + obstacleHeight),y:0.4 * fieldHeight / 4 + 0.8 * (obstacleWidth + obstacleHeight)} },
        {pos:{x:3 * fieldWidth / 16 + 0.5 * (obstacleWidth + obstacleHeight),y:-0.4 * fieldHeight / 4 - 0.8 * (obstacleWidth + obstacleHeight)} }
        
    ];
        for (var i=0;i<14;i++){
            obstacle[i].width = obstacleWidth;
            obstacle[i].height = obstacleHeight;
            obstacle[i].depth = obstacleDepth;
            
        }
        for (var i=14;i<18;i++){
            obstacle[i].width = obstacleHeight;
            obstacle[i].height = 1.4*obstacleWidth;
            obstacle[i].depth = obstacleDepth;
        }
        
        for (var i=0;i<18;i++){
            obstacle[i].ver_min = obstacle[i].bottom = obstacle[i].pos.y - obstacle[i].height/2;
            obstacle[i].ver_max = obstacle[i].top = obstacle[i].pos.y + obstacle[i].height/2;
            obstacle[i].hor_max = obstacle[i].right = obstacle[i].pos.x + obstacle[i].width/2;
            obstacle[i].hor_min = obstacle[i].left = obstacle[i].pos.x - obstacle[i].width/2;
            
            
        }
        return obstacle;
    
};
*/
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
        if (logic.players.self.ball.color_updated){
            graphics.update_ball_color(true, logic.players.self.ball.color);
            logic.players.self.ball.color_updated = false;
        }
        if (logic.players.other.ball.color_updated) {
            graphics.update_ball_color(false, logic.players.other.ball.color);
            logic.players.other.ball.color_updated = false;
        }
        graphics.renderer.render(graphics.scene, graphics.camera);
	graphics.ballUpdate(logic.players.self.ball, logic.players.other.ball);
	graphics.theCamera();
	requestAnimationFrame(draw);
};
