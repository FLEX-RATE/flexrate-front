'use client';

import { backgroundColorMap, borderColorMap, textColorMap } from '@/components/Button/Button.type';
import { typoStyleMap } from '@/styles/typos';
import styled from '@emotion/styled';

export const HeaderWrapper = styled.div`
  min-width: 1315px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #d9d9d9;
`;

export const LogoContainer = styled.div`
  margin-left: 16px;
  padding: 16px 0px 16px 0px;
  display: flex;
  gap: 10px;
  height: fit-content;
  align-items: end;
`;

export const LogoSmallText = styled.div`
  color: #9fa4b0;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 4px;
`;

export const HeaderRightContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin-right: 16px;
`;

export const HomePageButton = styled.button`
  border: none;
  background-color: transparent;

  color: #414141;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const EmailBox = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  height: 40px;
  padding: 11px;
  border-radius: 7px;
  border: 1px solid #d9d9d9;

  color: #262626;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const LogoutBtn = styled.button`
  cursor: pointer;
  ${typoStyleMap['body1_sb']};
  width: fit-content;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  border: 1px solid ${borderColorMap['SECONDARY']};
  background-color: ${backgroundColorMap['SECONDARY']};
  color: ${textColorMap['SECONDARY']};
  font-size: 15px;
`;
