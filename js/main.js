
var renderer;
var camera;
var scene;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var gears = [];
var gearModels = [];

function setup() {
  // set the scene size
  var WIDTH = window.innerWidth * 0.9,
      HEIGHT = window.innerHeight * 0.7;

  // set some camera attributes
  var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

  // get the DOM element to attach to
  // - assume we've got jQuery to hand
  var $container = $('#container');

  // create a WebGL renderer, camera
  // and a scene
  renderer = new THREE.WebGLRenderer();
  camera = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);

  scene = new THREE.Scene();
  // add the camera to the scene
  scene.add(camera);

  // the camera starts at 0,0,0
  // so pull it back
  camera.position.z = 300;

  //Orbit Control
  controls = new THREE.OrbitControls( camera );
  controls.maxDistance = 1000;

   // create light
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
  directionalLight.position.set( 0, 1, 0.3 );
  scene.add( directionalLight );
  var amblight = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( amblight );

 
  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  $container.append(renderer.domElement);

  // draw!
  renderer.render(scene, camera);
  animate();
  var origin = new THREE.Vector3(0, 0, 0);
  var cabinetScale = new THREE.Vector3(8, 8, 8);
  var cabinetRot = new THREE.Vector3(0, 0, 0);

  loadObj("lowpoly.obj", origin, cabinetScale, cabinetRot, new THREE.Color("rgb(200,200,200)"));

  //load sample gears
    var gearScale = new THREE.Vector3(500, 500, 500);
    var gear1 = new Gear(50);
    gear1.name = "gear0";
    var gear2 = new Gear(100);
    gear2.name = "gear1";
    var gear3 = new Gear(50);
    gear3.name = "gear2";
    console.log(gear2);

    addToSisters(gear1, gear2);
    addToChildren(gear2, gear3);


    gears.push(gear2);
    gears.push(gear1);
    gears.push(gear3);
    for(var i =0 ;i < gears.length; i++) {
      loadObj("gear" + i + ".obj", new THREE.Vector3((i-1) * 50, -50, 100), 
        gearScale, new THREE.Vector3(0, 0, 0), new THREE.Color("rgb(" + i * 50 + ",0,0)"));
    }
}



function loadObj(fileName, pos, scale, rot, col) {

var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
};

var material  = new THREE.MeshPhongMaterial()
material.map = THREE.ImageUtils.loadTexture('data/Orrery_albedo.png');
material.specularMap = THREE.ImageUtils.loadTexture('data/Orrery_gloss.png');
material.specular  = new THREE.Color('white');
material.bumpMap    = THREE.ImageUtils.loadTexture('data/Orrery_bump.png')
material.bumpScale = 0.05

var loader = new THREE.OBJLoader();
    loader.load('data/' + fileName, function(object) {
       object.scale.set(scale.x, scale.y, scale.z);
       object.rotation.set(rot.x, rot.y, rot.z);
       object.name = fileName;
       object.position.set(pos.x, pos.y, pos.z);
       console.log(object);
       object.children[0].material = material;
       scene.add( object );
    });

 render();
}

function putSphere(pos) {
  // set up the sphere vars
var radius = 20,
    segments = 16,
    rings = 16;

// create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!

// create the sphere's material
var sphereMaterial =
  new THREE.MeshLambertMaterial(
    {
      color: 0xCCCCCC
    });

var sphere = new THREE.Mesh(

  new THREE.SphereGeometry(
    radius,
    segments,
    rings),

  sphereMaterial);

// add the sphere to the scene
sphere.position.set(pos.x, pos.y, pos.z);
scene.add(sphere);
render();

}

function animate() {

  requestAnimationFrame( animate );
  controls.update();
  render();

}

function render() {

  renderer.render( scene, camera );
}

function onMouseMove( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1    

}

function onMouseClick (event) {
  // mouseRayCast();
}

function mouseRayCast() {
   // update the picking ray with the camera and mouse position  
  raycaster.setFromCamera( mouse, camera ); 

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects(scene.children, true);
  var selectedColor = new THREE.Color( 0xff0000 );

  for (var i = 0; i < intersects.length; i++) {
    console.log("intersected!");

    if(intersects[i].object.material.color.r == selectedColor.r
      && intersects[i].object.material.color.g == selectedColor.g
       && intersects[i].object.material.color.b == selectedColor.b) {
      
      intersects[i].object.material.color = new THREE.Color( 0xffffff );
  
    } else {
        intersects[i].object.material.color = selectedColor;
    }
  }
  render();

}

function crank() {
 
  //gear 1 is mother gear
  interact(gears[1],10);

  for(var i =0 ;i < gears.length; i++) {
    var object = scene.getObjectByName( "gear" + i + ".obj", true );
    object.rotation.z = gears[i].rotateNum * Math.PI/180;
  }
}

window.addEventListener('mousemove', onMouseMove, false );
window.addEventListener('click', onMouseClick, false );

window.requestAnimationFrame(render);


