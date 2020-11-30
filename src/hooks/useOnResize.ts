import { useEffect } from 'preact/hooks'

export default (callback: () => void, init = false) => {
  useEffect(() => {
    if (init) callback()
    window.addEventListener('resize', callback)

    return () => {
      window.removeEventListener('resize', callback)
    }
  }, [])
}
