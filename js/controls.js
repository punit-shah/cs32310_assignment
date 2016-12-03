var clock = new THREE.Clock();
var moveForward = false;
var moveBackward = false;
var turnLeft = false;
var turnRight = false;

function initControls() {
  var onKeyDown = function (e) {
    switch (e.keyCode) {
      case 38: // up arrow
        moveForward = true;
        break;
      case 40: // down arrow
        moveBackward = true;
        break;
      case 37: // left arrow
        turnLeft = true;
        break;
      case 39: // right arrow
        turnRight = true;
        break;
    }
  };

  var onKeyUp = function (e) {
    switch (e.keyCode) {
      case 38: // up arrow
        moveForward = false;
        break;
      case 40: // down arrow
        moveBackward = false;
        break;
      case 37: // left arrow
        turnLeft = false;
        break;
      case 39: // right arrow
        turnRight = false;
        break;
    }
  };

  window.addEventListener('keyup', onKeyUp, false);
  window.addEventListener('keydown', onKeyDown, false);
}

function update() {
  var delta = clock.getDelta();
  var moveDistance = 200 * delta;
  var rotateAngle = Math.PI / 2 * delta;

  if (moveForward) {
    camera.translateZ(-moveDistance);
  }
  if (moveBackward) {
    camera.translateZ(moveDistance);
  }
  if (turnLeft) {
    camera.rotateY(rotateAngle);
  }
  if (turnRight) {
    camera.rotateY(-rotateAngle);
  }

  camera.updateMatrix();
  camera.updateProjectionMatrix();
}
