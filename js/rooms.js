var textureLoader = new THREE.TextureLoader();

function initRooms() {
  var room1 = getRoom1();
  scene.add(room1);
}

function getRoom1() {
  var width = 800;
  var height = 200;
  var depth = 400;
  var room = new THREE.Object3D();

  // floor
  var floor = getFloor(width, depth);
  room.add(floor);

  // walls
  var extrudeSettings = {
    amount: 10,
    steps: 1,
    bevelEnabled: false,
  };

  var wallMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffee,
    side: THREE.DoubleSide,
  });

  var wall1Shape = getWallShape(width, height);
  var wall1DoorPath = getRectanglePath(width / 2 + 50, 0, 80, 180);
  wall1Shape.holes.push(wall1DoorPath);
  var wall1Geometry = new THREE.ExtrudeGeometry(wall1Shape, extrudeSettings);
  wall1Geometry.translate(-width / 2, 0, -depth / 2);
  var wall1 = new THREE.Mesh(wall1Geometry, wallMaterial);
  room.add(wall1);

  var wall2Shape = getWallShape(depth, height);
  var wall2WindowPath = getRectanglePath(depth / 4, height * 0.4, depth / 2, height * 0.55);
  wall2Shape.holes.push(wall2WindowPath);
  var wall2Geometry = new THREE.ExtrudeGeometry(wall2Shape, extrudeSettings);
  wall2Geometry.rotateY(Math.PI / 2);
  wall2Geometry.translate(width / 2, 0, depth / 2);
  var wall2 = new THREE.Mesh(wall2Geometry, wallMaterial);
  room.add(wall2);

  var wall3Shape = getWallShape(width, height);
  var wall3Geometry = new THREE.ExtrudeGeometry(wall3Shape, extrudeSettings);
  wall3Geometry.rotateY(Math.PI);
  wall3Geometry.translate(width / 2, 0, depth / 2);
  var wall3 = new THREE.Mesh(wall3Geometry, wallMaterial);
  room.add(wall3);

  var wall4Shape = getWallShape(depth, height);
  var wall4Geometry = new THREE.ExtrudeGeometry(wall4Shape, extrudeSettings);
  wall4Geometry.rotateY(-Math.PI / 2);
  wall4Geometry.translate(-width / 2, 0, -depth / 2);
  var wall4 = new THREE.Mesh(wall4Geometry, wallMaterial);
  room.add(wall4);

  // ceiling
  var ceiling = getCeiling(width, height, depth);
  room.add(ceiling);

  // lights
  var light1 = new THREE.PointLight(0xffffff, 0.5);
  light1.position.set(-width * 0.2, height - 10, 0);
  room.add(light1);

  var light2 = light1.clone();
  light2.position.x = width * 0.2;
  room.add(light2);

  return room;
}

function getFloor(width, depth) {
  var floorGeometry = new THREE.PlaneGeometry(width, depth);
  floorGeometry.rotateX(-Math.PI / 2);

  var floorTexture = textureLoader.load('img/floor.jpg');
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(10, 5);
  var floorBump = textureLoader.load('img/floor-bump.jpg');
  floorBump.wrapS = floorBump.wrapT = THREE.RepeatWrapping;
  floorBump.repeat.set(10, 5);
  var floorMaterial = new THREE.MeshPhongMaterial({
    map: floorTexture,
    bumpMap: floorBump,
  });

  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  return floor;
}

function getCeiling(width, height, depth) {
  var ceilingGeometry = new THREE.PlaneGeometry(width, depth);
  ceilingGeometry.rotateX(Math.PI / 2);
  ceilingGeometry.translate(0, height, 0);

  var ceilingMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffee,
  });

  var ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  return ceiling;
}

function getWallShape(width, height) {
  var wallShape = new THREE.Shape();
  wallShape.moveTo(0, 0);
  wallShape.lineTo(width, 0);
  wallShape.lineTo(width, height);
  wallShape.lineTo(0, height);
  wallShape.lineTo(0, 0);
  return wallShape;
}

function getRectanglePath(x, y, width, height) {
  var path = new THREE.Path();
  path.moveTo(x, y);
  path.lineTo(x + width, y);
  path.lineTo(x + width, y + height);
  path.lineTo(x, y + height);
  path.lineTo(x, y);
  return path;
}
