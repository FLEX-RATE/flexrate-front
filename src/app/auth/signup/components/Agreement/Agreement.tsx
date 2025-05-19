// 소비 성향 분석 개인 정보 및 서비스 약관 모두 동의해야 다음 단계로 진행
// @author 윤영찬
// @since 2025-05-13

// 소비 성향 분석 개인 정보 및 서비스 약관 모두 동의해야 다음 단계로 진행
// @author 윤영찬
// @since 2025-05-13

'use client'

import { useState } from 'react'

interface AgreementItem {
  id: string
  label: string
  disabled?: boolean
}

const AGREEMENTS: AgreementItem[] = [
  { id: 'a1', label: '개인 정보 제공 동의' },
  { id: 'a2', label: '개인 정보 제공 동의' },
  { id: 'a3', label: '개인 정보 제공 동의', disabled: true },
]

interface AgreementProps {
  onAgree: () => void
}

const Agreement = ({ onAgree }: AgreementProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    () =>
      AGREEMENTS.reduce((acc, item) => {
        acc[item.id] = false
        return acc
      }, {} as Record<string, boolean>)
  )

  const allChecked = AGREEMENTS.every(
    (item) => item.disabled || checkedItems[item.id]
  )

  const toggleAll = () => {
    const newChecked = AGREEMENTS.reduce((acc, item) => {
      acc[item.id] = !allChecked && !item.disabled
      return acc
    }, {} as Record<string, boolean>)
    setCheckedItems(newChecked)
  }

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-white px-5 pt-4 pb-[88px]">
      {/* 헤더 */}
      <button className="mb-6 text-left text-xl">{`←`}</button>

      <h1
        className="
          mb-6
          [font-size:var(--pretendard-head1-b-24-font-size)]
          [font-weight:var(--pretendard-head1-b-24-font-weight)]
          [font-family:var(--pretendard-head1-b-24-font-family)]
          [line-height:var(--pretendard-head1-b-24-line-height)]
          text-[var(--semantic-text-normal-primary)]
        "
      >
        소비 성향을 분석해볼게요
      </h1>

      {/* 전체 동의 */}
      <label className="flex items-center gap-3 mb-4 cursor-pointer">
        <input
          type="checkbox"
          className="accent-blue-500 w-5 h-5"
          checked={allChecked}
          onChange={toggleAll}
        />
        <span className="text-base font-semibold">전체 동의하기</span>
      </label>

      {/* 개별 동의 */}
      <div className="flex flex-col gap-4">
        {AGREEMENTS.map((item) => (
          <label
            key={item.id}
            className={`flex justify-between items-center cursor-pointer ${
              item.disabled ? 'opacity-40' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="accent-blue-500 w-5 h-5"
                checked={checkedItems[item.id]}
                onChange={() => toggleItem(item.id)}
                disabled={item.disabled}
              />
              <span className="text-sm text-[var(--semantic-text-normal-sub1)]">
                {item.label}
              </span>
            </div>
            <span className="text-xs text-gray-400">더보기</span>
          </label>
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-10">
        <button
          className="w-full bg-blue-500 text-white py-4 rounded-md text-base font-semibold disabled:opacity-40"
          disabled={!allChecked}
          onClick={onAgree}
        >
          다음으로
        </button>
      </div>
    </div>
  )
}

export default Agreement
