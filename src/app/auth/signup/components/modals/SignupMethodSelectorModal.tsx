'use client'

import React from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import { SignupContextMap } from '../../types/signup'

interface SignupMethodSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (method: SignupContextMap['method']['method']) => void
}

export const SignupMethodSelectorModal = ({
  isOpen,
  onClose,
  onSelect,
}: SignupMethodSelectorModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md bg-white rounded-t-2xl p-6 shadow-lg"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h2 className="text-center text-lg font-semibold mb-6">
              어떤 방법으로 로그인할까요?
            </h2>
            <div className="flex flex-col gap-4">
              <button
                className="w-full py-3 rounded-xl bg-gray-100 text-sm font-medium"
                onClick={() => {
                  onSelect('pin')
                  onClose()
                }}
              >
                간편 비밀번호
              </button>
              <button
                className="w-full py-3 rounded-xl bg-gray-100 text-sm font-medium"
                onClick={() => {
                  onSelect('faceid')
                  onClose()
                }}
              >
                지문
              </button>
              <button
                className="w-full py-3 rounded-xl bg-gray-100 text-sm font-medium"
                onClick={() => {
                  onSelect('pin') // 일반 로그인도 동일 처리
                  onClose()
                }}
              >
                일반 로그인
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
