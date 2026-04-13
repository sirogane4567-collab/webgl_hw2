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
    vec3.set(this.camera.transform.localPosition, 0, 10, 12);
    this.camera.transform.lookAt(vec3.fromValues(0, -1, -9));
    mat4.perspective(
      this.camera.projectionMatrix,
      glMatrix.toRadian(45),
      aspectRatio,
      0.01,
      100
    );

    this.animTime = 0;
    this.isPunching = false;
    this.isKicking = false;
    this.isleft = false;
    this.animDuration = 0.5;

    this.headRotationX = 0;
    this.headRotationY = 0;

    this.greetingThreshold = 12;
    this.greetingAngle = 0;

    this.thingsToClear = [];

    const orbitControlCenter = vec3.fromValues(0, 0, 0);
    this.simpleOrbitControl = new cs380.utils.SimpleOrbitControl(
      this.camera,
      orbitControlCenter
    );
    this.thingsToClear.push(this.simpleOrbitControl);

    // body
    const bodyMesh = cs380.Mesh.fromData(cs380.primitives.generateCylinder(16, 0.9, 2.0));
    const fatMesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());

    this.thingsToClear.push(bodyMesh, fatMesh);

    //leftarm
    const larmjoint1Mesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());
    const larmjoint2Mesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());
    const larm1Mesh = cs380.Mesh.fromData(cs380.primitives.generateCylinder(16, 0.2, 0.9));
    const larm2Mesh = cs380.Mesh.fromData(cs380.primitives.generateCylinder(16, 0.2, 0.9));
    const lhandMesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());

    this.thingsToClear.push(larm1Mesh, larm2Mesh, larmjoint1Mesh, larmjoint2Mesh, lhandMesh);

    //rightarm
    const rarmjoint1Mesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());
    const rarmjoint2Mesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());
    const rarm1Mesh = cs380.Mesh.fromData(cs380.primitives.generateCylinder(16, 0.2, 0.9));
    const rarm2Mesh = cs380.Mesh.fromData(cs380.primitives.generateCylinder(16, 0.2, 0.9));
    const rhandMesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());

    this.thingsToClear.push(rarm1Mesh, rarm2Mesh, rarmjoint1Mesh, rarmjoint2Mesh, rhandMesh);

    //leftleg
    const llegjoint1Mesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());
    const llegjoint2Mesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());
    const llegjoint3Mesh = cs380.Mesh.fromData(cs380.primitives.generateSemiSphere());
    const lleg1Mesh = cs380.Mesh.fromData(cs380.primitives.generateCylinder(16, 0.2, 0.9));
    const lleg2Mesh = cs380.Mesh.fromData(cs380.primitives.generateCylinder(16, 0.2, 0.9));
    const lfootMesh = cs380.Mesh.fromData(cs380.primitives.generateSemiCylinder(8, 0.27, 0.6));

    this.thingsToClear.push(lleg1Mesh, lleg2Mesh, llegjoint1Mesh, llegjoint2Mesh, llegjoint3Mesh,lfootMesh);

    //rightleg
    const rlegjoint1Mesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());
    const rlegjoint2Mesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());
    const rlegjoint3Mesh = cs380.Mesh.fromData(cs380.primitives.generateSemiSphere());
    const rleg1Mesh = cs380.Mesh.fromData(cs380.primitives.generateCylinder(16, 0.2, 0.9));
    const rleg2Mesh = cs380.Mesh.fromData(cs380.primitives.generateCylinder(16, 0.2, 0.9));
    const rfootMesh = cs380.Mesh.fromData(cs380.primitives.generateSemiCylinder(8, 0.27, 0.6));

    this.thingsToClear.push(rleg1Mesh, rleg2Mesh, rlegjoint1Mesh, rlegjoint2Mesh, rlegjoint3Mesh,rfootMesh);

    //head
    const headjointMesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());
    const headMesh = cs380.Mesh.fromData(cs380.primitives.generateCylinder(16, 0.6, 0.9));
    const noseMesh = cs380.Mesh.fromData(cs380.primitives.generateCone(16, 0.1,0.3));
    const eyeMesh = cs380.Mesh.fromData(cs380.primitives.generateSphere());

    this.thingsToClear.push(headjointMesh, headMesh, noseMesh);

    //chain
    const chainMesh = cs380.Mesh.fromData(cs380.primitives.generateTorrus(16, 0.1, 0.04));
    this.thingsToClear.push(chainMesh);

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
    this.chainBody = [];
    for (let i = 0; i < 6; i++){
      this.chainBody[i] = new cs380.PickableObject(
        chainMesh,
        simpleShader,
        pickingShader,
        1
      )
    }

    this.chainLeg = [];
    for (let i = 0; i < 6; i++){
      this.chainLeg[i] = new cs380.PickableObject(
        chainMesh,
        simpleShader,
        pickingShader,
        8
      )
    }
    

    this.body = new cs380.PickableObject(
      bodyMesh,
      simpleShader,
      pickingShader,
      1
    )

    this.larmjoint1 = new cs380.PickableObject(
      larmjoint1Mesh,
      simpleShader,
      pickingShader,
      2
    )
    this.larm1 = new cs380.PickableObject(
      larm1Mesh,
      simpleShader,
      pickingShader,
      2
    )

    this.larmjoint2 = new cs380.PickableObject(
      larmjoint2Mesh,
      simpleShader,
      pickingShader,
      3
    )
    this.larm2 = new cs380.PickableObject(
      larm2Mesh,
      simpleShader,
      pickingShader,
      3
    )

    this.lhand = new cs380.PickableObject(
      lhandMesh,
      simpleShader,
      pickingShader,
      4
    )

    this.rarmjoint1 = new cs380.PickableObject(
      rarmjoint1Mesh,
      simpleShader,
      pickingShader,
      5
    )
    this.rarm1 = new cs380.PickableObject(
      rarm1Mesh,
      simpleShader,
      pickingShader,
      5
    )

    this.rarmjoint2 = new cs380.PickableObject(
      rarmjoint2Mesh,
      simpleShader,
      pickingShader,
      6
    )
    this.rarm2 = new cs380.PickableObject(
      rarm2Mesh,
      simpleShader,
      pickingShader,
      6
    )

    this.rhand = new cs380.PickableObject(
      rhandMesh,
      simpleShader,
      pickingShader,
      7
    )

    this.llegjoint1 = new cs380.PickableObject(
      llegjoint1Mesh,
      simpleShader,
      pickingShader,
      8
    )
    this.lleg1 = new cs380.PickableObject(
      lleg1Mesh,
      simpleShader,
      pickingShader,
      8
    )

    this.llegjoint2 = new cs380.PickableObject(
      llegjoint2Mesh,
      simpleShader,
      pickingShader,
      9
    )
    this.lleg2 = new cs380.PickableObject(
      lleg2Mesh,
      simpleShader,
      pickingShader,
      9
    )

    this.llegjoint3 = new cs380.PickableObject(
      llegjoint3Mesh,
      simpleShader,
      pickingShader,
      10
    )

    this.lfoot = new cs380.PickableObject(
      lfootMesh,
      simpleShader,
      pickingShader,
      10
    )

    this.rlegjoint1 = new cs380.PickableObject(
      rlegjoint1Mesh,
      simpleShader,
      pickingShader,
      11
    )
    this.rleg1 = new cs380.PickableObject(
      rleg1Mesh,
      simpleShader,
      pickingShader,
      11
    )

    this.rlegjoint2 = new cs380.PickableObject(
      rlegjoint2Mesh,
      simpleShader,
      pickingShader,
      12
    )
    this.rleg2 = new cs380.PickableObject(
      rleg2Mesh,
      simpleShader,
      pickingShader,
      12
    )

    this.rlegjoint3 = new cs380.PickableObject(
      rlegjoint3Mesh,
      simpleShader,
      pickingShader,
      13
    )

    this.rfoot = new cs380.PickableObject(
      rfootMesh,
      simpleShader,
      pickingShader,
      13
    )

    this.headjoint = new cs380.PickableObject(
      headjointMesh,
      simpleShader,
      pickingShader,
      14
    )

    this.head = new cs380.PickableObject(
      headMesh,
      simpleShader,
      pickingShader,
      14
    )

    this.nose = new cs380.PickableObject(
      noseMesh,
      simpleShader,
      pickingShader,
      14
    )

    this.leye = new cs380.PickableObject(
      eyeMesh,
      simpleShader,
      pickingShader,
      14
    )

    this.reye = new cs380.PickableObject(
      eyeMesh,
      simpleShader,
      pickingShader,
      14
    )
    

    const woodLight = vec3.fromValues(0.72, 0.52, 0.30);

    // body
    this.body.uniforms.mainColor = woodLight;

    // left arm
    this.larmjoint1.uniforms.mainColor = woodLight;
    this.larm1.uniforms.mainColor = woodLight;
    this.larmjoint2.uniforms.mainColor = woodLight;
    this.larm2.uniforms.mainColor = woodLight;
    this.lhand.uniforms.mainColor = woodLight;

    // right arm
    this.rarmjoint1.uniforms.mainColor = woodLight;
    this.rarm1.uniforms.mainColor = woodLight;
    this.rarmjoint2.uniforms.mainColor = woodLight;
    this.rarm2.uniforms.mainColor = woodLight;
    this.rhand.uniforms.mainColor = woodLight;

    // left leg
    this.llegjoint1.uniforms.mainColor = woodLight;
    this.lleg1.uniforms.mainColor = woodLight;
    this.llegjoint2.uniforms.mainColor = woodLight;
    this.lleg2.uniforms.mainColor = woodLight;
    this.llegjoint3.uniforms.mainColor = woodLight;
    this.lfoot.uniforms.mainColor = woodLight;

    // right leg
    this.rlegjoint1.uniforms.mainColor = woodLight;
    this.rleg1.uniforms.mainColor = woodLight;
    this.rlegjoint2.uniforms.mainColor = woodLight;
    this.rleg2.uniforms.mainColor = woodLight;
    this.rlegjoint3.uniforms.mainColor = woodLight;
    this.rfoot.uniforms.mainColor = woodLight;

    //head
    this.head.uniforms.mainColor = woodLight;
    this.headjoint.uniforms.mainColor = woodLight;
    this.nose.uniforms.mainColor = woodLight;

    this.chainBody.forEach((e) => e.uniforms.mainColor = woodLight);
    this.chainLeg.forEach((e) => e.uniforms.mainColor = woodLight);

    const yellow = vec3.fromValues(1.0, 1.0, 0.0);

    this.leye.uniforms.mainColor = yellow;
    this.reye.uniforms.mainColor = yellow;
    

    //initial condition
    //body setting

    //arm setting
    this.larmjoint1.transform.setParent(this.body.transform);
    this.larm1.transform.setParent(this.larmjoint1.transform);

    this.larmjoint2.transform.setParent(this.larm1.transform);
    this.larm2.transform.setParent(this.larmjoint2.transform);
    
    this.lhand.transform.setParent(this.larm2.transform);

    vec3.set(this.larmjoint1.transform.localScale, 0.15, 0.15, 0.15);
    vec3.set(this.larmjoint1.transform.localPosition, -0.95, 1.8, 0);

    vec3.set(this.larm1.transform.localPosition, 0, 0.05, 0);

    vec3.set(this.larmjoint2.transform.localScale, 0.15, 0.15, 0.15);
    vec3.set(this.larmjoint2.transform.localPosition, 0, 0.95, 0);
    
    vec3.set(this.larm2.transform.localPosition, 0.0, 0.05, 0.0);

    vec3.set(this.lhand.transform.localScale, 0.3, 0.3, 0.3);
    vec3.set(this.lhand.transform.localPosition, 0.0, 0.9, 0.0);

    quat.rotateZ(
      this.larmjoint1.transform.localRotation,
      this.larmjoint1.transform.localRotation,
      Math.PI-Math.PI / 6
    );

    //arm setting
    this.rarmjoint1.transform.setParent(this.body.transform);
    this.rarm1.transform.setParent(this.rarmjoint1.transform);

    this.rarmjoint2.transform.setParent(this.rarm1.transform);
    this.rarm2.transform.setParent(this.rarmjoint2.transform);
    
    this.rhand.transform.setParent(this.rarm2.transform);

    vec3.set(this.rarmjoint1.transform.localScale, 0.15, 0.15, 0.15);
    vec3.set(this.rarmjoint1.transform.localPosition, 0.95, 1.8, 0);

    vec3.set(this.rarm1.transform.localPosition, 0, 0.05, 0);

    vec3.set(this.rarmjoint2.transform.localScale, 0.15, 0.15, 0.15);
    vec3.set(this.rarmjoint2.transform.localPosition, 0, 0.95, 0);
    
    vec3.set(this.rarm2.transform.localPosition, 0.0, 0.05, 0.0);

    vec3.set(this.rhand.transform.localScale, 0.3, 0.3, 0.3);
    vec3.set(this.rhand.transform.localPosition, 0.0, 0.9, 0.0);

    quat.rotateZ(
      this.rarmjoint1.transform.localRotation,
      this.rarmjoint1.transform.localRotation,
      Math.PI+Math.PI / 6
    );

    vec3.set(this.body.transform.localPosition, 0,2.0,0);

    //leg setting
    this.llegjoint1.transform.setParent(this.body.transform);
    this.lleg1.transform.setParent(this.llegjoint1.transform);

    this.llegjoint2.transform.setParent(this.lleg1.transform);
    this.lleg2.transform.setParent(this.llegjoint2.transform);
    
    this.llegjoint3.transform.setParent(this.lleg2.transform);
    this.lfoot.transform.setParent(this.llegjoint3.transform);
    
    vec3.set(this.llegjoint1.transform.localScale, 0.15, 0.15, 0.15);
    vec3.set(this.llegjoint1.transform.localPosition, -0.35, 0, 0);

    vec3.set(this.lleg1.transform.localPosition, 0.0, -0.95, 0);

    vec3.set(this.llegjoint2.transform.localScale, 0.15, 0.15, 0.15);
    vec3.set(this.llegjoint2.transform.localPosition, 0.0, -0.05, 0);

    vec3.set(this.lleg2.transform.localPosition, 0.0, -0.95, 0);
    
    vec3.set(this.llegjoint3.transform.localScale, 0.15, 0.15, 0.15);
    vec3.set(this.llegjoint3.transform.localPosition, 0.0, 0, 0);

    vec3.set(this.lfoot.transform.localPosition, 0.0, 0, 0);

    quat.rotateZ(
      this.lfoot.transform.localRotation,
      this.lfoot.transform.localRotation,
      Math.PI / 2
    );

    quat.rotateX(
      this.lfoot.transform.localRotation,
      this.lfoot.transform.localRotation,
      Math.PI / 2
    );

    this.rlegjoint1.transform.setParent(this.body.transform);
    this.rleg1.transform.setParent(this.rlegjoint1.transform);

    this.rlegjoint2.transform.setParent(this.rleg1.transform);
    this.rleg2.transform.setParent(this.rlegjoint2.transform);
    
    this.rlegjoint3.transform.setParent(this.rleg2.transform);
    this.rfoot.transform.setParent(this.rlegjoint3.transform);
    
    vec3.set(this.rlegjoint1.transform.localScale, 0.15, 0.15, 0.15);
    vec3.set(this.rlegjoint1.transform.localPosition, 0.35, 0, 0);

    vec3.set(this.rleg1.transform.localPosition, 0.0, -0.95, 0);

    vec3.set(this.rlegjoint2.transform.localScale, 0.15, 0.15, 0.15);
    vec3.set(this.rlegjoint2.transform.localPosition, 0.0, -0.05, 0);

    vec3.set(this.rleg2.transform.localPosition, 0.0, -0.95, 0);
    
    vec3.set(this.rlegjoint3.transform.localScale, 0.15, 0.15, 0.15);
    vec3.set(this.rlegjoint3.transform.localPosition, 0.0, 0, 0);

    vec3.set(this.rfoot.transform.localPosition, 0.0, 0, 0);

    quat.rotateZ(
      this.rfoot.transform.localRotation,
      this.rfoot.transform.localRotation,
      Math.PI / 2
    );

    quat.rotateX(
      this.rfoot.transform.localRotation,
      this.rfoot.transform.localRotation,
      Math.PI / 2
    );

    //face setting

    this.headjoint.transform.setParent(this.body.transform);
    this.head.transform.setParent(this.headjoint.transform);

    vec3.set(this.headjoint.transform.localPosition, 0, 2.05, 0);
    vec3.set(this.headjoint.transform.localScale, 0.15, 0.15, 0.15);

    vec3.set(this.head.transform.localPosition, 0.0, 0.05, 0.0);

    this.nose.transform.setParent(this.head.transform);

    vec3.set(this.nose.transform.localPosition, 0, 0.4, 0.55);
    quat.rotateX(
      this.nose.transform.localRotation,
      this.nose.transform.localRotation,
      Math.PI / 2
    );

    this.leye.transform.setParent(this.head.transform);
    this.reye.transform.setParent(this.head.transform);

    vec3.set(this.leye.transform.localScale, 0.1, 0.1, 0.1);
    vec3.set(this.reye.transform.localScale, 0.1, 0.1, 0.1);

    vec3.set(this.leye.transform.localPosition, -0.25, 0.55, 0.55);
    vec3.set(this.reye.transform.localPosition, 0.25, 0.55, 0.55);

    //bodychain
    this.chainBody.forEach((e) => vec3.set(e.transform.localScale, 1.0, 0.5, 0.5));
    this.chainBody[0].transform.setParent(this.body.transform);
    vec3.set(this.chainBody[0].transform.localPosition, -0.9, 0.2, 0.0);
    
    this.chainBody[1].transform.setParent(this.chainBody[0].transform);
    quat.rotateX(
      this.chainBody[1].transform.localRotation,
      this.chainBody[1].transform.localRotation,
      Math.PI / 2
    );
    quat.rotateY(
      this.chainBody[1].transform.localRotation,
      this.chainBody[1].transform.localRotation,
      Math.PI / 2
    );

    vec3.set(this.chainBody[1].transform.localPosition, -0.1, -0.1, 0.0);
    
    for(let i = 2; i<6; i++){
      this.chainBody[i].transform.setParent(this.chainBody[i-1].transform);
      vec3.set(this.chainBody[i].transform.localPosition, -0.2,0,0);
      
      quat.rotateX(
        this.chainBody[i].transform.localRotation,
        this.chainBody[i].transform.localRotation,
        Math.PI / 2
      );
    }

    //legchain
    this.chainLeg.forEach((e) => vec3.set(e.transform.localScale, 1.0, 0.5, 0.5));
    this.chainLeg[0].transform.setParent(this.lleg1.transform);
    vec3.set(this.chainLeg[0].transform.localPosition, -0.2, 0.4, 0.0);
    
    this.chainLeg[1].transform.setParent(this.chainLeg[0].transform);
    quat.rotateX(
      this.chainLeg[1].transform.localRotation,
      this.chainLeg[1].transform.localRotation,
      Math.PI / 2
    );
    quat.rotateY(
      this.chainLeg[1].transform.localRotation,
      this.chainLeg[1].transform.localRotation,
      Math.PI / 2
    );

    vec3.set(this.chainLeg[1].transform.localPosition, -0.1, -0.1, 0.0);
    
    for(let i = 2; i<6; i++){
      this.chainLeg[i].transform.setParent(this.chainLeg[i-1].transform);
      vec3.set(this.chainLeg[i].transform.localPosition, -0.2,0,0);
      
      quat.rotateX(
        this.chainLeg[i].transform.localRotation,
        this.chainLeg[i].transform.localRotation,
        Math.PI / 2
      );
    }
    

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
    const step = Math.PI / 12;

    switch (key.toLowerCase()) {
      case 'w':
        this.headRotationX -= step;
        break;
      case 's':
        this.headRotationX += step;
        break;
      case 'a':
        this.headRotationY -= step;
        break;
      case 'd':
        this.headRotationY += step;
        break;
      case 'r':
        this.headRotationX = 0;
        this.headRotationY = 0;
        break;
    }

    const limit = Math.PI / 3;
    this.headRotationX = Math.max(-limit, Math.min(limit, this.headRotationX));
    this.headRotationY = Math.max(-limit, Math.min(limit, this.headRotationY));

    quat.identity(this.headjoint.transform.localRotation);
    quat.rotateY(this.headjoint.transform.localRotation, this.headjoint.transform.localRotation, this.headRotationY);
    quat.rotateX(this.headjoint.transform.localRotation, this.headjoint.transform.localRotation, this.headRotationX);

    console.log(`key down: ${key}`);
  }

  onMouseDown(e) {
    const { left, bottom } = gl.canvas.getBoundingClientRect();
    const x = e.clientX - left;
    const y = bottom - e.clientY;

    // Object with this index has just picked
    const index = this.pickingBuffer.pick(x, y);

    if (index == 2 || index == 3) {
      if (!this.isPunching) {
        this.isPunching = true;
        this.isleft = true;
        this.animTime = 0;
      }
    }
    else if (index == 8 || index == 9) {
      if (!this.isKicking) {
        this.isKicking = true;
        this.isleft = true;
        this.animTime = 0;
      }
    }
    else if (index == 5 || index == 6) {
      if (!this.isKicking) {
        this.isPunching = true;
        this.isleft = false;
        this.animTime = 0;
      }
    }
    else if (index == 11 || index == 12) {
      if (!this.isKicking) {
        this.isKicking = true;
        this.isleft = false;
        this.animTime = 0;
      }
    }

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

    const cameraPos = this.camera.transform.localPosition;
    const bodyPos = this.body.transform.localPosition;
    const distance = vec3.distance(cameraPos, bodyPos);

    let targetAngle = 0;
    if (distance < this.greetingThreshold) {
      const ratio = Math.max(0, (this.greetingThreshold - distance) / 3.0);
      targetAngle = Math.min(ratio, 1.0) * (Math.PI / 6); 
    }

    this.greetingAngle += (targetAngle - this.greetingAngle) * dt * 3.0;

    quat.identity(this.headjoint.transform.localRotation);
    quat.rotateY(this.headjoint.transform.localRotation, this.headjoint.transform.localRotation, this.headRotationY);
    quat.rotateX(this.headjoint.transform.localRotation, this.headjoint.transform.localRotation, this.headRotationX + this.greetingAngle);

    // console.log(distance);

    if (this.isPunching || this.isKicking) {
      this.animTime += dt;
      const progress = Math.min(this.animTime / this.animDuration, 1.0);
      const theta = Math.sin(progress * Math.PI); 

      if (this.isPunching && this.isleft) {
        quat.identity(this.larmjoint1.transform.localRotation);
        quat.rotateZ(this.larmjoint1.transform.localRotation, this.larmjoint1.transform.localRotation, Math.PI - Math.PI/6);
        quat.rotateX(this.larmjoint1.transform.localRotation, this.larmjoint1.transform.localRotation, theta * Math.PI/2);
      }

      if (this.isKicking && this.isleft) {
        quat.identity(this.llegjoint1.transform.localRotation);
        quat.rotateX(this.llegjoint1.transform.localRotation, this.llegjoint1.transform.localRotation, -theta * Math.PI/3);
      }

      if (this.isPunching && !this.isleft) {
        quat.identity(this.rarmjoint1.transform.localRotation);
        quat.rotateZ(this.rarmjoint1.transform.localRotation, this.rarmjoint1.transform.localRotation, Math.PI + Math.PI/6);
        quat.rotateX(this.rarmjoint1.transform.localRotation, this.rarmjoint1.transform.localRotation, theta * Math.PI/2);
      }

      if (this.isKicking && !this.isleft) {
        quat.identity(this.rlegjoint1.transform.localRotation);
        quat.rotateX(this.rlegjoint1.transform.localRotation, this.rlegjoint1.transform.localRotation, -theta * Math.PI/3);
      }

      if (progress >= 1.0) {
        this.isPunching = false;
        this.isKicking = false;
      }
    }

    // Render picking information first
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingBuffer.fbo);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    // renderPicking() here
    
    this.body.renderPicking(this.camera);

    this.larmjoint1.renderPicking(this.camera);
    this.larm1.renderPicking(this.camera);
    this.larmjoint2.renderPicking(this.camera);
    this.larm2.renderPicking(this.camera);
    this.lhand.renderPicking(this.camera);

    this.rarmjoint1.renderPicking(this.camera);
    this.rarm1.renderPicking(this.camera);
    this.rarmjoint2.renderPicking(this.camera);
    this.rarm2.renderPicking(this.camera);
    this.rhand.renderPicking(this.camera);

    this.llegjoint1.renderPicking(this.camera);
    this.lleg1.renderPicking(this.camera);
    this.llegjoint2.renderPicking(this.camera);
    this.lleg2.renderPicking(this.camera);
    this.llegjoint3.renderPicking(this.camera);
    this.lfoot.renderPicking(this.camera);

    this.rlegjoint1.renderPicking(this.camera);
    this.rleg1.renderPicking(this.camera);
    this.rlegjoint2.renderPicking(this.camera);
    this.rleg2.renderPicking(this.camera);
    this.rlegjoint3.renderPicking(this.camera);
    this.rfoot.renderPicking(this.camera);

    this.headjoint.renderPicking(this.camera);
    this.head.renderPicking(this.camera);
    this.nose.renderPicking(this.camera);

    this.chainBody.forEach((e) => e.renderPicking(this.camera));
    this.chainLeg.forEach((e) => e.renderPicking(this.camera));

    this.leye.renderPicking(this.camera);
    this.reye.renderPicking(this.camera);

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

    this.larmjoint1.render(this.camera);
    this.larm1.render(this.camera);
    this.larmjoint2.render(this.camera);
    this.larm2.render(this.camera);
    this.lhand.render(this.camera);

    this.rarmjoint1.render(this.camera);
    this.rarm1.render(this.camera);
    this.rarmjoint2.render(this.camera);
    this.rarm2.render(this.camera);
    this.rhand.render(this.camera);

    this.llegjoint1.render(this.camera);
    this.lleg1.render(this.camera);
    this.llegjoint2.render(this.camera);
    this.lleg2.render(this.camera);
    this.llegjoint3.render(this.camera);
    this.lfoot.render(this.camera);
    
    this.rlegjoint1.render(this.camera);
    this.rleg1.render(this.camera);
    this.rlegjoint2.render(this.camera);
    this.rleg2.render(this.camera);
    this.rlegjoint3.render(this.camera);
    this.rfoot.render(this.camera);

    this.headjoint.render(this.camera);
    this.head.render(this.camera);
    this.nose.render(this.camera);

    this.chainBody.forEach((e) => e.render(this.camera));
    this.chainLeg.forEach((e) => e.render(this.camera));

    this.leye.render(this.camera);
    this.reye.render(this.camera);

  }
}
