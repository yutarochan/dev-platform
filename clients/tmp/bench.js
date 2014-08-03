jQuery(function($){
depthReady= false;
setup();
/*
 *socket handling
 */
function setup(){
   
    var host = "ws://localhost:9090/ws";
    var socket = new WebSocket(host);
    console.log("socket status: " + socket.readyState);   
    if(socket){
      socket.onopen = function(){
        console.log("connection opened");
				socket.send('get_feed');
      }
      socket.onmessage = function(msg){
       handleServerResponse(msg);
      }
      socket.onclose = function(){
        console.log("connection closed");
      }
    }else{
      console.log("invalid socket");
    }

    function handleServerResponse(txt){
				data = $.parseJSON(txt.data);	
				depthReady = true;
				console.log(data);
		}
  }

// standard global variables
var container, scene, camera, renderer, controls;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
var mesh;

// octree global variables
var octree;
var radiusSearch = 400,
				radius = 500,
				radiusMax = radius * 10,
				radiusMaxHalf = radiusMax * 0.5,
				searchMesh,
				baseR = 255, baseG = 0, baseB = 255,
				foundR = 0, foundG = 255, foundB = 0,
				adding = true;

var meshes = [],
				meshesSearch = [],
				meshCountMax = 1000;

var voxelCounter = 0;

	
init();
animate();

// FUNCTIONS 		
function init() 
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,400);
	camera.lookAt(scene.position);	
	// RENDERER
	
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true,alpha:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.setClearColor( 0xffffff, 1);
	
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	

	//octree

	searchMesh = new THREE.Mesh(
		new THREE.SphereGeometry( radiusSearch ),
		new THREE.MeshBasicMaterial( { color: 0x00FF00, transparent: true, opacity: 0.4 } )
	);
	scene.add( searchMesh );
	
	var geometry = new THREE.SphereGeometry( 30, 32, 16 );
	var material = new THREE.MeshLambertMaterial( { color: 0x000088 } );
	mesh = new THREE.Mesh( geometry, material );
	mesh.position.set(0,40,0);
	scene.add(mesh);

octree = new THREE.Octree( {
	undeferred: false,
	depthMax: Infinity,
	objectsThreshold: 8,
	overlapPct: 0.15,
	scene: scene
} );
	
}

function animate() 
{
  requestAnimationFrame( animate );
	if(depthReady){
		searchOctree(mesh.position);
	}
	render();		
	update();
	octree.update();
}

function update()
{	
	var delta = clock.getDelta(); // seconds.
	var moveDistance = 200 * delta; // 200 pixels per second
	var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
	// local transformations
	// move forwards/backwards/left/right
	if ( keyboard.pressed("W") ){
		mesh.translateZ( -moveDistance );
		console.log('pressed');
	}
	if ( keyboard.pressed("S") )
		mesh.translateZ(  moveDistance );
	if ( keyboard.pressed("Q") )
		mesh.translateX( -moveDistance );
	if ( keyboard.pressed("E") )
		mesh.translateX(  moveDistance );	
	if ( keyboard.pressed("I") )
		modifyOctree();

	// rotate left/right/up/down
	var rotation_matrix = new THREE.Matrix4().identity();
	if ( keyboard.pressed("A") )
		mesh.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
	if ( keyboard.pressed("D") )
		mesh.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
	if ( keyboard.pressed("R") )
		mesh.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
	if ( keyboard.pressed("F") )
		mesh.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
	
	if ( keyboard.pressed("Z") )
	{
		mesh.position.set(0,25.1,0);
		mesh.rotation.set(0,0,0);
	}
	
	var relativeCameraOffset = new THREE.Vector3(0,50,200);

	var cameraOffset = relativeCameraOffset.applyMatrix4( mesh.matrixWorld );

	camera.position.x = cameraOffset.x;
	camera.position.y = cameraOffset.y;
	camera.position.z = cameraOffset.z;
	camera.lookAt( mesh.position );
}

function render() 
{
	renderer.render( scene, camera );
}
//load some depth voxels
function getVoxelSeg(){

//num to load
	var load=10;
	var geometry = new THREE.Geometry();
var counter;
	for ( row = 0; row < data.length; row++ ) {
		console.log('new row');
		counter=0;
		for(cell = 0; cell < data[row].length && cell < voxelCounter+load; cell++){
		
			var vertex = new THREE.Vector3();
			vertex.x = row;
			vertex.y = cell;
			vertex.z = data[row][cell];
			geometry.vertices.push( vertex );
			console.log(vertex);
			voxelCounter++;
			counter++;
		}
		console.log(counter);
	}
return geometry;
}


function modifyOctree() {
	// if is adding objects to octree
	if ( adding === true && depthReady === true) {
	
	// grab a segment of the depth data
	geometry = getVoxelSeg();
	var material = new THREE.ParticleBasicMaterial({
		color: 0xFFFFFF,
		size: 10,
	});
		
		tmp_mesh = new THREE.Mesh( geometry, material );

		// add new object to octree and scene
		octree.add( tmp_mesh );
		scene.add( tmp_mesh );
	
		// store object for later
		meshes.push( tmp_mesh );
	
		// if at max, stop adding
		if ( meshes.length === meshCountMax ) {
		
			adding = false;
		
		}
	
	}
	// else remove objects from octree
	else {
	
		// get object
		tmp_mesh = meshes.shift();
	
		// remove from scene and octree
		scene.remove( tmp_mesh );
		octree.remove( tmp_mesh );
	
		// if no more objects, start adding
		if ( meshes.length === 0 ) {
			adding = true;
		}
	
	}
}


/*
search mesh's 'pos' against octree
*/
function searchOctree(pos) {

	var i, il;
	// revert previous search objects to base color

	for ( i = 0, il = meshesSearch.length; i < il; i++ ) {
	
		meshesSearch[ i ].object.material.color.setRGB( baseR, baseG, baseB );
	
	}
	// new search position
	searchMesh.position.set(
		pos.x,pos.y,pos.z	
	);

	// record start time
	var timeStart = Date.now();

	// search octree from search mesh position with search radius
	// optional third parameter: boolean, if should sort results by object when using faces in octree
	// optional fourth parameter: vector3, direction of search when using ray (assumes radius is distance/far of ray)

	var rayCaster = new THREE.Raycaster( new THREE.Vector3().copy( searchMesh.position ), new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 ).normalize() );
	meshesSearch = octree.search( rayCaster.ray.origin, radiusSearch, true, rayCaster.ray.direction );
	var intersections = rayCaster.intersectOctreeObjects( meshesSearch );

	// record end time
	var timeEnd = Date.now();

	// set color of all meshes found in search

	for ( i = 0, il = meshesSearch.length; i < il; i++ ) {
	
		meshesSearch[ i ].object.material.color.setRGB( foundR, foundG, foundB );
	
	}
/*
	// results to console
	console.log( 'OCTREE: ', octree );
	console.log( '... searched ', meshes.length, ' and found ', meshesSearch.length, ' with intersections ', intersections.length, ' and took ', ( timeEnd - timeStart ), ' ms ' );
*/
}

});
