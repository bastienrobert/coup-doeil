precision highp float;
precision highp int;

uniform float uCollide;
uniform sampler2D uTexture;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec3 normal = normalize(vNormal);
  float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));
  
  gl_FragColor = texture2D(uTexture, vUv);
  gl_FragColor.rgb += lighting * 0.1;
}