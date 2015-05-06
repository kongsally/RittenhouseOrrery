
var renderer;
var camera;
var scene;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var gears = [];
var gearModels = [];
var objectModels = [];
var countUp = 0;
var selectedObj;
var selectedObjID;
var txt = 'Hello';

function downloadFunction() {
  txt = JSON.stringify(objectModels);
    document.getElementById('objInfo').href = 'data:text/plain;charset=utf-8,'
        + encodeURIComponent(txt);
}

function setup() {

  //show('container', false);
  // set the scene size
  var WIDTH = window.innerWidth * 0.6,
      HEIGHT = window.innerHeight * 0.65;

  // set some camera attributes
  var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

  // get the DOM element to attach to
  // - assume we've got jQuery to hand
  var $container = $('#container');
  $("#objList").css("height", (window.innerHeight * 0.5).toString() + "px" );

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
  controls = new THREE.OrbitControls( camera, container );
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
  load_json_obj("data/objSetup.json");
 
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
    material.map.minFilter = THREE.LinearFilter;
    material.transparent = true;
  }

  if(spec !== "") {
    material.specularMap = THREE.ImageUtils.loadTexture(path + spec);
    material.specularMap.minFilter = THREE.LinearFilter;
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
         object.name = countUp.toString();
         object.position.set(pos.x, pos.y, pos.z);
         object.children[0].material = material;
         object.children[0].geometry.name = fileName;
         scene.add( object );

         if (countUp == 0) {
          $("#objList").append("<div class='objLoaded' id ='" 
          + countUp + "' onclick=selectObj('" + countUp + "'); >" 
          + fileName + "</div>" +"<div class='accordion-content'>" + 
            "<p id='p" + countUp + "'></p> </div>");
         } else {
            $("#objList").append("<div class='objLoaded' id ='" 
              + countUp + "' onclick=selectObj('" + countUp + "'); >" 
              + fileName + "</div>" + "<div class='accordion-content'>" + 
               "<p id='p" + countUp + "'></p> </div>" );
          }

         countUp += 1; //keep track of objects loaded
         render();
         
      });
 
}

function renderObj(objName, fileName, albedo, spec, norm, pos, scale, rot) {

  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {
      console.log( item, loaded, total );
  };

  var path = "";

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
         object.name = countUp.toString();
         object.position.set(pos.x, pos.y, pos.z);
         object.children[0].material = material;
         object.children[0].geometry.name = objName;
         console.log(object);
         scene.add( object );
         //add the object to an array of objects
         //print all objects in the scene

            $("#objList").append("<div class='objLoaded' id ='" 
              + countUp + "' onclick=selectObj('" + countUp + "'); >" 
              + objName + "</div>" + "<div class='accordion-content'>" + 
              "<p id='p" + countUp + "'></p> </div>" );
         countUp += 1; //keep track of objects loaded
         render();
         
      });
 
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
  }

  $("#name").html(intersectedObj);

  render();

}

function selectObj(objID) {
  //gear 1 is mother gear
  selectedObj = scene.getObjectByName( objID, true );
  selectedObjID = objID;

  $("#" + objID).next().slideToggle('fast');
  $("#p" + objID).html(objInfoString(selectedObj));
  console.log(objectModels[objID]);

  //Hide the other panels
  $(".accordion-content").not($("#" + objID).next()).slideUp('fast');

}

function objInfoString(obj) {
  var infoString = "Position: " + obj.position.x + "," + obj.position.y + "," + obj.position.z;
  infoString += "<br>";
  infoString += "Scale Factor: " + obj.scale.x;
  return infoString
}

function onKeyDown(e){
  var keyCode = e.keyCode;
  if(keyCode == 65){ // a
       selectedObj.position.x -= 1;
       //update object models
       objectModels[selectedObjID].origin.x -= 1;
  }
  if(keyCode == 68){ // d
       selectedObj.position.x += 1;
       //update object models
       objectModels[selectedObjID].origin.x += 1;
  }
   if(keyCode == 87){ // w
       selectedObj.position.y += 1;
       //update object models
       objectModels[selectedObjID].origin.y += 1;
  }
   if(keyCode == 83){ // s
       selectedObj.position.y -= 1;
       //update object models
       objectModels[selectedObjID].origin.y -= 1;
  }
  if(keyCode == 69){ // e
       selectedObj.position.z += 1;
       //update object models
       objectModels[selectedObjID].origin.z += 1;
  }
  if(keyCode == 81){ // q
       selectedObj.position.z -= 1;
       //update object models
       objectModels[selectedObjID].origin.z -= 1;
  }
  if(keyCode == 219){ // [
    if(selectedObj.scale.x - 0.5 > 0) {
       selectedObj.scale.x -= 0.5;
       selectedObj.scale.y -= 0.5;
       selectedObj.scale.z -= 0.5;
       //update object models
       objectModels[selectedObjID].scale.x -= 0.5;
       objectModels[selectedObjID].scale.y -= 0.5;
       objectModels[selectedObjID].scale.z -= 0.5;
    }
  }
   if(keyCode == 221){ // ]
       selectedObj.scale.x += 0.5;
       selectedObj.scale.y += 0.5;
       selectedObj.scale.z += 0.5;
       //update object models
       objectModels[selectedObjID].scale.x += 0.5;
       objectModels[selectedObjID].scale.y += 0.5;
       objectModels[selectedObjID].scale.z += 0.5;
  }

  $("#p" + selectedObj.name).html(objInfoString(selectedObj));

}

window.addEventListener('mousemove', onMouseMove, false );
window.addEventListener('click', onMouseClick, false );
window.addEventListener('keydown', onKeyDown, false );
window.requestAnimationFrame(render);


