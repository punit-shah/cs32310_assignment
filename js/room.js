var Room = function (type) {
  this.textureLoader = new THREE.TextureLoader();

  this.wallMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffee,
    side: THREE.DoubleSide,
  });
  this.wallExtrudeSettings = {
    amount: 10,
    steps: 1,
    bevelEnabled: false,
  };

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

    // var light1 = this.getLight(-width * 0.2, height - 10, 0);
    // room.add(light1);
    // var light2 = this.getLight(width * 0.2, height - 10, 0);
    // room.add(light2);
    var light = this.getLight(0, height / 2, 0);
    room.add(light);

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

    var light = this.getLight(0, height / 2, 0);
    room.add(light);

    return room;
  },

  getFloor: function (width, depth) {
    var floorGeometry = new THREE.PlaneGeometry(width, depth);
    var floorTranslation = new THREE.Matrix4().makeTranslation(0, 1, 0);
    var floorRotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
    var floorTransform = new THREE.Matrix4().multiplyMatrices(floorTranslation, floorRotation);
    floorGeometry.applyMatrix(floorTransform);

    var floorTexture = this.textureLoader.load('img/floor.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(8, 4);
    floorTexture.anisotropy = 4;
    var floorBump = this.textureLoader.load('img/floor-bump.jpg');
    floorBump.wrapS = floorBump.wrapT = THREE.RepeatWrapping;
    floorBump.repeat.set(8, 4);
    var floorMaterial = new THREE.MeshPhongMaterial({
      map: floorTexture,
      bumpMap: floorBump,
    });

    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    return floor;
  },

  getCeiling: function (width, height, depth) {
    var ceilingGeometry = new THREE.PlaneGeometry(width, depth);
    ceilingGeometry.rotateX(Math.PI / 2);
    ceilingGeometry.translate(0, height, 0);

    var ceilingMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffee,
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

  getLight: function (x, y, z) {
    var light = new THREE.PointLight(0xffffff, 0.3);
    light.position.set(x, y, z);
    return light;
  },

  getWalls: function (wallShapes, width, height, depth) {
    var walls = new THREE.Object3D();

    if (wallShapes.north) {
      var wallNorthGeometry = new THREE.ExtrudeGeometry(wallShapes.north, this.wallExtrudeSettings);
      wallNorthGeometry.translate(-width / 2, 0, -depth / 2);
      var wallNorth = new THREE.Mesh(wallNorthGeometry, this.wallMaterial);
      wallNorth.castShadow = true;
      wallNorth.receiveShadow = true;
      walls.add(wallNorth)
    }

    if (wallShapes.east) {
      var wallEastGeometry = new THREE.ExtrudeGeometry(wallShapes.east, this.wallExtrudeSettings);
      var wallEastTransform = utils.translateAndRotateY(width / 2, 0, depth / 2, Math.PI / 2);
      wallEastGeometry.applyMatrix(wallEastTransform);
      var wallEast = new THREE.Mesh(wallEastGeometry, this.wallMaterial);
      wallEast.castShadow = true;
      wallEast.receiveShadow = true;
      walls.add(wallEast)
    }

    if (wallShapes.south) {
      var wallSouthGeometry = new THREE.ExtrudeGeometry(wallShapes.south, this.wallExtrudeSettings);
      var wallSouthTransform = utils.translateAndRotateY(width / 2, 0, depth / 2, Math.PI);
      wallSouthGeometry.applyMatrix(wallSouthTransform);
      var wallSouth = new THREE.Mesh(wallSouthGeometry, this.wallMaterial);
      wallSouth.castShadow = true;
      wallSouth.receiveShadow = true;
      walls.add(wallSouth)
    }

    if (wallShapes.west) {
      var wallWestGeometry = new THREE.ExtrudeGeometry(wallShapes.west, this.wallExtrudeSettings);
      var wallWestTransform = utils.translateAndRotateY(-width / 2, 0, -depth / 2, -Math.PI / 2);
      wallWestGeometry.applyMatrix(wallWestTransform);
      var wallWest = new THREE.Mesh(wallWestGeometry, this.wallMaterial);
      wallWest.castShadow = true;
      wallWest.receiveShadow = true;
      walls.add(wallWest)
    }

    return walls;
  },
};
