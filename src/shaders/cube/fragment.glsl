precision highp float;
precision highp int;

uniform float uHit;

varying vec3 vNormal;

void main() {
  vec3 normal = normalize(vNormal);
  float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));
  
  gl_FragColor.rgb = mix(vec3(0.2, 0.8, 1.0), vec3(1.0, 0.2, 0.8), uHit) + lighting * 0.1;
  gl_FragColor.a = 1.0;
}