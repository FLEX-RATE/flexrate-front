'use client'

import styled from '@emotion/styled'

import { semanticColor } from '@/styles/colors'
import { typoStyleMap } from '@/styles/typos'

export const Container = styled.div`
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Title = styled.h2`
  ${typoStyleMap.head1};
  color: ${semanticColor.text.normal.primary};
  margin-bottom: 1.5rem;
`

export const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
`

export const SelectButton = styled.button`
  max-width: 320px;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: ${semanticColor.bg.subtle};
  border: 1px solid #AEB5BB;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    background-color: ${semanticColor.bg.default};
    border-color: #95D0FF; /* 원하는 호버 시 테두리 색상도 지정 가능 */
  }
`
