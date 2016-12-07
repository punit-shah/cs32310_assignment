var TreePainting = function (x, y) {
  this.axiom = 'F';
  this.rule = 'FF-[-F+F+F]+[+F-F-F]';
  this.rule2 = '';
  this.iterations = 5;
  this.delta = 20; // incremental angle
  this.deltaRandomness = 10;
  this.alpha = 90; // heading direction
  this.step = 3;  // branch length
  this.stepRandomness = 2;
  this.color = 'rgb(0,17,0)';

  return this.getPainting(x, y);
};

TreePainting.prototype = {
  getPainting: function (x, y) {
    var painting = new THREE.Object3D();

    var texture = this.makeCanvas();
    var tree = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(x, y),
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1,
        metalness: 0.3,
      })
    );
    tree.receiveShadow = true;
    painting.add(tree);

    var frame = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(x * 1.1, y * 1.1),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
      })
    );
    frame.translateZ(-1);
    painting.add(frame);

    return painting;
  },

  makeCanvas: function () {
    var canvas = document.createElement('canvas');
    this.context = canvas.getContext('2d');

    canvas.width = canvas.height = 256;

    this.context.fillStyle = '#ffffff';
    this.context.fillRect(0, 0, canvas.width, canvas.height);

    this.drawTree(canvas.width / 2, canvas.height - 1);

    var canvasTexture = new THREE.CanvasTexture(canvas);
    return canvasTexture;
  },

  drawLine: function (x, y, x0, y0, lineWidth, lineColor) {
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.lineWidth = lineWidth;
    this.context.lineTo(x0, y0);
    this.context.strokeStyle = lineColor;
    this.context.stroke();
  },

  drawTree: function (x, y) {
    this.plant = this.getAxiomTree();

    var stackX = [];
    var stackY = [];
    var stackA = [];
    var alpha = -this.alpha * Math.PI / 180;
    var x0 = x;
    var y0 = y;

    for (var i = 0; i < this.plant.length; i++) {
      var a = this.plant[i];
      if (a == "+") {
        alpha -= this.getDelta();
      }
      if (a == "-") {
        alpha += this.getDelta();
      }
      // move forward and draw a line
      if (a == "F") {
        x = x0 + Math.cos(alpha) * this.getStep();
        y = y0 + Math.sin(alpha) * this.getStep();

        this.drawLine(x0, y0, x, y, this.getLineWidth(i), this.getLineColor(i));
        x0 = x; y0 = y;
      }
      // move without drawing a line
      if (a == "f") {
        x0 = x0 + Math.cos(alpha) * this.getStep();
        y0 = y0 + Math.sin(alpha) * this.getStep();
      }
      if (a == "[") {
        stackX.push(x0);
        stackY[stackY.length] = y0;
        stackA[stackA.length] = alpha;
      }
      if (a == "]") {
        x0 = stackX.pop();
        y0 = stackY.pop();
        alpha = stackA.pop();
      }
    }
  },

  getAxiomTree: function () {
    var axiom = this.axiom;
    var newF = this.rule;
    var newf = 'ff';
    var newX = this.rule2;
    var level = this.iterations;

    while (level > 0) {
      var T = '';
      for (var j=0; j < axiom.length; j++) {
        var a = axiom[j];
        if (a == 'F') {
          T += newF;
        } else if (a == 'f') {
          T += newf;
        } else if (a == 'X') {
          T += newX;
        } else {
          T += a;
        }
      }
      axiom = T;
      level--;
    }

    return axiom;
  },

  getDelta: function () {
    var initialDelta = this.delta;
    return this.getRandomValue(initialDelta, this.deltaRandomness) * Math.PI / 180;
  },

  getRandomValue: function (value, randomness) {
    var min = Math.ceil(value - randomness);
    var max = Math.floor(value + randomness);
    var randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomValue;
  },

  getStep: function () {
    var initialStep = this.step;
    return this.getRandomValue(initialStep, this.stepRandomness);
  },

  getLineWidth: function (iteration) {
    return 2 - iteration / this.plant.length * 5;
  },

  getLineColor: function (iteration) {
    var rgb = this.color.slice(4, -1).split(',');
    for (var i = 0; i < rgb.length; i++) {
      rgb[i] = parseInt(rgb[i], 10);
    }
    rgb[1] += Math.floor(iteration / 512);
    return 'rgb(' + rgb.join(',') + ')';
  },
};
