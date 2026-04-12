import { vec2, vec3 } from "./gl-matrix.js";
export function generatePlane(xlen = 1, ylen = 1) {
  const data = {
    vertices: [],
    vertexNormals: [],
    textures: [],
    indices: [],
  };

  //      ^ y
  // 2---------1
  // |    |    |
  // |----+----|-> x
  // |    |    |
  // 3---------0
  // ( facing -z direction)

  xlen *= 0.5;
  ylen *= 0.5;

  data.vertices.push(
    +xlen,
    -ylen,
    0,
    -xlen,
    -ylen,
    0,
    -xlen,
    +ylen,
    0,
    +xlen,
    +ylen,
    0
  );

  data.textures.push(
    // from bottom-left, CCW
    0,
    0,
    1,
    0,
    1,
    1,
    0,
    1
  );

  data.vertexNormals.push(0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1);

  data.indices.push(0, 1, 2, 0, 2, 3);

  return data;
}

export function generateCube(xlen = 1, ylen = 1, zlen = 1) {
  const data = {
    vertices: [],
    vertexNormals: [],
    textures: [],
    indices: [],
  };

  xlen *= 0.5;
  ylen *= 0.5;
  zlen *= 0.5;

  /*
   **      3-----4
   **     /|    /|
   **    2-----5 |
   **    | 0---|-7
   **    |/    |/
   **    1-----6
   **/
  const points = [
    vec3.fromValues(-xlen, -ylen, -zlen),
    vec3.fromValues(-xlen, -ylen, +zlen),
    vec3.fromValues(-xlen, +ylen, +zlen),
    vec3.fromValues(-xlen, +ylen, -zlen),
    vec3.fromValues(+xlen, +ylen, -zlen),
    vec3.fromValues(+xlen, +ylen, +zlen),
    vec3.fromValues(+xlen, -ylen, +zlen),
    vec3.fromValues(+xlen, -ylen, -zlen),
  ];

  const uv = [
    // from bottom-left, CCW
    vec2.fromValues(0, 0),
    vec2.fromValues(1, 0),
    vec2.fromValues(1, 1),
    vec2.fromValues(0, 1),
  ];

  const normals = {
    posX: vec3.fromValues(+1, 0, 0),
    negX: vec3.fromValues(-1, 0, 0),
    posY: vec3.fromValues(0, +1, 0),
    negY: vec3.fromValues(0, -1, 0),
    posZ: vec3.fromValues(0, 0, +1),
    negZ: vec3.fromValues(0, 0, -1),
  };

  let index = 0;
  const addTri = (n, ...idx) => {
    for (const [pi, ui] of idx) {
      data.vertices.push(...points[pi]);
      data.vertexNormals.push(...n);
      data.textures.push(...uv[ui]);
      data.indices.push(index++);
    }
  };

  const addQuad = (f0, f1, f2, f3, n) => {
    addTri(n, [f0, 0], [f1, 1], [f2, 2]);
    addTri(n, [f0, 0], [f2, 2], [f3, 3]);
  };

  addQuad(1, 6, 5, 2, normals.posZ);
  addQuad(3, 2, 5, 4, normals.posY);
  addQuad(5, 6, 7, 4, normals.posX);
  addQuad(3, 4, 7, 0, normals.negZ);
  addQuad(7, 6, 1, 0, normals.negY);
  addQuad(3, 0, 1, 2, normals.negX);

  return data;
}

