import {useQuery} from '@tanstack/react-query';

import {getCreditScore, getCreditScoreEvaluate, getCreditStatus} from '@/apis/credit';
import {CreditResponse, CreditStatusResponse} from '@/types/credit.type';

export const useCreditScoreEvaluate = () => {
    return useQuery<CreditResponse, Error>({
        queryKey: ['credit-score', 'evaluate'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');

            if (!token) throw new Error('로그인이 필요합니다.');
            return await getCreditScoreEvaluate(token);
        },
        enabled: typeof window !== 'undefined',
        retry: 1,
        refetchOnWindowFocus: false,
    });
};

export const useCreditScore = () => {
    return useQuery<CreditResponse, Error>({
        queryKey: ['credit-score'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');

            if (!token) throw new Error('로그인이 필요합니다.');
            return await getCreditScore(token);
        },
        enabled: typeof window !== 'undefined',
        retry: 1,
    });
};

export const useCreditStatus = () => {
    return useQuery<CreditStatusResponse, Error>({
        queryKey: ['credit-score-status'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');

            if (!token) throw new Error('로그인이 필요합니다.');
            return await getCreditStatus(token);
        },
        enabled: typeof window !== 'undefined',
        retry: 1,
    });
};
