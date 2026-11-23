import { gScale, setSizeCanvas } from "./losOS/gAttr.js";

function __init__() {
  const canvas = document.getElementById("canvasBack");
  const gl = canvas.getContext("webgl2");
  canvas.width = Math.max(1, Math.floor(window.innerWidth));
  canvas.height = Math.max(1, Math.floor(window.innerHeight));

  if (!gl) {
    console.error("WebGL2 not supported");
  }

  return [gl, canvas];
}

const [gl, canvas] = __init__();

// --- 1. Shaders ---
const vertexShaderSource = `#version 300 es
  in vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `#version 300 es
  precision highp float;

  uniform float u_time;
  uniform vec2 u_res;
  uniform float u_cellSize;

  out vec4 outColor;

  void main() {
    float cellPx = max(u_cellSize, 1.0);
    int cx = int(floor(gl_FragCoord.x / cellPx));
    int cy = int(floor(gl_FragCoord.y / cellPx));

    float shade = ((cx + cy) % 2 == 0) ? 0.8 : 0.65;
    outColor = vec4(vec3(shade), 1.0);
  }
`;

// --- 2. Compile & Link Program ---
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(program));
}

// --- 3. Fullscreen Quad (Triangle Strip = 4 Vertices) ---
const quadVertices = new Float32Array([
  -1.0,  1.0, // Top-left
  -1.0, -1.0, // Bottom-left
   1.0,  1.0, // Top-right
   1.0, -1.0  // Bottom-right
]);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

const posLoc = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(posLoc);
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

const timeLoc = gl.getUniformLocation(program, "u_time");
const resLoc = gl.getUniformLocation(program, "u_res");
const cellSizeLoc = gl.getUniformLocation(program, "u_cellSize");

// --- 4. Resize Handling ---
function resize() {
  const displayWidth = Math.max(1, Math.floor(canvas.clientWidth || window.innerWidth));
  const displayHeight = Math.max(1, Math.floor(canvas.clientHeight || window.innerHeight));
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
}

// --- 5. Render Loop ---
function render(now) {
  resize();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  const cellSize = 2;//Math.max(1.0, Math.round(gScale || 1.0));

  gl.uniform1f(timeLoc, now * 0.001);
  gl.uniform2f(resLoc, canvas.width, canvas.height);
  gl.uniform1f(cellSizeLoc, cellSize);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);