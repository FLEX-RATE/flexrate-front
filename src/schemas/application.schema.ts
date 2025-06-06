import { z } from 'zod';

export const applicationSchema = z.object({
  직업정보입력: z.object({
    employmentType: z.string().min(1, '고용 형태를 선택해주세요'),
  }),
  신용정보입력: z.object({
    annualIncome: z.preprocess(
      (val) => (typeof val === 'string' ? Number(val) : val),
      z.number().min(1, '연소득을 입력해주세요')
    ),
    residenceType: z.string().min(1, '주거 형태를 선택해주세요'),
    isBankrupt: z.boolean(),
  }),
  대출목적입력: z.object({
    loanPurpose: z.string().min(1, '대출 목적을 입력해주세요'),
  }),
  대출신청접수: z.object({
    loanAmount: z.number().positive('대출 금액을 입력해주세요'),
    repaymentMonth: z.number().positive('상환 기간을 입력해주세요'),
  }),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const applicationAgreeSchema = {
  약관동의: z.object({
    agreeService: z.boolean().refine((val) => val === true, {
      message: '서비스 이용 약관에 동의해주세요.',
    }),
    agreeCredit: z.boolean().refine((val) => val === true, {
      message: '여신거래 기본약관에 동의해주세요.',
    }),
    agreeProduct: z.boolean().refine((val) => val === true, {
      message: '상품 설명 확인서에 동의해주세요.',
    }),
    agreeDescription: z.boolean().refine((val) => val === true, {
      message: '대출 상품 설명서에 동의해주세요.',
    }),
  }),
};
