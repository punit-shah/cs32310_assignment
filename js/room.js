var Room = function (type) {
  this.textureLoader = new THREE.TextureLoader();
  return this.getRoom(type);
};

Room.prototype = {
  getRoom: function (type) {
    var roomLookup = {
      1: this.getRoom1,
    };

    return roomLookup[type].bind(this)();
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

    var extrudeSettings = {
      amount: 10,
      steps: 1,
      bevelEnabled: false,
    };

    var wallMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffee,
      side: THREE.DoubleSide,
    });

    var wallNorthShape = this.getWallShape(width, height);
    var wallNorthDoorPath = this.getRectanglePath(width / 2 + 50, 0, 80, 180);
    wallNorthShape.holes.push(wallNorthDoorPath);
    var wallNorthGeometry = new THREE.ExtrudeGeometry(wallNorthShape, extrudeSettings);
    wallNorthGeometry.translate(-width / 2, 0, -depth / 2);
    var wallNorth = new THREE.Mesh(wallNorthGeometry, wallMaterial);
    room.add(wallNorth);

    var wallEastShape = this.getWallShape(depth, height);
    var wallEastWindowPath = this.getRectanglePath(depth / 4, height * 0.4, depth / 2, height * 0.55);
    wallEastShape.holes.push(wallEastWindowPath);
    var wallEastGeometry = new THREE.ExtrudeGeometry(wallEastShape, extrudeSettings);
    wallEastGeometry.rotateY(Math.PI / 2);
    wallEastGeometry.translate(width / 2, 0, depth / 2);
    var wallEast = new THREE.Mesh(wallEastGeometry, wallMaterial);
    room.add(wallEast);

    var wallSouthShape = this.getWallShape(width, height);
    var wallSouthGeometry = new THREE.ExtrudeGeometry(wallSouthShape, extrudeSettings);
    wallSouthGeometry.rotateY(Math.PI);
    wallSouthGeometry.translate(width / 2, 0, depth / 2);
    var wallSouth = new THREE.Mesh(wallSouthGeometry, wallMaterial);
    room.add(wallSouth);

    var wallWestShape = this.getWallShape(depth, height);
    var wallWestGeometry = new THREE.ExtrudeGeometry(wallWestShape, extrudeSettings);
    wallWestGeometry.rotateY(-Math.PI / 2);
    wallWestGeometry.translate(-width / 2, 0, -depth / 2);
    var wallWest = new THREE.Mesh(wallWestGeometry, wallMaterial);
    room.add(wallWest);

    var light1 = this.getLight(-width * 0.2, height - 10, 0);
    room.add(light1);
    var light2 = this.getLight(width * 0.2, height - 10, 0);
    room.add(light2);
    var light3 = this.getLight(0, height / 2, 0);
    room.add(light3);

    return room;
  },

  getFloor: function (width, depth) {
    var floorGeometry = new THREE.PlaneGeometry(width, depth);
    floorGeometry.rotateX(-Math.PI / 2);

    var floorTexture = this.textureLoader.load('img/floor.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(8, 4);
    var floorBump = this.textureLoader.load('img/floor-bump.jpg');
    floorBump.wrapS = floorBump.wrapT = THREE.RepeatWrapping;
    floorBump.repeat.set(8, 4);
    var floorMaterial = new THREE.MeshPhongMaterial({
      map: floorTexture,
      bumpMap: floorBump,
    });

    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
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
    return ceiling;
  },

  getWallShape: function (width, height) {
    var wallShape = new THREE.Shape();
    wallShape.moveTo(0, 0);
    wallShape.lineTo(width, 0);
    wallShape.lineTo(width, height);
    wallShape.lineTo(0, height);
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
};
