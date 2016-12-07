var Bed = function () {
  return this.getBed();
};

Bed.prototype = {
  getBed: function () {
    var bed = new THREE.Object3D();

    var width = 180;
    var height = 70;
    var depth = 200;

    var textureLoader = new THREE.TextureLoader();

    var baseGeometry = new THREE.BoxBufferGeometry(width, height / 3, depth);
    var base = new THREE.Mesh(baseGeometry, this.getMaterial('wood'));
    base.translateY(height / 6);
    base.castShadow = true;
    base.receiveShadow = true;
    bed.add(base);

    var mattressGeometry = new THREE.BoxBufferGeometry(width - 10, height / 3, depth - 10);
    var mattress = new THREE.Mesh(mattressGeometry, this.getMaterial('white'));
    mattress.translateY(height / 3 + height / 6);
    mattress.castShadow = true;
    mattress.receiveShadow = true;
    bed.add(mattress);

    var headboardGeometry = new THREE.BoxBufferGeometry(width, (height / 3) * 2, 10);
    var headboard = new THREE.Mesh(headboardGeometry, this.getMaterial('wood'));
    headboard.applyMatrix(utils.translate(0, height / 3 + height / 3, -depth / 2 + 5));
    headboard.castShadow = true;
    headboard.receiveShadow = true;
    bed.add(headboard);

    return bed;
  },

  getMaterial: function (type) {
    var textureLoader = new THREE.TextureLoader();
    if (type === 'wood') {
      var texture = textureLoader.load('img/wood.jpg');
      return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.5,
        metalness: 0.2,
      });
    } else if (type === 'white') {
      var bumpMap = textureLoader.load('img/creases.jpg', function (map) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(4, 4);
      });
      return new THREE.MeshStandardMaterial({
        color: 0xffffff,
        bumpMap: bumpMap,
        roughness: 0.9,
        metalness: 0.1,
      });
    }
  },
};
