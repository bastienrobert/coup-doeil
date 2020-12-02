precision highp float;

uniform float uTime;
uniform float uLeftEnable;
uniform float uRightEnable;
uniform float uNormalUVScale;

uniform vec3 uColor;
uniform vec2 uResolution;

uniform vec2 uTextureLeftAlphaPosition;
uniform float uTextureLeftAlphaScale;
uniform vec2 uTextureLeftAlphaDimension;

uniform sampler2D tLeft;
uniform sampler2D tRight;
uniform sampler2D tData; 
uniform sampler2D tMap; 

varying vec2 vUv;

vec2 contain(vec2 r, float s, vec2 i) {
  vec2 f = r * s;

  vec2 new = vec2(f.x, i.y * f.x / i.x);
  vec2 oa = vec2(0., new.y - r.y);
  vec2 offset = oa / new;
  return (vUv * r) / new + offset;
}

float frame(vec2 c, vec2 r, vec2 p) {
  return ((1. - step(c.x/r.x, p.x)) * (1. - step(1. - c.y/r.y, p.y)));
}

void main() {  
  // texture position
  float a = uResolution.x / uResolution.y;
  vec2 p = vec2(
    -uTextureLeftAlphaPosition.x * .01 / uTextureLeftAlphaScale,
    uTextureLeftAlphaPosition.y * .01 / (uTextureLeftAlphaScale * a)
  );

  // texture contain
  float aLeft = texture2D(tLeft, contain(
    uResolution,
    uTextureLeftAlphaScale,
    uTextureLeftAlphaDimension
  ) + p).r;


  float cltLeft = frame(gl_FragCoord.xy, uResolution, uTextureLeftAlphaPosition * .01) * aLeft;
  
  vec4 spot = vec4(vec3(
    cltLeft
  ), 1.);

  gl_FragColor = texture2D(tData, vec2(1, 0));
  // gl_FragColor = (1. - spot) * texture2D(tMap, vUv) ;
}
