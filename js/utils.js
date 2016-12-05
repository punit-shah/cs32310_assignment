var utils = {
  translateAndRotateX: function (translateX, translateY, translateZ, rotateX) {
    var translation = new THREE.Matrix4().makeTranslation(translateX, translateY, translateZ);
    var rotation = new THREE.Matrix4().makeRotationX(rotateX);
    return new THREE.Matrix4().multiplyMatrices(translation, rotation);
  },

  translateAndRotateY: function (translateX, translateY, translateZ, rotateY) {
    var translation = new THREE.Matrix4().makeTranslation(translateX, translateY, translateZ);
    var rotation = new THREE.Matrix4().makeRotationY(rotateY);
    return new THREE.Matrix4().multiplyMatrices(translation, rotation);
  },

  translateAndRotateZ: function (translateX, translateY, translateZ, rotateZ) {
    var translation = new THREE.Matrix4().makeTranslation(translateX, translateY, translateZ);
    var rotation = new THREE.Matrix4().makeRotationZ(rotateZ);
    return new THREE.Matrix4().multiplyMatrices(translation, rotation);
  },
};
