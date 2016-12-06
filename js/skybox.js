var Skybox = function () {
  return this.getSkybox();
};

Skybox.prototype = {
  getSkybox: function () {
    var skybox = new THREE.Mesh(this.getGeometry(), this.getMaterial());
    return skybox;
  },

  getGeometry: function () {
    var cubeSize = 10000;
    var geometry = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
    return geometry;
  },

  getMaterial: function () {
    var cubeShader = THREE.ShaderLib.cube;
    cubeShader.uniforms['tCube'].value = this.getCubeTexture();

    return new THREE.ShaderMaterial({
      fragmentShader: cubeShader.fragmentShader,
      vertexShader: cubeShader.vertexShader,
      uniforms: cubeShader.uniforms,
      // depthWrite: false,
      side: THREE.BackSide,
    });
  },

  getCubeTexture: function () {
    var cubeTexture = new THREE.CubeTexture([]);

    new THREE.ImageLoader().load('img/skyboxsun25degtest.png', function (image) {

      // creates a canvas with the requested part of the image
      var getSide = function (x, y) {
        var size = 1024;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = size;
        canvas.height = size;

        context.drawImage(image, -x * size, -y * size);
        return canvas;
      };

      // push 6 sides to images array
      cubeTexture.images.push(getSide(2, 1)); // pos x
      cubeTexture.images.push(getSide(0, 1)); // neg x
      cubeTexture.images.push(getSide(1, 0)); // pos y
      cubeTexture.images.push(getSide(1, 2)); // neg y
      cubeTexture.images.push(getSide(1, 1)); // pos z
      cubeTexture.images.push(getSide(3, 1)); // neg z

      cubeTexture.needsUpdate = true;
    });

    return cubeTexture;
  },
};
