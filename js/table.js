// depth should be smaller than width
var Table = function (width, height, depth) {
  this.tableDimensions = {
    width: width,
    height: height,
    depth: depth,
  };

  this.legDimensions = {
    width: depth * 0.1,
    height: height - depth * 0.1,
    depth: depth * 0.1,
  };

  this.topDimensions = {
    width: width,
    height: depth * 0.1,
    depth: depth,
  };

  this.material = this.getMaterial();

  return this.getTable();
};

Table.prototype = {
  getTable: function () {
    var table = new THREE.Object3D();

    var leg1 = this.getLeg();
    leg1.applyMatrix(utils.translate(
      -this.tableDimensions.width / 2 + this.legDimensions.width / 2, // x
      this.legDimensions.height / 2, // y
      -this.tableDimensions.depth / 2 + this.legDimensions.depth / 2 // z
    ));
    table.add(leg1);

    var leg2 = leg1.clone();
    leg2.translateX(this.tableDimensions.width - this.legDimensions.width);
    table.add(leg2);

    var leg3 = leg2.clone();
    leg3.translateZ(this.tableDimensions.depth - this.legDimensions.depth);
    table.add(leg3);

    var leg4 = leg3.clone();
    leg4.translateX(-this.tableDimensions.width + this.legDimensions.width);
    table.add(leg4);

    var top = this.getTop();
    top.translateY(this.legDimensions.height + this.topDimensions.height / 2);
    table.add(top);

    return table;
  },

  getMaterial: function () {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('img/wood.jpg');
    var material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
      metalness: 0.2,
    });
    return material;
  },

  getTop: function () {
    var top = new THREE.Mesh(this.getTopGeometry(), this.material);
    top.castShadow = true;
    top.receiveShadow = true;
    return top;
  },

  getTopGeometry: function () {
    return new THREE.BoxBufferGeometry(
      this.topDimensions.width,
      this.topDimensions.height,
      this.topDimensions.depth
    );
  },

  getLeg: function () {
    var leg = new THREE.Mesh(this.getLegGeometry(), this.material);
    leg.castShadow = true;
    leg.receiveShadow = true;
    return leg;
  },

  getLegGeometry: function () {
    return new THREE.BoxBufferGeometry(
      this.legDimensions.width,
      this.legDimensions.height,
      this.legDimensions.depth
    );
  },
};
