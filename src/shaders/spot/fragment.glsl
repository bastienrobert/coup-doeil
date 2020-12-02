precision highp float;

uniform float uTime;
uniform float uTextureLeft;
uniform float uTextureRight;
uniform float uNormalUVScale;

uniform vec3 uColor;
uniform vec2 uResolution;

uniform vec2 uTextureLeftAlphaPosition;
uniform float uTextureLeftAlphaScale;
uniform vec2 uTextureLeftAlphaDimension;

uniform sampler2D tSpot;
uniform sampler2D tMap; 

varying vec2 vUv;

vec2 contain(vec2 r, float s, vec2 i) {
  vec2 f = r * s;

  vec2 new = vec2(f.x, i.y * f.x / i.x);
  vec2 oa = vec2(0., new.y - r.y);
  vec2 offset = oa / new;
  return (vUv * r) / new + offset;
}

void main() {  
  // texture position
  float a = uResolution.x / uResolution.y;
  vec2 p = vec2(
    -uTextureLeftAlphaPosition.x * .01 / uTextureLeftAlphaScale,
    uTextureLeftAlphaPosition.y * .01 / (uTextureLeftAlphaScale * a)
  );

  // texture contain
  float tLeft = texture2D(tSpot, contain(
    uResolution,
    uTextureLeftAlphaScale,
    uTextureLeftAlphaDimension
  ) + p).r;

  float cltLeft = (1. - step(gl_FragCoord.x/uResolution.x, uTextureLeftAlphaPosition.x * .01))
    * (1. - step(1. - gl_FragCoord.y/uResolution.y, uTextureLeftAlphaPosition.y * .01))
    * tLeft;

  // vec2 st = vec2(gl_FragCoord.xy / uResolution);
  // // position clamp
  // vec2 c = vec2(
  //   st.x + ((uResolution.x - uTextureLeftAlphaSize.x) / uResolution.x),
  //   st.y + (uTextureLeftAlphaSize.y / uResolution.y)
  // );
  
  
  vec4 spot = vec4(vec3(
    cltLeft
  ), 1.);

  gl_FragColor = (1. - spot) * texture2D(tMap, vUv) ;
}
