var game_graphics = function(start){
	
	this.ball_values = {
		radius: start.radius,
		self : {
			pos : {
				x: start.self.x,
				y: start.self.y
				},
			rotation : start.self.rotation,
			color : 0xD43001
			},
		segments : 6,
		rings : 6
		};

	this.world = {
		height : start.height,
		width : start.width
		};

	this.plane_constants = {
		width : start.planeWidth,
		height : start.planeHeight,
		quality : 10,
		color : 0x4BD121
		};

	this.camera_constants = {
		view_angle : 50,
		aspect : this.world.width / this.world.height,
            	near : 0.1,
            	far : 1000,
		z_pos : 320
		};

	this.obstacle_constants = {
		obstacle_depth : start.obstacle_depth,
		wall_depth : start.wall_depth,
		wall_color : 0xFF4045
		};
};



game_graphics.prototype.create_scene = function() {
	
	this.doc = document.getElementById('gameCanvas');

	this.renderer = new THREE.WebGLRenderer();

        this.camera = new THREE.PerspectiveCamera(
            this.camera_constants.view_angle,
            this.camera_constants.aspect,
            this.camera_constants.near,
            this.camera_constants.far);

        this.scene = new THREE.Scene();
	
	this.scene.add(this.camera);

	this.camera.position.z = this.camera_constants.z_pos;

	this.renderer.setSize(this.world.width, this.world.height);
	
	this.doc.appendChild(this.renderer.domElement);



	var planeMaterial =
            new THREE.MeshLambertMaterial(
                    {
                        color: this.plane_constants.color
                    });

	var plane = new THREE.Mesh(
            new THREE.PlaneGeometry(
                    this.plane_constants.width,
                    this.plane_constants.height,
                    this.plane_constants.quality,
                    this.plane_constants.quality),
            planeMaterial);

	this.scene.add(plane);

	this.ball = {};

	var selfSphereMaterial =
        new THREE.MeshLambertMaterial(
                 {
                     color: this.ball_values.self.color
                 });
	
	this.ball.self = new THREE.Mesh(
            new THREE.SphereGeometry(
                    this.ball_values.radius,
                    this.ball_values.segments,
                    this.ball_values.rings),
            selfSphereMaterial);

	this.scene.add(this.ball.self);

    	this.ball.self.position.x = this.ball_values.self.pos.x;
    	this.ball.self.position.y = this.ball_values.self.pos.y;
    	// set ball above the table surface
    	this.ball.self.position.z = this.ball_values.radius;
    	this.ball.self.rotation.z = this.ball_values.self.rotation;

    	var pointLight =
            	new THREE.PointLight(0xF8D898);

    	// set its position
    	pointLight.position.x = -1000;
    	pointLight.position.y = 0;
    	pointLight.position.z = 1000;
    	pointLight.intensity = 2.9;
    	pointLight.distance = 10000;
    	// add to the scene
    	this.scene.add(pointLight);

	this.makeWalls();
};

game_graphics.prototype.theCamera = function() {
    this.camera.position.x = this.ball.self.position.x - 100;
    this.camera.position.y += (this.ball.self.position.y - this.camera.position.y) * 0.05;
// this.camera.position.y =this.ball.self.position.y; //static camera
    this.camera.position.z = this.ball.self.position.z + 100;

    this.camera.rotation.x = -0.01 * (this.ball.self.position.y) * Math.PI / 180;
// this.camera.rotation.x = 0; //static camera
    this.camera.rotation.y = -60 * Math.PI / 180;
    this.camera.rotation.z = -90 * Math.PI / 180;
};

game_graphics.prototype.ballUpdate = function(physBall) {
	this.ball.self.position.x = physBall.pos.x;
	this.ball.self.position.y = physBall.pos.y;
	this.ball.self.rotation.z = physBall.angle;
};

game_graphics.prototype.makeWalls = function() {
    var verwall1, verwall2, horwall1, horwall2;
    var verwallwidth = 1;
    var verwallheight = this.plane_constants.height;
    var horwallwidth = this.plane_constants.width;
    var horwallheight = 1;
    var walldepth = this.obstacle_constants.wall_depth;

    var wallMaterial =
            new THREE.MeshLambertMaterial(
                    {
                        color: this.obstacle_constants.wall_color
                    });

    verwall1 = new THREE.Mesh(
            new THREE.CubeGeometry(
                    verwallwidth,
                    verwallheight,
                    walldepth,
                    this.obstacle_constants.obstacleQuality,
                    this.obstacle_constants.obstacleQuality,
                    this.obstacle_constants.obstacleQuality
                    ), wallMaterial);
    this.scene.add(verwall1);

    verwall2 = new THREE.Mesh(
            new THREE.CubeGeometry(
                    verwallwidth,
                    verwallheight,
                    walldepth,
                    this.obstacle_constants.obstacleQuality,
                    this.obstacle_constants.obstacleQuality,
                    this.obstacle_constants.obstacleQuality
                    ), wallMaterial);
    this.scene.add(verwall2);

    horwall1 = new THREE.Mesh(
            new THREE.CubeGeometry(
                    horwallwidth,
                    horwallheight,
                    walldepth,
                    this.obstacle_constants.obstacleQuality,
                    this.obstacle_constants.obstacleQuality,
                    this.obstacle_constants.obstacleQuality
                    ), wallMaterial);
    this.scene.add(horwall1);

    horwall2 = new THREE.Mesh(
            new THREE.CubeGeometry(
                    horwallwidth,
                    horwallheight,
                    walldepth,
                    this.obstacle_constants.obstacleQuality,
                    this.obstacle_constants.obstacleQuality,
                    this.obstacle_constants.obstacleQuality
                    ), wallMaterial);
    this.scene.add(horwall2);

    verwall1.position.z = walldepth / 4;
    verwall2.position.z = walldepth / 4;
    horwall1.position.z = walldepth / 4;
    horwall2.position.z = walldepth / 4;

    verwall1.position.x = -this.plane_constants.width / 2 + verwallwidth * 16;
    verwall2.position.x = this.plane_constants.width / 2 - verwallwidth * 16;
    horwall1.position.x = 0;
    horwall2.position.x = 0;

    verwall1.position.y = 0;
    verwall2.position.y = 0;
    horwall1.position.y = -this.plane_constants.height / 2 + horwallheight * 4;
    horwall2.position.y = this.plane_constants.height / 2 - horwallheight * 4;


};
