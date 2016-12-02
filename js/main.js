var renderer, scene, camera, controls;

init();
animate();

function init() {
  initRenderer();
  initScene();
  initCamera();
  initControls();
  initLight();
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
  var far = 10000;

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 150, 0);
  camera.lookAt(scene.position);
  scene.add(camera);
}

function initControls() {
  controls = new THREE.OrbitControls(camera);
}

function initLight() {
  var light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(300, 250, -500);
  scene.add(light);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
