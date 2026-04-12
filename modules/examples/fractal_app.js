// fractal_app.js -- remained as skeleton yet

import gl from "../gl.js";
import { vec3, mat4, quat } from "../cs380/gl-matrix.js";

import * as cs380 from "../cs380/cs380.js";

import { SolidShader } from "../solid_shader.js";
import { VertexColorShader } from "../vertex_color_shader.js";

export default class FractalApp extends cs380.BaseApp {
  updateMesh(type, level) {
    if (type == undefined || level == undefined) return;

    this.mesh.finalize();

    const new_mesh = this.mesh;
    new_mesh.addAttribute(3); // vertex position

    // Helper functions (add more if necessary)
    function addTriangle(p0, p1, p2) {
      new_mesh.addVertexData(...p0, ...p1, ...p2);
    }

    function addSierpinski(p0, p1, p2, level) {
      // TODO: implement Sierpinski triangle generator
      if (level <= 1) {
        // Base case - push a triangle
        addTriangle(p0, p1, p2);
        return;
      } else {
        let p01 = vec3.create();
        let p02 = vec3.create();
        let p12 = vec3.create();
        vec3.lerp(p01, p0, p1, 1/2);
        vec3.lerp(p02, p0, p2, 1/2);
        vec3.lerp(p12, p1, p2, 1/2);

        addSierpinski(p0, p01, p02, level - 1);
        addSierpinski(p1, p01, p12, level - 1);
        addSierpinski(p2, p02, p12, level - 1);
        
      }
      
    }

    function splitEdge(p0, p1){
      
    }

    function addKoch(p0, p1, p2, level) {
      // TODO: implement Koch snowflake generator
      if (level <= 1){
        addTriangle(p0, p1, p2);
        return;
      } else {
        return;
      }
      
    }

    // Create fractals
    const sqrt3 = Math.sqrt(3);
    let p0 = vec3.fromValues(0, 1, 0);
    let p1 = vec3.fromValues(-0.5 * sqrt3, -0.5, 0);
    let p2 = vec3.fromValues(0.5 * sqrt3, -0.5, 0);
    let c0 = vec3.fromValues(1, 0, 0);
    let c1 = vec3.fromValues(0, 1, 0);
    let c2 = vec3.fromValues(0, 0, 1);

    if (type == "sierpinski") addSierpinski(p0, p1, p2, level);
    else if (type == "koch") addKoch(p0, p1, p2, level);

    new_mesh.initialize();
  }

  async initialize() {
    // Initialize setting div
    const settings = document.getElementById("settings");
    settings.innerHTML = `
        <div>
        <label for="setting-shader">Shader type</label>
        <select id="setting-shader">
            <option value="simple" selected>Simple shader</option>
            <option value="vertex-color">Vertex color shader</option>
        </select>
        </div>

        <div>
        <label for="setting-fractal">Fractal type</label>
        <select id="setting-fractal">
            <option value="sierpinski" selected>Sierpinsky triangle</option>
            <option value="koch">Koch snowflake</option>
        </select>
        </div>

        <div>
        <label for="setting-recursion">Recursion Level</label>
        <input type="range" min=1 max=10 value=1 id="setting-recursion">
        </div>
        
        <div>
        <label for="setting-zoom">Zoom</label>
        <input type="range" min=-7 max=1 value=0.5 step="any" id="setting-zoom">
        </div>
        
        <div>
        <label for="setting-center-x">Center (X)</label>
        <input type="number" min=-1 max=1 value=0 step=0.01 id="setting-center-x">
        </div>
        
        <div>
        <label for="setting-center-y">Center (Y)</label>
        <input type="number" min=-1 max=1 value=0 step=0.01 id="setting-center-y">
        </div>
        
        <div>
        <label for="setting-rotation">Angular speed</label>
        <input type="range" min=0 max=90 value=0 step="any" id="setting-rotation">
        </div>

        <div>
        <label for="setting-rotation-reverse">Clockwise</label>
        <input type="checkbox" id="setting-rotation-reverse" value="reverse">
        </div>`;

    // Initialize render object
    this.mesh = new cs380.Mesh();

    this.solidShader = await cs380.buildShader(SolidShader);

    this.vertexColorShader = await cs380.buildShader(VertexColorShader);

    this.fractal = new cs380.RenderObject(this.mesh, this.solidShader);
    this.fractal.rotation = 0;

    // Initialize camera
    this.camera = new cs380.Camera();

    // Setup GUIs
    cs380.utils.setInputBehavior(
      "setting-shader",
      (val) => {
        this.mainShader =
          val == "simple" ? this.solidShader : this.vertexColorShader;
      },
      true
    );
    cs380.utils.setInputBehavior(
      "setting-fractal",
      (val) => {
        this.meshType = val;
        this.updateMesh(this.meshType, this.meshLevel);
      },
      true
    );
    cs380.utils.setInputBehavior(
      "setting-recursion",
      (val) => {
        this.meshLevel = parseInt(val);
        this.updateMesh(this.meshType, this.meshLevel);
      },
      true
    );
    cs380.utils.setInputBehavior(
      "setting-zoom",
      (val) => (this.zoom = Math.pow(2, parseFloat(val)))
    );
    cs380.utils.setInputBehavior(
      "setting-center-x",
      (val) => (this.centerX = parseFloat(val))
    );
    cs380.utils.setInputBehavior(
      "setting-center-y",
      (val) => (this.centerY = parseFloat(val))
    );
    cs380.utils.setInputBehavior(
      "setting-rotation",
      (val) => (this.angularSpeed = parseFloat(val))
    );
    cs380.utils.setCheckboxBehavior(
      "setting-rotation-reverse",
      (val) => (this.angularDir = val ? -1 : 1)
    );
  }

  finalize() {
    this.mesh.finalize();
    this.solidShader.finalize();
    this.vertexColorShader.finalize();
  }

  update(elapsed, dt) {
    // Update viewport
    const aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    vec3.set(
      this.camera.transform.localPosition,
      this.centerX,
      this.centerY,
      0
    );
    mat4.ortho(
      this.camera.projectionMatrix,
      -this.zoom * aspectRatio,
      +this.zoom * aspectRatio,
      -this.zoom,
      +this.zoom,
      -1,
      1
    );

    // Update rotation
    this.fractal.rotation += this.angularDir * this.angularSpeed * dt;
    quat.setAxisAngle(
      this.fractal.transform.localRotation,
      [0, 0, 1],
      (this.fractal.rotation * Math.PI) / 180
    );

    // Rendering fractal
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.fractal.render(this.camera, this.mainShader);
  }
}
