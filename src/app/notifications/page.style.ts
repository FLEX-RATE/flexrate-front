import styled from '@emotion/styled';

import { primitiveColor, semanticColor } from '@/styles/colors';

export const Wrapper = styled.div`
  height: 100svh;
  overflow-y: auto;
`;

export const TopSection = styled.div`
  position: sticky;
  overflow-y: auto;
  top: 56px;
  display: flex;
  height: 50px;
  min-height: 50px;
  padding: 7px 18px;
  align-items: center;
  align-self: stretch;
  background-color: ${semanticColor.bg.default};
  z-index: 1000;
`;

export const MainContainer = styled.div`
  margin: 0 auto 40px auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 11px 11px 0px 11px;
`;

export const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  margin-bottom: 16px;
`;

export const EmptyText = styled.div`
  font-size: 16px;
  color: ${semanticColor.text.normal.sub3};
`;

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 10px;

  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid ${semanticColor.bg.subtle};
    border-top: 2px solid ${semanticColor.bg.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    color: ${semanticColor.text.normal.sub2};
    font-size: 14px;
    margin: 0;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin: 10px;
  background-color: ${primitiveColor.red[50]};
  border-radius: 8px;
  border: 1px solid ${primitiveColor.red[500]};

  p {
    color: ${primitiveColor.red[500]};
    font-size: 14px;
    margin: 0 0 10px 0;
    text-align: center;
  }

  button {
    background-color: ${semanticColor.bg.primary};
    color: ${semanticColor.text.normal.onPrimary};
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }
  }
`;
