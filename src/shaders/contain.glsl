vec2 contain(vec2 r, vec2 s, vec2 i) {
  vec2 f = r * s;

  float rs = r.x / r.y;
  float ri = i.x / i.y;
  vec2 new = mix(vec2(i.x * f.y / i.y, f.y), vec2(f.x, i.y * f.x / i.x), step(rs, ri));
  vec2 oa = mix(vec2(0., -r.y + f.y), vec2(0., new.y - r.y), step(rs, ri));
  vec2 offset = oa / new;
  return (vUv * r) / new + offset;
}