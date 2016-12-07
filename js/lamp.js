var Lamp = function () {
  return this.getLamp();
};

Lamp.prototype = {
  getLamp: function () {
    var lamp = new THREE.Object3D();

    var height = 175;

    var material = new THREE.MeshPhongMaterial({
      color: 0x333333,
      side: THREE.DoubleSide,
    });

    var baseHeight = 2;
    var baseRadius = 15;
    var baseGeometry = new THREE.CylinderBufferGeometry(baseRadius, baseRadius, baseHeight, 32);
    var base = new THREE.Mesh(baseGeometry, material);
    base.translateY(baseHeight / 2);
    lamp.add(base);

    var standRadius = 2;
    var standHeight = height - baseHeight;
    var standGeometry = new THREE.CylinderBufferGeometry(standRadius, standRadius, standHeight, 32);
    var stand = new THREE.Mesh(standGeometry, material);
    stand.translateY(standHeight / 2 + baseHeight);
    lamp.add(stand);

    var shadeRadius = 15;
    var shadeLength = 30;
    var shadeGeometry = new THREE.ConeBufferGeometry(shadeRadius, shadeLength, 32, 1, true);
    var shade = new THREE.Mesh(shadeGeometry, material);
    shade.applyMatrix(utils.translateAndRotateZ(5, height, 0, Math.PI * 0.25));
    lamp.add(shade);

    // target for light to point at
    var target = new THREE.Object3D();
    target.applyMatrix(utils.translate(15, height - 10, 0));
    lamp.add(target);

    var light = new THREE.SpotLight(0xeeeeee, 1, 400, Math.PI * 0.2, 0, 1);
    light.castShadow = true;
    light.applyMatrix(utils.translate(5, height, 0));
    light.target = target;
    light.target.updateMatrixWorld();

    var bulbGeometry = new THREE.SphereBufferGeometry(4, 16, 16);
    var bulbMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0xeeeeee,
      emissiveIntensity: 1,
    });
    var bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    light.add(bulb);

    lamp.add(light);

    // // uncomment to see spotlight helper
    // var spotLightHelper = new THREE.SpotLightHelper(light);
    // app.scene.add(spotLightHelper);

    return lamp;
  },
};
