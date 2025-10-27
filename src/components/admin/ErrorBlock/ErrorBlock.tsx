'use client';

import React from 'react';

import Button from 'antd/es/button';

import { ErrorWrapper, ErrorMessage } from './ErrorBlock.style';

interface Props {
  message: string;
  onRetry: () => void;
  buttonText?: string;
}

const ErrorBlock = ({ message, onRetry, buttonText = '목록으로 돌아가기' }: Props) => {
  return (
    <ErrorWrapper>
      <ErrorMessage>{message}</ErrorMessage>
      <Button type="primary" onClick={onRetry}>
        {buttonText}
      </Button>
    </ErrorWrapper>
  );
};

export default ErrorBlock;
