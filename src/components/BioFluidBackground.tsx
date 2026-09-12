import { useEffect, useRef } from 'react';

const vertexShader = `
precision highp float;
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
  v_uv = a_pos * 0.5 + 0.5;
}
`;

const fragmentShader = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform float u_flowSpeed;
uniform float u_magneticDistortion;
uniform float u_colorIntensity;
varying vec2 v_uv;

#define PI 3.14159265359
#define TAU 6.28318530718

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hash1(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p, int octaves) {
  float val = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    val += amp * noise(p * freq);
    freq *= 2.03;
    amp *= 0.49;
    p += vec2(1.7, 9.2);
  }
  return val;
}

vec2 grad(vec2 p) {
  float n0 = noise(p);
  float nx = noise(p + vec2(0.01, 0.0));
  float ny = noise(p + vec2(0.0, 0.01));
  return vec2(nx - n0, ny - n0) / 0.01;
}

vec2 curl(vec2 p) {
  vec2 dx = vec2(0.001, 0.0);
  vec2 dy = vec2(0.0, 0.001);
  float dydx = grad(p + dx).y;
  float dxdy = grad(p + dy).x;
  return vec2(dydx - grad(p - dx).y, dxdy - grad(p - dy).x) / (2.0 * 0.001);
}

float rippleDistortion(vec2 uv, float t) {
  float dist = 0.0;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float speed = 0.3 + fi * 0.15;
    float freq = 3.0 + fi * 2.5;
    float phase = t * speed + fi * TAU * 0.25;
    dist += sin(uv.x * freq + phase) * cos(uv.y * freq * 0.7 + phase * 0.8) * (0.015 / (1.0 + fi));
  }
  return dist;
}

float vignette(vec2 uv) {
  return pow(1.0 - dot(uv, uv) * 0.5, 2.0);
}

vec3 palette(float t, float intensity) {
  return 0.5 + 0.5 * cos(TAU * (vec3(1.0, 1.0, 1.0) * t + vec3(0.0, 0.33, 0.67))) * intensity;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);
  float t = u_time * u_flowSpeed;
  
  vec2 mouseShift = vec2(sin(t * 0.07) * 0.15, cos(t * 0.09) * 0.1);
  
  vec2 p1 = uv * 2.5 + vec2(t * 0.1, t * 0.05) + mouseShift;
  p1 += curl(p1 * 1.5 + t * 0.1) * 0.15 * u_magneticDistortion;
  
  vec2 p2 = uv * 3.0 + vec2(-t * 0.08, t * 0.12) - mouseShift;
  p2 += grad(p1 + t * 0.2) * 0.2 * u_magneticDistortion;
  
  float fluid1 = fbm(p1, 6);
  float fluid2 = fbm(p2, 5);
  float fluid = fluid1 * 0.6 + fluid2 * 0.4;
  float warpedFluid = fbm(p1 + fluid2 * 0.4, 4);
  fluid += rippleDistortion(uv, t) * u_magneticDistortion;
  
  float mColor = warpedFluid * 0.5 + fluid * 0.3 + t * 0.02;
  
  vec3 deepOcean = vec3(0.02, 0.04, 0.08);
  vec3 cyan = vec3(0.02, 0.68, 0.83);
  vec3 purple = vec3(0.51, 0.22, 0.96);
  vec3 pink = vec3(0.93, 0.28, 0.60);
  
  float fluidHue = fract(mColor * 0.5 + fluid * 0.3);
  float mask = smoothstep(0.3, 0.7, fluid);
  float mask2 = smoothstep(0.1, 0.6, warpedFluid);
  
  vec3 col = deepOcean;
  col = mix(col, cyan * 0.4, mask * 0.5);
  col = mix(col, purple * mask2 * 0.6, fluidHue);
  col = mix(col, pink * mask * mask2 * u_colorIntensity, warpedFluid * 0.3);
  
  col += vec3(0.4, 0.8, 1.0) * pow(max(noise(uv * 5.0 + t * 0.3) - 0.6, 0.0), 2.0) * 0.3 * u_colorIntensity;
  
  float warmTone = noise(uv * 8.0 + t * 0.5) * 0.1;
  col += vec3(0.93, 0.28, 0.60) * warmTone * mask2 * 0.2;
  
  col *= vignette(uv);
  
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function BioFluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return;

    // Compile shader
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Fullscreen quad
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_res');
    const uFlowSpeed = gl.getUniformLocation(program, 'u_flowSpeed');
    const uMagneticDistortion = gl.getUniformLocation(program, 'u_magneticDistortion');
    const uColorIntensity = gl.getUniformLocation(program, 'u_colorIntensity');

    gl.uniform1f(uFlowSpeed, 0.5);
    gl.uniform1f(uMagneticDistortion, 1.0);
    gl.uniform1f(uColorIntensity, 0.8);

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.uniform2f(uRes, canvas.width, canvas.height);
    }

    resize();
    window.addEventListener('resize', resize);

    function render() {
      const t = performance.now() * 0.001;
      gl!.uniform1f(uTime, t);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(posBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
