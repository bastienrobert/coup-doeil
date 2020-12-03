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

float texValue(vec2 uv) {
  vec4 t = texture2D(tData, uv);
  return (t.r + t.g + t.b + t.a) * 2.56;
}

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
  vec2 p1 = vec2(
    texValue(vec2(0., 1.)),
    texValue(vec2(.2, 1.))
  );
  float s = texValue(vec2(.5, 1.)) * .1;

  // texture position
  float a = uResolution.x / uResolution.y;
  vec2 p = vec2(
    -p1.x * .1 / s,
    p1.y * .1 / (s * a)
  );

  // texture contain
  float aLeft = texture2D(tLeft, contain(
    uResolution,
    s,
    uTextureLeftAlphaDimension
  ) + p).r;


  float cltLeft = frame(gl_FragCoord.xy, uResolution, p1 * .1) * aLeft;
  
  vec4 spot = vec4(vec3(
    cltLeft
  ), 1.);

  // gl_FragColor = texture2D(tData, vUv);
  gl_FragColor = (1. - spot) * texture2D(tMap, vUv);
}
