var WaterFountain = function () {
  this.waterColor = 0x40a4df;
  app.animationUpdateFunctions.push(this.update.bind(this));
  return this.getWaterFountain();
};

WaterFountain.prototype = {
  getWaterFountain: function () {
    var fountain = new THREE.Object3D();

    var particleCount = 500;
    var fountainGeometry = this.getGeometry(particleCount);
    var fountainMaterial = new THREE.PointsMaterial({
      size: 3,
      color: this.waterColor,
    });

    this.fountainPoints = new THREE.Points(fountainGeometry, fountainMaterial);
    fountain.add(this.fountainPoints);

    var basePoints = [];
    for (var i = 0; i < 10; i++) {
      basePoints.push(new THREE.Vector2(
        (Math.sin(i * 0.2) + Math.cos(i * 0.3)) * -75 + 100,
        (i - 5) * 4 + 20
      ));
    }
    var baseGeometry = new THREE.LatheBufferGeometry(basePoints);
    var baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0,
      side: THREE.DoubleSide,
    });
    var base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.castShadow = true;
    fountain.add(base)

    return fountain;
  },

  getGeometry: function (particleCount) {
    var geometry = new THREE.Geometry();
    for (var i = 0; i < particleCount; i++) {
      geometry.vertices.push(this.getParticle());
    }
    return geometry;
  },

  getParticle: function () {
    var particle = new THREE.Vector3(0, 0, 0);
    particle.velocity = this.getVelocityVector();
    return particle;
  },

  updateParticle: function (particle) {
    particle.x += particle.velocity.x;
    particle.y += particle.velocity.y;
    particle.z += particle.velocity.z;

    particle.velocity.y -= 0.5;

    if (particle.y < 20 && particle.velocity.y < 0) {
      particle.x = particle.y = particle.z = 0;
      particle.velocity = this.getVelocityVector();
    }
  },

  getVelocityVector: function () {
    var dx = Math.random() * 4 - 2;
    var dy = Math.random() * 4 + 6;
    var dz = Math.random() * 4 - 2;

    return new THREE.Vector3(dx, dy, dz);
  },

  update: function () {
    this.fountainPoints.geometry.vertices.forEach(this.updateParticle.bind(this));
    this.fountainPoints.geometry.verticesNeedUpdate = true;
    this.fountainPoints.geometry.colorsNeedUpdate = true;
  },
}
