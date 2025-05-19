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

  // ✅ 비밀번호 단독 검증용
  passwordOnly: z.object({
    password: z
      .string()
      .nonempty({ message: '비밀번호를 입력하세요.' })
      .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' }),
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

      gender: z.enum(['남성', '여성'], {
        required_error: '성별을 선택하세요.',
      }),

      birthday: z
        .string()
        .nonempty({ message: '생년월일을 입력하세요.' })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: '생년월일은 YYYY-MM-DD 형식이어야 합니다.' })
        .refine(
          (value) => {
            const today = new Date();
            const birthDate = new Date(value);
            const age = today.getFullYear() - birthDate.getFullYear();
            return age >= 18 && age <= 120;
          },
          { message: '유효한 생년월일을 입력하세요.' }
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