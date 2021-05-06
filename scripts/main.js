function init() {
	var scene = new THREE.Scene();
	var gui = new dat.GUI();

	// initialize objects
	var lightLeft = getSpotLight(0.4, 'rgb(255, 220, 180)');
	var lightRight = getSpotLight(1.25, 'rgb(255, 220, 180)');

	lightLeft.position.x = 6;
	lightLeft.position.y = 8;
	lightLeft.position.z = 12;

	lightRight.position.x = 50;
	lightRight.position.y = 14;
	lightRight.position.z = -6;

	// dat.gui
	var folderLeft = gui.addFolder('Left Light');
	folderLeft.add(lightLeft, 'intensity', 0, 10);
	folderLeft.add(lightLeft.position, 'x', -50, 50);
	folderLeft.add(lightLeft.position, 'y', -50, 50);
	folderLeft.add(lightLeft.position, 'z', -50, 50);

	gui.add(lightRight, 'intensity', 0, 10);
	gui.add(lightRight.position, 'x', -50, 50);
	gui.add(lightRight.position, 'y', -50, 50);
	gui.add(lightRight.position, 'z', -50, 50);

	// add other objects to the scene
	scene.add(lightLeft);
	scene.add(lightRight);

	// camera
	var camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		0.1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 0;
	camera.position.x = 0;
	camera.position.y = 5;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// load external geometry
  
	var loader = new THREE.GLTFLoader();
	loader.load("./assets/kya2.glb", function(object) {
		scene.add(object.scene);
	});
	var textureLoader = new THREE.TextureLoader();

	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	var controls = new THREE.OrbitControls( camera, renderer.domElement );

	document.getElementById('webgl').appendChild(renderer.domElement);

	update(renderer, scene, camera, controls);

	return scene;
}

function getMaterial(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default: 
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}

function getSpotLight(intensity, color) {
	color = color === undefined ? 'rgb(255, 255, 255)' : color;
	var light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	light.shadow.bias = 0.001;

	return light;
}

function update(renderer, scene, camera, controls) {
	controls.update();
	renderer.render(scene, camera);

	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls);
	});
}

var scene = init();