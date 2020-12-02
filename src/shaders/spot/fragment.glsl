precision highp float;

uniform float uTime;
uniform float uTextureLeft;
uniform float uTextureRight;
uniform float uNormalUVScale;

uniform vec3 uColor;

uniform sampler2D tSpot;
uniform sampler2D tMap; 

varying vec2 vUv;

void main() {
  // gl_FragColor.rgb = 0.5 + 0.3 * cos(vUv.xyx + uTime) + uColor;
  // gl_FragColor.a = 1.0;
  
  vec4 spot = vec4(vec3(
    texture2D(tSpot, vUv).r * uTextureLeft
    + texture2D(tSpot, vUv).g * uTextureRight 
  ), 1.);

  gl_FragColor = (1. - spot) * texture2D(tMap, vUv) ;
}
