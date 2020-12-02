precision highp float;

uniform float uTime;
uniform float uTextureLeft;
uniform float uTextureRight;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform sampler2D tLeft;
uniform sampler2D tRight;
uniform sampler2D tSpot;


varying vec2 vUv;

void main() {
  // gl_FragColor.rgb = 0.5 + 0.3 * cos(vUv.xyx + uTime) + uColor;
  // gl_FragColor.a = 1.0;
  float st = uResolution.x / uResolution.y;
  gl_FragColor = vec4(vec3(
    texture2D(tSpot, vUv).r * uTextureLeft
    + texture2D(tSpot, vUv).g * uTextureRight 
  ), 1.);
}