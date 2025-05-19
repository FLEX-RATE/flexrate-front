/**
 * 모달 열기/닫기를 제어하는 커스텀 훅
 */


import { useState, useCallback } from 'react'

export function useModal() {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  return {
    isOpen,
    openModal,
    closeModal,
  }
}
