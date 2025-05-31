import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SubContainer } from "@/app/mypage/page.style";
import Button from "@/components/Button/Button";
import { BtnContainer, BtnWrapper } from "@/components/MypageEditFunnel/EmailStep/EmailStep.style";
import { Title, MainContainer } from "@/components/MypageEditFunnel/MypageEditFunnel.style";
import TextField from "@/components/TextField/TextField";

interface Props {
  value: { email: string; code: string };
  onChange: (ctx: { email: string; code: string }) => void;
  onNext: () => void;
}

const codeSchema = z.object({
  code: z
    .string()
    .nonempty("인증코드를 입력해주세요")
});

type CodeFormValues = z.infer<typeof codeSchema>;

export const CodeVerificationStep = ({ value, onChange, onNext }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    mode: "onChange",
    defaultValues: {
      code: value.code || "",
    },
  });

  const watchedCode = watch("code");
  React.useEffect(() => {
    if (onChange) onChange({ email: value.email, code: watchedCode });
  }, [watchedCode]);

  const onSubmit = (data: CodeFormValues) => {
    onNext();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <MainContainer>
          <Title>이메일 인증을 시작할게요</Title>

          <SubContainer>
            <TextField
              value={watchedCode}
              onChange={(v: string) => setValue("code", v, { shouldValidate: true })}
              isError={!!errors.code}
              rightContent={{
                type: "DELETE",
                onClick: () => setValue("code", "", { shouldValidate: true }),
              }}
            >
              <TextField.TextFieldBox
                type="text"
                placeholder="인증번호 입력"
                {...register("code")}
              />
              {errors.code && (
                <TextField.ErrorText message={errors.code.message || ""} />
              )}
            </TextField>
          </SubContainer>

          <SubContainer>
            <TextField
              value={value?.email}
              onChange={() => {}}
              isDisabled={true}
            >
              <TextField.TextFieldBox placeholder={value?.email} />
            </TextField>
          </SubContainer>
        </MainContainer>

        <BtnWrapper>
          <BtnContainer>
            <Button
              text="인증하기"
              type="submit"
              disabled={!isValid}
            />
          </BtnContainer>
        </BtnWrapper>
      </form>
    </>
  );
};
