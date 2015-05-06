
var renderer;
var camera;
var scene;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var gears = [];
var gearModels = [];
var objectModels = []; //keep objectmodels Index as ID for description access
var countUp = 0;
var projector, mouse = { x: 0, y: 0 }, INTERSECTED;
var stillLoading;
var loadTimer;
var percentIncrease;
var pivots = [];
var planets = [];
var timeScale = 5;
var windowPivot = new THREE.Object3D();
var mainWindowOpen = false;
var play = true;

function drawszlider(count, total){
    var szazalek= count/total * 100.0;
    console.log("percent change" + szazalek);
    $("#szliderbar").css("width", szazalek+'%');
    $("#szazalek").innerHTML=szazalek+'%';
}

function incrszlider(increase) {
  console.log("called");
  if(stillLoading) {
    if (percentIncrease >= 100) {
      toggleCanvas();
    }
    $("#szliderbar").css("width", increase+'%');
    $("#szazalek").innerHTML=increase+'%';
    percentIncrease+= 2;
  }
}

document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '32') {
        // space bar
        crank();
    } else if (e.keyCode == '38') {
      timeScale++;
    } else if(e.keyCode == '40') {
      if(timeScale > 1) {
        timeScale--;
      }
    }
}

function toggleCanvas() {
  $("#container").css("display", "block");
  // $("#info").css("display", "block");
  $("#szlider").css("display", "none");
  $("#loading").css("display", "none");
  clearInterval(loadTimer);
}

function setLoadLocation(windowWidth, windowHeight) {
  var loadLeft = windowWidth/2 - windowWidth*.4;
  var loadTop = windowHeight/2 + 100;
  $('#szlider').css("top", loadTop);
  $('#szlider').css("left", loadLeft);
}

function addPivots() {

  var p1 = new THREE.Object3D();
  p1.name = "Mercury pivot";
  p1.position.set(0,8,0);
  p1.add(scene.getObjectByName("Sun and Mercury"));
  p1.add(scene.getObjectByName("Mercury"));
  scene.add(p1);
  pivots.push(p1);

  var p2 = new THREE.Object3D();
  p2.name = "Venus pivot";
  p2.position.set(0,8,0);
  p2.add(scene.getObjectByName("Venus"));
  scene.add(p2);
  pivots.push(p2);

  var p3 = new THREE.Object3D();
  p3.name = "Earth pivot";
  p3.position.set(0,8,0);
  p3.add(scene.getObjectByName("Earth"));
  p3.add(scene.getObjectByName("Earth Plane"));
  p3.add(scene.getObjectByName("Earth Moon"));
  scene.add(p3);
  pivots.push(p3);

  var p4 = new THREE.Object3D();
  p4.name = "Mars pivot";
  p4.position.set(0,8,0);
  p4.add(scene.getObjectByName("Mars"));
  scene.add(p4);
  pivots.push(p4);

  var p5 = new THREE.Object3D();
  p5.name = "Jupiter pivot";
  p5.position.set(0,8,0);
  p5.add(scene.getObjectByName("Jupiter Arm"));
  p5.add(scene.getObjectByName("Jupiter Moon1"));
  p5.add(scene.getObjectByName("Jupiter Moon2"));
  p5.add(scene.getObjectByName("Jupiter Moon3"));
  scene.add(p5);
  pivots.push(p5);

  var p6 = new THREE.Object3D();
  p6.name = "Saturn pivot";
  p6.position.set(0,8,0);
  p6.add(scene.getObjectByName("Saturn Arm"));
  p6.add(scene.getObjectByName("Saturn"));
  p6.add(scene.getObjectByName("Saturn Moon1"));
  p6.add(scene.getObjectByName("Saturn Moon2"));
  p6.add(scene.getObjectByName("Saturn Moon3"));
  p6.add(scene.getObjectByName("Saturn Moon4"));
  p6.add(scene.getObjectByName("Saturn Moon5"));
  p6.add(scene.getObjectByName("Saturn Moon6"));
  scene.add(p6);
  pivots.push(p6);  
}

function setup() {

  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight * 0.8;

  setLoadLocation(WIDTH, HEIGHT);   

  stillLoading = true;
  percentIncrease = 8;
  drawszlider(8, 100);
  loadTimer = setInterval(function(){ incrszlider(percentIncrease) }, 100);
 
  // set some camera attributes
  var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

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

  projector = new THREE.Projector();

  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  $container.append(renderer.domElement);

  //load objs
  load_json_obj("data/sample.json");
  $.getJSON("data/planets.json", function(data) {
    var planetInfos = data.objects;
    for(var i = 0; i < planetInfos.length; i++) {
      planets.push({"name": planetInfos[i].name,
                    "period": planetInfos[i].period});
    }
  });

  // draw!
  renderer.render(scene, camera);
  animate();

}

