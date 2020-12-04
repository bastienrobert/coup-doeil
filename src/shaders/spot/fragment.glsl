precision highp float;

uniform float uTime;
uniform float uLeftEnable;
uniform float uRightEnable;
uniform float uNormalUVScale;

uniform vec3 uColor;
uniform vec4 uMask;
uniform vec2 uResolution;

uniform vec2 uTextureDimension;

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

vec4 tex(vec2 i, vec2 xy, sampler2D tex, vec2 d) {
  float a = uResolution.x / uResolution.y;
  vec2 rp = vec2(
    texValue(vec2((i.x + 0.)/10. + 1./20., i.y)),
    texValue(vec2((i.x + 1.)/10. + 1./20., i.y))
  );
  float s = texValue(vec2((i.x + 2.)/10. + 1./20., i.y)) * .1;

  // texture position
  vec2 p = vec2(-rp.x * .1 / s, rp.y * .1 / (s * a));

  // texture contain
  return texture2D(tex, contain(uResolution, s, d) + p);
}

void main() {
  float a = uResolution.x / uResolution.y;
  vec2 xy = vec2(10., 1.);

  float aLeft1 = tex(vec2(0., 1.), xy, tLeft, uTextureDimension).r;
  float aLeft2 = tex(vec2(1. * 3., 1.), xy, tLeft, uTextureDimension).g;
  float aLeft3 = tex(vec2(2. * 3., 1.), xy, tLeft, uTextureDimension).b;
  float aLeft = smoothstep(.2, 1., (aLeft1 + aLeft2 + aLeft3));

  float aRight1 = tex(vec2(0., 0.), xy, tRight, uTextureDimension).r;
  float aRight2 = tex(vec2(1. * 3., 0.), xy, tRight, uTextureDimension).g;
  float aRight3 = tex(vec2(2. * 3., 0.), xy, tRight, uTextureDimension).b;
  float aRight = smoothstep(.2, 1., (aRight1 + aRight2 + aRight3));
  
  vec3 spot = vec3(
    (aLeft * uLeftEnable)
    + (aRight * uRightEnable)
  );

  gl_FragColor = texture2D(tMap, vUv);
  gl_FragColor.rgb *= (1. - spot);
  gl_FragColor = mix(gl_FragColor, uMask, uMask.a);
}
