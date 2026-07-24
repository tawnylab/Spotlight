'use client'

import { useEffect, useState } from 'react'

/**
 * 集中提供：用户挂载状态、是否希望减少动效、是否使用精确指针。
 * 用于动画组件统一判断。
 */
export function useMounted() {
  let [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

export function useReducedMotion(): boolean {
  let [reduce, setReduce] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    let mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let update = () => setReduce(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduce
}

export function usePointerFine(): boolean {
  let [fine, setFine] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    let mq = window.matchMedia('(pointer: fine)')
    let update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine
}

export function useMotionPreference() {
  return {
    mounted: useMounted(),
    reduceMotion: useReducedMotion(),
    finePointer: usePointerFine(),
  }
}