export function generateSphere(longitudes = 16, latitudes = 8) {
  const data = {
    vertices: [],
    vertexNormals: [],
    textures: [],
    indices: [],
  };

  const addTri = (p0, p1, p2) => {
    data.vertices.push(...p0, ...p1, ...p2);
    data.vertexNormals.push(
      -p0[0], -p0[1], -p0[2],
      -p1[0], -p1[1], -p1[2],
      -p2[0], -p2[1], -p2[2]
    );
  };

  const addQuad = (p0, p1, p2, p3) => {
    addTri(p0, p1, p2);
    addTri(p0, p2, p3);
  };

  const unitTheta = Math.PI / latitudes;
  const unitPhi = 2 * Math.PI / longitudes;

  for (let theta = 0; theta < latitudes; theta++) {
    for (let phi = 0; phi < longitudes; phi++) {

      const phi0 = unitPhi * phi;
      const phi1 = unitPhi * (phi + 1);

      if (theta == 0) {
        let y = Math.cos(unitTheta);
        let rho = Math.sin(unitTheta);

        const p0 = [rho * Math.cos(phi0), y, rho * Math.sin(phi0)];
        const p1 = [rho * Math.cos(phi1), y, rho * Math.sin(phi1)];
        const pole = [0, 1, 0];

        addTri(pole, p0, p1);
      }

      else if (theta == latitudes - 1) {
        let y = Math.cos(unitTheta * (latitudes - 1));
        let rho = Math.sin(unitTheta * (latitudes - 1));

        const p0 = [rho * Math.cos(phi0), y, rho * Math.sin(phi0)];
        const p1 = [rho * Math.cos(phi1), y, rho * Math.sin(phi1)];
        const pole = [0, -1, 0];

        addTri(p0, pole, p1);
      }

      else {
        let y1 = Math.cos(unitTheta * theta);
        let y2 = Math.cos(unitTheta * (theta + 1));

        let rho1 = Math.sin(unitTheta * theta);
        let rho2 = Math.sin(unitTheta * (theta + 1));

        const p0 = [rho1 * Math.cos(phi0), y1, rho1 * Math.sin(phi0)];
        const p1 = [rho1 * Math.cos(phi1), y1, rho1 * Math.sin(phi1)];
        const p2 = [rho2 * Math.cos(phi1), y2, rho2 * Math.sin(phi1)];
        const p3 = [rho2 * Math.cos(phi0), y2, rho2 * Math.sin(phi0)];

        addQuad(p0, p1, p2, p3);
      }
    }
  }

  return data;
}


export function generateCone(sides = 16, radius = 1, height = 1) {
  const data = {
    vertices: [],
    vertexNormals: [],
    textures: [],
    indices: [],
  };

  const addTri = (p0, p1, p2, mode) => {
    data.vertices.push(...p0, ...p1, ...p2);

    if (mode == 0){
      data.vertexNormals.push(...helper(p0), ...helper(p1), ...helper(p2));
    }
    else{
      data.vertexNormals.push(...[0, -1, 0] ,...[0, -1, 0], ...[0, -1, 0]);
    }
  };

  const helper = (p) => {
    let temp = radius*radius/height;
    let x = p[0];
    let z = p[2];
    let len = Math.sqrt(x*x + z*z + temp*temp);
    return [x/len, temp/len, z/len];
    
  }

  // TODO: Implement cone generation


  // Create bottom
  let bottom_n = [0, -1, 0];

  let center = [0, 0, 0];
  let top = [0, height, 0];
  let angle = 2 * Math.PI / sides

  for (let i = 0; i<sides; i++){
    let temp1 = [radius * Math.sin(i*angle), 0, radius * Math.cos(i*angle)];
    let temp2 = [radius * Math.sin((i+1)*angle), 0, radius * Math.cos((i+1)*angle)];

    addTri(center, temp2, temp1, 1);

    addTri(top, temp1, temp2, 0);
  }
 
  // Create sides

  return data;
}

export function generateCylinder(sides = 16, radius = 1, height = 1) {
  const data = {
    vertices: [],
    vertexNormals: [],
    textures: [],
    indices: [],
  };

  const addTri = (p0, p1, p2, mode) => {
    data.vertices.push(...p0, ...p1, ...p2);

    if (mode == 0){
      data.vertexNormals.push(...[0, 1, 0], ...[0, 1, 0], ...[0, 1, 0]);
    }
    else if (mode == 1){
      data.vertexNormals.push(...[0, -1, 0] ,...[0, -1, 0], ...[0, -1, 0]);
    }
    else{
      data.vertexNormals.push(...helper(p0), ...helper(p1), ...helper(p2));
    }
  };

  const helper = (p) => {
    let x = p[0];
    let z = p[2];
    let len = Math.sqrt(x*x + z*z);
    return [x/len, 0, z/len];
    
  }

  const addQuad = (p0, p1, p2, p3, mode) => {
    addTri(p0, p1, p2, mode);
    addTri(p0, p2, p3 ,mode);
  };

  // TODO: Implement cylinder generation

  let centerbottom = [0, 0, 0];
  let centertop = [0, height, 0];
  let angle = 2 * Math.PI / sides

  for (let i = 0; i<sides; i++){
    let temp1 = [radius * Math.sin(i*angle), 0, radius * Math.cos(i*angle)];
    let temp2 = [radius * Math.sin((i+1)*angle), 0, radius * Math.cos((i+1)*angle)];
    let temp3 = [radius * Math.sin(i*angle), height, radius * Math.cos(i*angle)];
    let temp4 = [radius * Math.sin((i+1)*angle), height, radius * Math.cos((i+1)*angle)];

    addTri(centerbottom, temp2, temp1, 1);
    addTri(centertop, temp3, temp4, 0);

    addQuad(temp1, temp2, temp4, temp3, 2);
  }


  // Create bottom
  
  // Create top
 

  // Create sides


  return data;
}
