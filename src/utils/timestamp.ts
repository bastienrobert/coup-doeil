export interface Timestamp {
  delta: number
  current: number
  previous: number
  update: (time: number) => void
}

export default function timestamp(): Timestamp {
  const ts = {
    current: 0,
    previous: 0,
    delta: 0,
    update: (time: number) => {
      ts.previous = ts.current
      ts.current = time
      ts.delta = ts.current - ts.previous
    },
  }

  return ts
}
