
var renderer;
var camera;
var scene;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var gears = [];
var gearModels = [];
var objectModels = [];
var countUp = 0;


function toggleCanvas() {
  $("#container").css("display", "block");
  // $("#info").css("display", "block");
  $("#loading").css("display", "none");
}

function setLoadLocation(windowWidth, windowHeight) {
  var loadLeft = windowWidth/2;
  var loadTop = windowHeight/2 + 100;
  $('#loading').css("top", loadTop);
  $('#loading').css("left", loadLeft);
}

function setup() {

  //show('container', false);
  // set the scene size
  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight * 0.8;

  setLoadLocation(WIDTH, HEIGHT);    

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
  directionalLight.position.set( 100, 100, 100 );
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

  load_json_obj("data/sample.json");

}

function load_json_obj(filePath){
  $.getJSON(filePath, function(data) {
    objectModels = data.objects;

    for(var i = 0; i < objectModels.length; i++) {
    loadObj(
      objectModels[i].name,
      objectModels[i].objFile,
      objectModels[i].albedoFile,
      objectModels[i].specularFile,
      objectModels[i].normalFile,
      new THREE.Vector3(
        objectModels[i].origin.x,
        objectModels[i].origin.y,
        objectModels[i].origin.z
      ),
      new THREE.Vector3(
        objectModels[i].scale.x,
        objectModels[i].scale.y,
        objectModels[i].scale.z
      ),
      new THREE.Vector3(
        objectModels[i].rotate.x,
        objectModels[i].rotate.y,
        objectModels[i].rotate.z
      )
    );
  }

  });

}

function loadObj(objName, fileName, albedo, spec, norm, pos, scale, rot) {

  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {
      console.log( item, loaded, total );
  };

  var path = 'data/';

  var material  = new THREE.MeshPhongMaterial()

  if(albedo !== "") {
    material.map = THREE.ImageUtils.loadTexture(path + albedo);
    material.transparent = true;
  }

  if(spec !== "") {
    material.specularMap = THREE.ImageUtils.loadTexture(path + spec);
    material.specular  = new THREE.Color('white');
  }

  if(norm != "") {
    material.normalMap = THREE.ImageUtils.loadTexture(path + norm);
    normalScale: new THREE.Vector2( 0.5, 0.5 );
  }

  var loader = new THREE.OBJLoader();
      loader.load(path + fileName, function(object) {
         object.scale.set(scale.x, scale.y, scale.z);
         object.rotation.set(rot.x, rot.y, rot.z);
         object.name = fileName;
         object.position.set(pos.x, pos.y, pos.z);
         object.children[0].material = material;
         object.children[0].geometry.name = objName;
         console.log(objName);
         scene.add( object );
         
         countUp += 1; //keep track of objects loaded

         if(countUp == objectModels.length) {
            render();
            toggleCanvas();
         }
         
      });
 
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
  renderer.render(scene, camera);
}

function onMouseMove( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1    

}

function onMouseClick (event) {
   mouseRayCast();
}

function mouseRayCast() {
   // update the picking ray with the camera and mouse position  
  raycaster.setFromCamera( mouse, camera ); 

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects(scene.children, true);
  var selectedColor = new THREE.Color( 0xff0000 );
  var intersectedObj = "";

  for (var i = 0; i < intersects.length; i++) {
    
    intersectedObj = intersects[i].object.geometry.name;
    break;

    // if(intersects[i].object.material.color.r == selectedColor.r
    //   && intersects[i].object.material.color.g == selectedColor.g
    //    && intersects[i].object.material.color.b == selectedColor.b) {
    //   intersects[i].object.material.color = new THREE.Color( 0xffffff );
    // } else {
    //     intersects[i].object.material.color = selectedColor;
    // }
  }

  $("#name").html(intersectedObj);

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


