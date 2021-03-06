var Room = function (type) {
  this.textureLoader = new THREE.TextureLoader();

  return this.getRoom(type);
};

Room.prototype = {
  getRoom: function (type) {
    return this['getRoom' + type].bind(this)();
  },

  getRoom1: function () {
    var width = 800;
    var height = 200;
    var depth = 400;

    var room = new THREE.Object3D();

    var floor = this.getFloor(width, depth);
    room.add(floor);

    var ceiling = this.getCeiling(width, height, depth);
    room.add(ceiling);

    var wallShapes = {};

    var wallNorthShape = this.getWallShape(width, height);
    var wallNorthDoorPath = this.getRectanglePath(width / 2 + 50, 0, 80, 180);
    wallNorthShape.holes.push(wallNorthDoorPath);
    wallShapes.north = wallNorthShape;

    var wallEastShape = this.getWallShape(depth, height);
    var wallEastWindowPath = this.getRectanglePath(depth / 4, height * 0.4, depth / 2, height * 0.55);
    wallEastShape.holes.push(wallEastWindowPath);
    wallShapes.east = wallEastShape;

    wallShapes.south = this.getWallShape(width, height);

    wallShapes.west = this.getWallShape(depth, height);

    var walls = this.getWalls(wallShapes, width, height, depth);
    room.add(walls);

    var light = this.getCeilingLight(0, height - 4, 0);
    room.add(light);

    var table = new Table(150, 65, 75);
    table.applyMatrix(utils.translateAndRotateY(-width * 0.25 + 38, 0, 0, -Math.PI / 2));
    room.add(table);

    var chair1 = new Chair(50, 120, 50, 7, 0.3);
    chair1.applyMatrix(utils.translateAndRotateY(-width * 0.25 - 25, 0, -35, Math.PI / 2));
    room.add(chair1);

    var chair2 = new Chair(50, 120, 50, 7, 0.3);
    chair2.applyMatrix(utils.translateAndRotateY(-width * 0.25 + 38, 0, 75, Math.PI));
    room.add(chair2);

    var lamp1 = new Lamp();
    lamp1.applyMatrix(utils.translateAndRotateY(-width / 2 + 35, 0, -depth / 2 + 35, -Math.PI * 0.25));
    room.add(lamp1);

    var lamp2 = new Lamp();
    lamp2.applyMatrix(utils.translateAndRotateY(width / 2 - 35, 0, -depth / 2 + 35, -Math.PI * 0.75));
    room.add(lamp2);

    var teapotSize = 8;
    var teapotGeometry = new THREE.TeapotBufferGeometry(teapotSize, 6, false, true, true, true, true);
    var teapotMaterial = new THREE.MeshPhongMaterial({
      color: 0xCFAE7D,
    });
    var teapot = new THREE.Mesh(teapotGeometry, teapotMaterial);
    teapot.castShadow = true;
    teapot.applyMatrix(utils.translateAndRotateY(-width * 0.25 + 38, 65 + teapotSize, -35, -Math.PI / 2));
    room.add(teapot);

    var fountain = new WaterFountain();
    fountain.translateX(width * 0.3);
    room.add(fountain);

    return room;
  },

  getRoom2: function () {
    var width = 600;
    var height = 200;
    var depth = 600;

    var room = new THREE.Object3D();

    var floor = this.getFloor(width, depth);
    room.add(floor);

    var ceiling = this.getCeiling(width, height, depth);
    room.add(ceiling);

    var wallShapes = {};

    var wallNorthShape = this.getWallShape(width, height);
    var wallNorthWindowPath = this.getRectanglePath(width / 3, height * 0.4, width / 3, height * 0.55);
    wallNorthShape.holes.push(wallNorthWindowPath);
    wallShapes.north = wallNorthShape;
    wallShapes.east = wallNorthShape; // same shape as north wall
    // no south wall
    wallShapes.west = this.getWallShape(depth, height);

    var walls = this.getWalls(wallShapes, width, height, depth);
    room.add(walls);

    var light = this.getCeilingLight(0, height - 4, 0);
    room.add(light);

    var sofa = new Chair(150, 70, 75, 20, 0.1);
    sofa.applyMatrix(utils.translateAndRotateY(width * 0.25, 0, depth / 2 - (75 / 2 + 5), Math.PI));
    room.add(sofa);

    var lamp1 = new Lamp();
    lamp1.applyMatrix(utils.translateAndRotateY(width / 2 - 35, 0, depth / 2 - 35, Math.PI * 0.75));
    room.add(lamp1);

    var bed = new Bed();
    bed.applyMatrix(utils.translateAndRotateY(-width / 2 + 100, 0, 0, Math.PI / 2));
    room.add(bed);

    var lamp2 = new Lamp();
    lamp2.applyMatrix(utils.translateAndRotateY(-width / 2 + 35, 0, -125, -Math.PI * 0.25));
    room.add(lamp2);

    var tree = new TreePainting(75, 75);
    tree.applyMatrix(utils.translateAndRotateY(-width / 2 + 2, height / 2 + 75 / 2, 0, Math.PI / 2));
    room.add(tree);

    return room;
  },

  getFloor: function (width, depth) {
    var floorGeometry = new THREE.PlaneGeometry(width, depth);
    var floorRotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
    floorGeometry.applyMatrix(floorRotation);

    var textureCallback = function (map) {
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.repeat.set(2, 6);
      map.anisotropy = 4;
    }

    var floorTexture = this.textureLoader.load('img/hardwood2_diffuse.jpg', textureCallback);
    var floorBump = this.textureLoader.load('img/hardwood2_bump.jpg', textureCallback);
    var floorRoughness = this.textureLoader.load('img/hardwood2_roughness.jpg', textureCallback);
    var floorMaterial = new THREE.MeshStandardMaterial({
      map: floorTexture,
      bumpMap: floorBump,
      roughnessMap: floorRoughness,
      bumpScale: 0.1,
      roughness: 0.8,
      metalness: 0.2,
    });

    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    return floor;
  },

  getCeiling: function (width, height, depth) {
    var ceilingGeometry = new THREE.PlaneGeometry(width, depth);
    ceilingGeometry.rotateX(Math.PI / 2);
    ceilingGeometry.translate(0, height, 0);

    var ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0xd2691e,
      roughness: 0.8,
      metalness: 0.2,
    });

    var ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.castShadow = true;
    return ceiling;
  },

  getWallShape: function (x, y) {
    var wallShape = new THREE.Shape();
    wallShape.moveTo(0, 0);
    wallShape.lineTo(x, 0);
    wallShape.lineTo(x, y);
    wallShape.lineTo(0, y);
    wallShape.lineTo(0, 0);
    return wallShape;
  },

  getRectanglePath: function (x, y, width, height) {
    var path = new THREE.Path();
    path.moveTo(x, y);
    path.lineTo(x + width, y);
    path.lineTo(x + width, y + height);
    path.lineTo(x, y + height);
    path.lineTo(x, y);
    return path;
  },

  getCeilingLight: function (x, y, z) {
    var light = new THREE.PointLight(0xeeeeee, 1, 400, 1);
    var bulbGeometry = new THREE.SphereGeometry(4, 16, 16);
    var bulbMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xeeeeee,
      emissiveIntensity: 1,
    });
    var bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    light.add(bulb);
    light.position.set(x, y, z);
    light.castShadow = true;
    return light;
  },

  getWalls: function (wallShapes, width, height, depth) {
    var walls = new THREE.Object3D();

    var wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xd2691e,
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });
    var wallExtrudeSettings = {
      amount: 10,
      steps: 1,
      bevelEnabled: false,
    };

    if (wallShapes.north) {
      var wallNorthGeometry = new THREE.ExtrudeGeometry(wallShapes.north, wallExtrudeSettings);
      wallNorthGeometry.translate(-width / 2, 0, -depth / 2);
      var wallNorth = new THREE.Mesh(wallNorthGeometry, wallMaterial);
      wallNorth.castShadow = true;
      wallNorth.receiveShadow = true;
      walls.add(wallNorth)
    }

    if (wallShapes.east) {
      var wallEastGeometry = new THREE.ExtrudeGeometry(wallShapes.east, wallExtrudeSettings);
      var wallEastTransform = utils.translateAndRotateY(width / 2, 0, depth / 2, Math.PI / 2);
      wallEastGeometry.applyMatrix(wallEastTransform);
      var wallEast = new THREE.Mesh(wallEastGeometry, wallMaterial);
      wallEast.castShadow = true;
      wallEast.receiveShadow = true;
      walls.add(wallEast)
    }

    if (wallShapes.south) {
      var wallSouthGeometry = new THREE.ExtrudeGeometry(wallShapes.south, wallExtrudeSettings);
      var wallSouthTransform = utils.translateAndRotateY(width / 2, 0, depth / 2, Math.PI);
      wallSouthGeometry.applyMatrix(wallSouthTransform);
      var wallSouth = new THREE.Mesh(wallSouthGeometry, wallMaterial);
      wallSouth.castShadow = true;
      wallSouth.receiveShadow = true;
      walls.add(wallSouth)
    }

    if (wallShapes.west) {
      var wallWestGeometry = new THREE.ExtrudeGeometry(wallShapes.west, wallExtrudeSettings);
      var wallWestTransform = utils.translateAndRotateY(-width / 2, 0, -depth / 2, -Math.PI / 2);
      wallWestGeometry.applyMatrix(wallWestTransform);
      var wallWest = new THREE.Mesh(wallWestGeometry, wallMaterial);
      wallWest.castShadow = true;
      wallWest.receiveShadow = true;
      walls.add(wallWest)
    }

    return walls;
  },
};
