var renderer, scene, camera;

init();
animate();

function init() {
  initRenderer();
  initScene();

  initCamera();
  initControls();

  initLight();
  initRooms();
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x87ceeb);
  document.getElementById('scene').appendChild(renderer.domElement);
}

function initScene() {
  scene = new THREE.Scene();
}

function initCamera() {
  var fov = 45;
  var aspect = window.innerWidth / window.innerHeight;
  var near = 0.1;
  var far = 20000;

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 100, 150);
  camera.lookAt(new THREE.Vector3(0, 100, -10000));
  scene.add(camera);
}

function initLight() {
  light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(1000, 300, 500);
  light.castShadow = true;
  light.shadow.camera.far = 2000;
  scene.add(light);
}

function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}
