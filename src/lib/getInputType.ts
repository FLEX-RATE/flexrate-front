import { InputType } from '@/components/TextField/TextField.type';

export const getInputType = ({
  isError,
  isDisabled,
  value,
}: {
  isError?: boolean;
  isDisabled?: boolean;
  value?: string | number;
}): InputType => {
  if (isError) return 'ERROR';
  if (isDisabled) return 'INACTIVE';

  if (
    (typeof value === 'string' && value !== '0' && value.length > 0) ||
    (typeof value === 'number' && value !== 0)
  ) {
    return 'ACTIVE';
  }

  return 'INACTIVE';
};