function load_json_obj(filePath){
  $.getJSON(filePath, function(data) {
    objectModels = data.objects;

    for(var i = 0; i < objectModels.length; i++) {
    loadObj(
      i,
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

function loadObj(id, objName, fileName, albedo, spec, norm, pos, scale, rot) {

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
         object.children[0].geometry.computeBoundingBox();
         object.scale.set(scale.x, scale.y, scale.z);
         object.rotation.set(rot.x, rot.y, rot.z);
         object.name = objName;
         object.position.set(pos.x, pos.y, pos.z);
         object.children[0].material = material;
         object.children[0].name = id;
         object.children[0].geometry.name = objName;
         
         console.log(objName);
         scene.add( object );
         
         countUp += 1; //keep track of objects loaded

         if(countUp == objectModels.length) {
            render();
            addPivots();
            windowPivot.add(scene.getObjectByName("Main Window"));
            scene.add(windowPivot);
            openMainWindow();
            openMainWindow();
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
  //mouseRayCast();
  render();
  update();
  if(play) {
    for (var i = 0; i < pivots.length; i++) {
      pivots[i].rotation.z += timeScale * 1.0/planets[i].period;
    }
  }

}

function render() {
  renderer.render(scene, camera);
}

function onMouseMove( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1    
  //mouseRayCast();
}



function onMouseClick (event) {

  if(INTERSECTED != null) {
    if(INTERSECTED.geometry.name === "Main Window") {
      openMainWindow();
    }
  }
  
}


function mouseRayCast() {
   // update the picking ray with the camera and mouse position  
  raycaster.setFromCamera( mouse, camera ); 

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects(scene.children, true);
  var selectedColor = new THREE.Color( 0xffffff );
  var intersectedObj = "";

  if(intersects.length != 0) {
    
    intersectedObj = intersects[0].object.geometry.name;
     $("#name").html(intersectedObj);
     $("#description").html(objectModels[intersects[0].object.name].description);
   
    if(intersects[0].object.material.color.r == selectedColor.r
      && intersects[0].object.material.color.g == selectedColor.g
       && intersects[0].object.material.color.b == selectedColor.b) {

      intersects[0].object.material.color = new THREE.Color( 0x8C8C8C );
    } else {
        
        for (var i = 0; i < scene.children.length; i++) { 
          if(scene.children[i].name != "" && scene.children[i].name != intersectedObj) { 
            scene.children[i].children[0].material.color = new THREE.Color(0x8C8C8C);
          }   
        }

        intersects[0].object.material.color = selectedColor;
    }

  
}
}

function update()
{
  // find intersections

  // create a Ray with origin at the mouse position
  //   and direction into the scene (camera direction)

  var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
   // update the picking ray with the camera and mouse position  
  raycaster.setFromCamera( vector, camera ); 

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects(scene.children, true);
  var selectedColor = new THREE.Color( 0xffffff );

  // INTERSECTED = the object in the scene currently closest to the camera 
  //    and intersected by the Ray projected from the mouse position  
  
  // if there is one (or more) intersections
  if ( intersects.length > 0 )
  {
    // if the closest object intersected is not the currently stored intersection object
    if ( intersects[ 0 ].object != INTERSECTED ) 
    {
        // restore previous intersection object (if it exists) to its original color
      if ( INTERSECTED ) {
        INTERSECTED.material.color = new THREE.Color( 0x8C8C8C );
      }
      // store reference to closest object as current intersection object
      INTERSECTED = intersects[ 0 ].object;
      $("#name").html(INTERSECTED.geometry.name);

      // set a new color for closest object
      INTERSECTED.material.color = selectedColor;
      if(INTERSECTED.geometry.name === "Cabinet") {
        scene.getObjectByName("Cabinet Legs").children[0].material.color = selectedColor;
        $("#name").html("Cabinet");
      } else if(INTERSECTED.geometry.name === "Cabinet Legs") {
        scene.getObjectByName("Cabinet").children[0].material.color = selectedColor;
         $("#name").html("Cabinet");
      }
      
    }
  } 
  else // there are no intersections
  {
    // restore previous intersection object (if it exists) to its original color
    if (INTERSECTED != null) {
      INTERSECTED.material.color = new THREE.Color( 0x8C8C8C  );
      if(INTERSECTED.geometry.name === "Cabinet") {
        scene.getObjectByName("Cabinet Legs").children[0].material.color = new THREE.Color( 0x8C8C8C );
      } else if(INTERSECTED.geometry.name === "Cabinet Legs") {
        scene.getObjectByName("Cabinet").children[0].material.color = new THREE.Color( 0x8C8C8C );
      }
    }
    // remove previous intersection object reference
    //     by setting current intersection object to "nothing"
    INTERSECTED = null;
  }

  controls.update();
  render();

}

function crank() {
  //gear 1 is mother gear
  play = !play;
}

function openMainWindow() {
  var mainWindow = scene.getObjectByName("Main Window");
  if(!mainWindowOpen) {
    windowPivot.position.set(-22, 9, 86);
    scene.getObjectByName("Main Window").position.set(12, -9, -70);
    windowPivot.rotation.y = 45 * Math.PI/180;
    mainWindowOpen = true;
  } else {
    windowPivot.rotation.y = 0;
    scene.getObjectByName("Main Window").position.set(22, -9, -85);
    mainWindowOpen = false;
  }
  render();
}

window.addEventListener('mousemove', onMouseMove, false );
window.addEventListener('click', onMouseClick, false );

window.requestAnimationFrame(render);


