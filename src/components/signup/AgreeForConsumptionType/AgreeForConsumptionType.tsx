'use client';

import styled from '@emotion/styled';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/Button/Button';
import CheckBox from '@/components/CheckBox/CheckBox';
import { authSchemas } from '@/schemas/auth.schema';

import { BtnContainer, Container, Title } from '../EmailForm/EmailForm.style';

type FormData = z.infer<typeof authSchemas.agreement>;

interface AgreementProps {
  onNext: () => void;
}

const Agreement = ({ onNext }: AgreementProps) => {
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(authSchemas.agreement),
    mode: 'onChange',
    defaultValues: {
      agreeTerms: false,
      agreePrivacy: false,
      agreeThirdParty: false,
      agreePolicy: false,
    },
  });

  const agreeTerms = watch('agreeTerms');
  const agreePrivacy = watch('agreePrivacy');
  const agreeThirdParty = watch('agreeThirdParty');
  const agreePolicy = watch('agreePolicy');

  const allChecked = agreeTerms && agreePrivacy && agreeThirdParty && agreePolicy;

  const handleAllChange = (nextChecked: boolean) => {
    setValue('agreeTerms', nextChecked, { shouldValidate: true });
    setValue('agreePrivacy', nextChecked, { shouldValidate: true });
    setValue('agreeThirdParty', nextChecked, { shouldValidate: true });
    setValue('agreePolicy', nextChecked, { shouldValidate: true });
  };

  const onSubmit = () => {
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Title>소비 성향을 분석해볼게요</Title>
        <Wrapper>
          <CheckBox
            size="large"
            checked={allChecked}
            label="전체 동의하기"
            onChange={handleAllChange}
          />

          <CheckBoxContainer>
            <CheckBox
              size="small"
              label="[필수] 전자금융거래 기본약관"
              showMoreText="더보기"
              showMoreUrl="https://ryuseunghan.notion.site/202c3966a14380eb890ee6bd350d30ce?source=copy_link"
              checked={agreeTerms}
              onChange={(val) => setValue('agreeTerms', val, { shouldValidate: true })}
            />

            <CheckBox
              size="small"
              label="[필수] 개인(신용)정보 수집·이용·제공 동의서"
              showMoreText="더보기"
              showMoreUrl="https://ryuseunghan.notion.site/202c3966a1438047bbf4eedd02078ea1?source=copy_link"
              checked={agreePrivacy}
              onChange={(val) => setValue('agreePrivacy', val, { shouldValidate: true })}
            />

            <CheckBox
              size="small"
              label="[필수] 개인(신용) 정보 제3자 제공 동의서"
              showMoreText="더보기"
              showMoreUrl="https://ryuseunghan.notion.site/3-204c3966a143804ebc07f14d76aa1d4c?source=copy_link"
              checked={agreeThirdParty}
              onChange={(val) => setValue('agreeThirdParty', val, { shouldValidate: true })}
            />

            <CheckBox
              size="small"
              label="[필수] 개인정보 처리방침"
              showMoreText="더보기"
              showMoreUrl="https://ryuseunghan.notion.site/202c3966a143800ca1e3fe944e2eb90c?source=copy_link"
              checked={agreePolicy}
              onChange={(val) => setValue('agreePolicy', val, { shouldValidate: true })}
            />
          </CheckBoxContainer>

          <BtnContainer>
            <Button type="submit" size="XL" text="다음으로" disabled={!isValid} />
          </BtnContainer>
        </Wrapper>
      </Container>
    </form>
  );
};

export default Agreement;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 22px;
`;

const CheckBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #ddd;
  padding-top: 16px;
  gap: 22px;
`;
