var Chair = function (width, height, depth, thickness) {
  this.width = width;
  this.height = height;
  this.depth = depth;
  this.thickness = thickness;

  this.woodMaterial = this.getMaterial('wood');
  this.fabricMaterial = this.getMaterial('fabric');

  return this.getChair();
};

Chair.prototype = {
  getChair: function () {
    var chair = new THREE.Object3D();

    chair.add(this.getBack());
    chair.add(this.getSeat());
    chair.add(this.getLegs());

    return chair;
  },

  getMaterial: function (type) {
    var textureLoader = new THREE.TextureLoader();
    if (type === 'wood') {
      var texture = textureLoader.load('img/wood.jpg');
      return new THREE.MeshPhongMaterial({
        map: texture,
      });
    } else if (type === 'fabric') {
      var texture = textureLoader.load('img/fabric.jpg');
      return new THREE.MeshPhongMaterial({
        map: texture,
      });
    }
  },

  getBack: function () {
    var width = this.width;
    var height = this.height * 0.7;
    var depth = this.thickness;

    var geometry = new THREE.BoxBufferGeometry(width, height, depth);
    var back = new THREE.Mesh(geometry, this.fabricMaterial);
    back.applyMatrix(utils.translate(0, this.height * 0.3 + height / 2, -this.depth / 2 + depth / 2));
    back.castShadow = true;
    back.receiveShadow = true;
    return back;
  },

  getSeat: function () {
    var width = this.width;
    var height = this.thickness;
    var depth = this.depth - this.thickness;

    var geometry = new THREE.BoxBufferGeometry(width, height, depth);
    var seat = new THREE.Mesh(geometry, this.fabricMaterial);
    seat.applyMatrix(utils.translate(0, this.height * 0.3 + height / 2, this.depth / 2 - depth / 2));
    seat.castShadow = true;
    seat.receiveShadow = true;
    return seat;
  },

  getLegs: function () {
    var legs = new THREE.Object3D();

    var leg1 = this.getLeg();
    leg1.applyMatrix(utils.translate(
      -this.width / 2 + this.thickness / 2,
      this.height * 0.15,
      -this.depth / 2 + this.thickness / 2
    ));
    legs.add(leg1);

    var leg2 = leg1.clone();
    leg2.translateX(this.width - this.thickness);
    legs.add(leg2);

    var leg3 = leg2.clone();
    leg3.translateZ(this.depth - this.thickness);
    legs.add(leg3);

    var leg4 = leg3.clone();
    leg4.translateX(-this.width + this.thickness);
    legs.add(leg4);

    return legs;
  },

  getLeg: function () {
    var width = this.thickness;
    var height = this.height * 0.3;
    var depth = this.thickness;

    var geometry = new THREE.BoxBufferGeometry(width, height, depth);
    var leg = new THREE.Mesh(geometry, this.woodMaterial);
    leg.castShadow = true;
    leg.receiveShadow = true;
    return leg;
  },
};
