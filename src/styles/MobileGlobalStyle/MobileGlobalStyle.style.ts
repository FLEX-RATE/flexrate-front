'use client';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { primitiveColor } from '../colors';

export const mobileGlobalStyleCss = css`
  body {
    margin: 0px auto;
    padding: 0;
    background-color: ${primitiveColor.gray[50]};
    width: 100%;
  }

  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  img,
  video {
    max-width: 100%;
    height: auto;
  }

  .apexcharts-tooltip {
    margin-top: 5px !important;
  }
`;

export const AppContainer = styled.div`
  margin: 0px auto;
  padding: 0;
  background-color: ${primitiveColor.background.wt};
  min-height: calc(var(--vh, 1vh) * 100);
  overflow-x: hidden;

  width: 768px;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const InnerContainer = styled.div`
  position: relative;
  padding: 10px 0px 0px 0px;
  box-sizing: border-box;
`;
