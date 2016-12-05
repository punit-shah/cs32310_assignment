var app = {
  init: function () {
    app.initRenderer();
    app.initScene();
    app.initCamera();
    app.initControls();

    window.addEventListener('resize', app.onResize);

    // group variable for meshes
    var group = new THREE.Object3D();

    group.add(app.getLights());
    group.add(app.getRooms());

    // add group to scene
    app.scene.add(group);
  },

  initRenderer: function () {
    app.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    app.renderer.setPixelRatio(window.devicePixelRatio);
    app.renderer.setSize(window.innerWidth, window.innerHeight);
    app.renderer.setClearColor(0x87ceeb);
    app.renderer.shadowMap.enabled = true;
    app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('scene').appendChild(app.renderer.domElement);
  },

  initScene: function () {
    app.scene = new THREE.Scene();
  },

  initCamera: function () {
    var fov = 45;
    var aspect = window.innerWidth / window.innerHeight;
    var near = 0.1;
    var far = 20000;

    app.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    app.camera.position.set(0, 100, 150);
    app.camera.lookAt(new THREE.Vector3(0, 100, -10000));
    app.scene.add(app.camera);
  },

  initControls: function () {
    app.controls = new Controls(app.camera);
  },

  getRooms: function () {
    var rooms = new THREE.Object3D();

    var room1 = new Room(1);
    rooms.add(room1);

    var room2 = new Room(2);
    room2.position.set(100, 0, -500);
    rooms.add(room2);

    return rooms;
  },

  getLights: function () {
    var lights = new THREE.Object3D();

    var ambientLight = new THREE.AmbientLight(0x666666);
    lights.add(ambientLight);

    var sun = new THREE.DirectionalLight(0xbbbbbb, 0.5);
    sun.castShadow = true;
    sun.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(90, 1, 1000, 6000));
    sun.shadow.bias = 0.0001;
    sun.shadow.darkness = 0.2;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.position.set(1600, 400, -2000);
    lights.add(sun);

    return lights;
  },

  animate: function () {
    requestAnimationFrame(app.animate);
    app.controls.update();
    app.renderer.render(app.scene, app.camera);
  },

  onResize: function () {
    var width = window.innerWidth;
    var height = window.innerHeight;

    app.camera.aspect = width / height;
    app.camera.updateProjectionMatrix();

    app.renderer.setSize(width, height);
  },
};

var App = function () {
  this.init();
  this.animate();
};

App.prototype = app;
