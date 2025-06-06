import { z } from 'zod';

export const authSchemas = {
  login: z.object({
    email: z
      .string()
      .nonempty({ message: '이메일을 입력하세요.' })
      .email('유효한 이메일을 입력해주세요.'),
    password: z
      .string()
      .nonempty({ message: '비밀번호를 입력하세요.' })
      .min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
  }),

  emailWithCode: z.object({
    email: z
      .string()
      .nonempty({ message: '이메일을 입력하세요.' })
      .email({ message: '유효한 이메일 주소를 입력하세요.' }),
    code: z.string().length(6, { message: '6자리 인증번호를 입력하세요.' }),
  }),

  infoRegister: z.object({
    sex: z.enum(['MALE', 'FEMALE'], { required_error: '성별을 선택해주세요' }),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '생년월일 형식이 올바르지 않습니다.'),
    name: z.string().min(1, '이름을 입력해주세요'),
  }),

  agreement: z.object({
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: '전자금융거래 기본약관에 동의해주세요.',
    }),
    agreePrivacy: z.boolean().refine((val) => val === true, {
      message: '개인정보 수집·이용에 동의해주세요.',
    }),
    agreeThirdParty: z.boolean().refine((val) => val === true, {
      message: '개인정보 제3자 제공에 동의해주세요.',
    }),
    agreePolicy: z.boolean().refine((val) => val === true, {
      message: '개인정보 처리방침에 동의해주세요.',
    }),
  }),

  signup: z
    .object({
      email: z
        .string()
        .nonempty({ message: '이메일을 입력하세요.' })
        .email({ message: '유효한 이메일 주소를 입력하세요.' }),

      password: z
        .string()
        .nonempty({ message: '비밀번호를 입력하세요.' })
        .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' }),

      confirmPassword: z.string().nonempty({ message: '비밀번호 확인을 입력하세요.' }),

      name: z
        .string()
        .nonempty({ message: '이름을 입력하세요.' })
        .min(2, { message: '이름은 최소 2자 이상이어야 합니다.' }),

      sex: z.enum(['남성', '여성'], {
        required_error: '성별을 선택하세요.',
      }),

      birthDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, '생년월일 형식이 올바르지 않습니다.')
        .refine(
          (val) => {
            const [y, m, d] = val.split('-').map(Number);
            const date = new Date(y, m - 1, d);
            const isValid =
              date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;

            const minYear = 1900;
            const maxYear = new Date().getFullYear();

            return isValid && y >= minYear && y <= maxYear;
          },
          {
            message: '유효하지 않은 생년월일입니다. (1900년 이후만 가능)',
          }
        ),

      agreement: z
        .boolean()
        .refine((value) => value === true, { message: '개인 정보 제공 약관에 동의해야 합니다.' }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          path: ['confirmPassword'],
          message: '비밀번호가 일치하지 않습니다.',
        });
      }
    }),
};
