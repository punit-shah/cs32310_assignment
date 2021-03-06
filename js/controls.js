var Controls = function (camera) {
  this.camera = camera;

  this.clock = new THREE.Clock();
  this.moveForward = false;
  this.moveBackward = false;
  this.turnLeft = false;
  this.turnRight = false;
  this.init();
};

Controls.prototype = {
  init: function () {
    var onKeyDown = function (e) {
      switch (e.keyCode) {
        case 38: // up arrow
          this.moveForward = true;
          break;
        case 40: // down arrow
          this.moveBackward = true;
          break;
        case 37: // left arrow
          this.turnLeft = true;
          break;
        case 39: // right arrow
          this.turnRight = true;
          break;
      }
    };

    var onKeyUp = function (e) {
      switch (e.keyCode) {
        case 38: // up arrow
          this.moveForward = false;
          break;
        case 40: // down arrow
          this.moveBackward = false;
          break;
        case 37: // left arrow
          this.turnLeft = false;
          break;
        case 39: // right arrow
          this.turnRight = false;
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown.bind(this));
    window.addEventListener('keyup', onKeyUp.bind(this));

    app.animationUpdateFunctions.push(this.update.bind(this));
  },

  update: function () {
    var delta = this.clock.getDelta();
    var moveDistance = 200 * delta;
    var rotateAngle = Math.PI / 2 * delta;

    if (this.moveForward) {
      this.camera.translateZ(-moveDistance);
    }
    if (this.moveBackward) {
      this.camera.translateZ(moveDistance);
    }
    if (this.turnLeft) {
      this.camera.rotateY(rotateAngle);
    }
    if (this.turnRight) {
      this.camera.rotateY(-rotateAngle);
    }

    this.camera.updateMatrix();
    this.camera.updateProjectionMatrix();
  }
};
