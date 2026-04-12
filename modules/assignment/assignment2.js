import gl from "../gl.js";
import { vec3, mat4, quat, glMatrix } from "../cs380/gl-matrix.js";

import * as cs380 from "../cs380/cs380.js";

import { SimpleShader } from "../simple_shader.js";

export default class Assignment2 extends cs380.BaseApp {
  async initialize() {
    // Basic setup for camera
    const { width, height } = gl.canvas.getBoundingClientRect();
    const aspectRatio = width / height;
    this.camera = new cs380.Camera();
    vec3.set(this.camera.transform.localPosition, 0, 2, 9);
    this.camera.transform.lookAt(vec3.fromValues(0, -1, -9));
    mat4.perspective(
      this.camera.projectionMatrix,
      glMatrix.toRadian(45),
      aspectRatio,
      0.01,
      100
    );

    this.thingsToClear = [];

    const orbitControlCenter = vec3.fromValues(0, 0, 0);
    this.simpleOrbitControl = new cs380.utils.SimpleOrbitControl(
      this.camera,
      orbitControlCenter
    );
    this.thingsToClear.push(this.simpleOrbitControl);

    // body
    const bodyMesh = cs380.Mesh.fromData(cs380.primitives.generateCylinder(16, 0.9, 1.5));
    const fatMesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());

    this.thingsToClear.push(bodyMesh, fatMesh);

    // Background
    const simpleShader = await cs380.buildShader(SimpleShader);
    this.thingsToClear.push(simpleShader);

    const planeMesh = cs380.Mesh.fromData(
      cs380.primitives.generatePlane(100, 100)
    );
    this.thingsToClear.push(planeMesh);

    this.plane = new cs380.RenderObject(planeMesh, simpleShader);
    this.plane.uniforms.mainColor = vec3.fromValues(0.6, 0.6, 0.6);
    quat.rotateX(
      this.plane.transform.localRotation,
      this.plane.transform.localRotation,
      Math.PI / 2
    );
    this.verticalPlane = new cs380.RenderObject(planeMesh, simpleShader);
    this.verticalPlane.uniforms.mainColor = vec3.fromValues(0.7, 0.7, 0.7);
    vec3.set(this.verticalPlane.transform.localPosition, 0, 0, -15);
    quat.rotateX(
      this.verticalPlane.transform.localRotation,
      this.verticalPlane.transform.localRotation,
      Math.PI
    );
    this.leftSide = new cs380.RenderObject(planeMesh, simpleShader);
    vec3.set(this.leftSide.transform.localPosition, -7, 0, 0);
    quat.rotateY(
      this.leftSide.transform.localRotation,
      this.leftSide.transform.localRotation,
      -Math.PI / 2
    );
    this.rightSide = new cs380.RenderObject(planeMesh, simpleShader);
    vec3.set(this.rightSide.transform.localPosition, 7, 0, 0);
    quat.rotateY(
      this.rightSide.transform.localRotation,
      this.rightSide.transform.localRotation,
      Math.PI / 2
    );

    // initialize picking shader & buffer
    const pickingShader = await cs380.buildShader(cs380.PickingShader);
    this.pickingBuffer = new cs380.PickingBuffer();
    this.pickingBuffer.initialize(width, height);
    this.thingsToClear.push(pickingShader, this.pickingBuffer);

    //pickableobject
    this.body = new cs380.PickableObject(
      bodyMesh,
      simpleShader,
      pickingShader,
      1
    )

    this.fat = new cs380.PickableObject(
      fatMesh,
      simpleShader,
      pickingShader,
      1
    )

    //initial condition
    //body setting
    vec3.set(this.fat.transform.localScale, 0.9, 0.9, 0.9);
    this.fat.transform.setParent(this.body.transform);
    vec3.set(this.body.transform.localPosition, 0, 1.2, 0.4);

    // Event listener for interactions
    this.handleKeyDown = (e) => {
      // e.repeat is true when the key has been helded for a while
      if (e.repeat) return;
      this.onKeyDown(e.key);
    };
    this.handleMouseDown = (e) => {
      // e.button = 0 if it is left mouse button
      if (e.button !== 0) return;
      this.onMouseDown(e);
    };

    document.addEventListener("keydown", this.handleKeyDown);
    gl.canvas.addEventListener("mousedown", this.handleMouseDown);

    document.getElementById("settings").innerHTML = `
      <h3>Basic requirements</h3>
      <ul>
        <li>Generate 3D geometric objects: cone and cylinder</li>
        <li>Construct your avatar with hierarchical modeling containing at least 10 parts</li>
        <li>Introduce interactive avatar posing from keyboard and mouse inputs</li>
        <li>Show some creativity in your scene</li>
      </ul>
    `;

    // GL settings
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
  }

  onKeyDown(key) {
    console.log(`key down: ${key}`);
  }

  onMouseDown(e) {
    const { left, bottom } = gl.canvas.getBoundingClientRect();
    const x = e.clientX - left;
    const y = bottom - e.clientY;

    // Object with this index has just picked
    const index = this.pickingBuffer.pick(x, y);

    console.log(`onMouseDown() got index ${index}`);
  }

  finalize() {
    // Finalize WebGL objects (mesh, shader, texture, ...)
    document.removeEventListener("keydown", this.handleKeyDown);
    gl.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.thingsToClear.forEach((it) => it.finalize());
  }

  update(elapsed, dt) {
    // Updates before rendering here
    this.simpleOrbitControl.update(dt);

    // Render picking information first
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingBuffer.fbo);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    // renderPicking() here
    
    this.body.renderPicking(this.camera);
    this.fat.renderPicking(this.camera);

    // Render real scene
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // render() here
    this.plane.render(this.camera);
    this.verticalPlane.render(this.camera);
    this.leftSide.render(this.camera);
    this.rightSide.render(this.camera);

    this.body.render(this.camera);
    this.fat.render(this.camera);
    
  }
}
