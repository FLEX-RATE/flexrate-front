import { useMutation, useQueryClient } from '@tanstack/react-query';

import { patchMember } from '@/apis/admin';
import { FilterType } from '@/types/filter.type';
import { filtersToParams } from '@/utils/memberParams';

function toRawSex(sex: string | undefined): 'MALE' | 'FEMALE' | undefined {
  switch (sex) {
    case '남':
    case '남성':
    case 'MALE':
      return 'MALE';
    case '여':
    case '여성':
    case 'FEMALE':
      return 'FEMALE';
    default:
      return undefined;
  }
}

function toRawMemberStatus(
  status: string | undefined
): 'ACTIVE' | 'WITHDRAWN' | 'SUSPENDED' | undefined {
  switch (status) {
    case '활성':
    case 'ACTIVE':
      return 'ACTIVE';
    case '탈퇴':
    case 'WITHDRAWN':
      return 'WITHDRAWN';
    case '정지':
    case 'SUSPENDED':
      return 'SUSPENDED';
    default:
      return undefined;
  }
}

interface PatchMemberArgs {
  userId: number;
  payload: {
    name?: string;
    email?: string;
    sex?: string;
    birthDate?: string;
    memberStatus?: string;
  };
}

function removeUndefined(obj: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
}

export function usePatchMember(filters: FilterType, page: number, size: number = 8) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, payload }: PatchMemberArgs) => {
      const rawPayload = {
        ...payload,
        sex: toRawSex(payload.sex),
        memberStatus: toRawMemberStatus(payload.memberStatus),
      };
      const cleanPayload = removeUndefined(rawPayload);
      return patchMember(userId, cleanPayload);
    },
    onSuccess: () => {
      const params = filtersToParams(filters, page, size);
      queryClient.invalidateQueries({
        queryKey: ['customers', JSON.stringify(params)],
      });
    },
  });
}
