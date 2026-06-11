// Monochrome, slow, cinematic fragment shaders that replace the template's
// hotlinked videos. All share the same noise/fbm helpers and a film-grain +
// vignette finish so the five sections feel like one family.

const HEADER = /* glsl */ `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

float vignette(vec2 uv) {
  return smoothstep(1.25, 0.35, length(uv - 0.5));
}

float grain(float t) {
  return (hash(gl_FragCoord.xy + fract(t) * 61.0) - 0.5) * 0.05;
}
`;

// Hero: slow drifting smoke, weighted toward the bottom edge like the
// original object-bottom video.
const SMOKE = /* glsl */ `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.05;

  vec2 q = vec2(
    fbm(p * 1.6 + vec2(t, -t * 0.6)),
    fbm(p * 1.6 - vec2(t * 0.8, t * 0.3))
  );
  float n = fbm(p * 2.1 + q * 1.8 + vec2(t * 0.7, -t * 0.2));

  float c = smoothstep(0.32, 0.95, n);
  c *= 0.3 + 0.7 * smoothstep(1.15, 0.0, uv.y);

  vec3 col = vec3(c * 0.6);
  col *= vignette(uv);
  col += grain(u_time);
  gl_FragColor = vec4(col, 1.0);
}
`;

// Featured: silky horizontal light streaks flowing across the frame.
const SILK = /* glsl */ `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.1;

  float acc = 0.0;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float y = p.y
      + 0.12 * sin(p.x * 1.6 + t * 2.0 + fi * 2.1)
      + 0.1 * (fbm(p * vec2(1.2, 2.2) + vec2(fi * 3.1 + t * 1.5, t)) - 0.5)
      + (fi - 1.5) * 0.16;
    acc += 0.025 / (abs(y) + 0.04);
  }

  float c = min(acc * 0.9, 1.0) * 0.55;
  vec3 col = vec3(c);
  col *= vignette(uv);
  col += grain(u_time);
  gl_FragColor = vec4(col, 1.0);
}
`;

// Philosophy: a breathing orb of light with a noisy halo and a faint ring.
const ORB = /* glsl */ `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time;

  float pulse = 0.5 + 0.5 * sin(t * 0.35);
  float d = length(p * vec2(1.0, 1.25));
  float core = exp(-d * d * 9.0) * (0.5 + 0.2 * pulse);
  float halo = fbm(p * 2.6 + vec2(t * 0.04, -t * 0.03)) * exp(-d * 2.2) * 0.55;
  float radius = 0.34 + (fbm(p * 2.0 + vec2(t * 0.05, -t * 0.04)) - 0.5) * 0.1
               + 0.015 * sin(t * 0.5);
  float ring = smoothstep(0.035, 0.0, abs(d - radius)) * 0.14;

  float c = min(core + halo + ring, 1.0) * 0.85;
  vec3 col = vec3(c);
  col *= vignette(uv);
  col += grain(u_time);
  gl_FragColor = vec4(col, 1.0);
}
`;

// Services / Strategy: a drifting field of data points over a faint grid.
const FIELD = /* glsl */ `
float points(vec2 p, float scale, vec2 drift, float t) {
  vec2 g = p * scale + drift * t;
  vec2 id = floor(g);
  vec2 gv = fract(g) - 0.5;
  float h = hash(id);
  vec2 offs = (vec2(h, fract(h * 34.7)) - 0.5) * 0.7;
  float d = length(gv - offs);
  float tw = 0.3 + 0.7 * (0.5 + 0.5 * sin(t * (0.6 + h * 1.2) + h * 6.2831));
  return smoothstep(0.06, 0.0, d) * tw;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time;

  float c = 0.0;
  c += points(p, 7.0, vec2(0.05, 0.02), t) * 0.9;
  c += points(p + 3.7, 13.0, vec2(-0.03, 0.04), t) * 0.45;

  vec2 gp = fract(p * 7.0 + vec2(0.05, 0.02) * t);
  float grid = (smoothstep(0.015, 0.0, min(gp.x, 1.0 - gp.x))
              + smoothstep(0.015, 0.0, min(gp.y, 1.0 - gp.y))) * 0.05;

  vec3 col = vec3(min(c + grid, 1.0) * 0.9);
  col *= vignette(uv);
  col += grain(u_time);
  gl_FragColor = vec4(col, 1.0);
}
`;

// Services / Craft: slowly morphing topographic contour lines.
const CONTOUR = /* glsl */ `
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.03;

  float n = fbm(p * 2.3 + vec2(t * 2.0, t));
  float levels = 9.0;
  float f = fract(n * levels - u_time * 0.05);
  float dist = min(f, 1.0 - f) / levels;
  float line = smoothstep(0.006, 0.001, dist);

  float c = line * (0.25 + 0.75 * n) * 0.8;
  vec3 col = vec3(c);
  col *= vignette(uv);
  col += grain(u_time);
  gl_FragColor = vec4(col, 1.0);
}
`;

export const shaderPresets = {
  smoke: HEADER + SMOKE,
  silk: HEADER + SILK,
  orb: HEADER + ORB,
  field: HEADER + FIELD,
  contour: HEADER + CONTOUR,
};

export type ShaderPreset = keyof typeof shaderPresets;
