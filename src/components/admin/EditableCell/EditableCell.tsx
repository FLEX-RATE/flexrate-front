'use client';

import type { ReactNode, TdHTMLAttributes } from 'react';

import type { SelectProps } from 'antd';
import DatePicker from 'antd/es/date-picker';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Select from 'antd/es/select';

type EditableCellProps = {
  title: string;
  editing: boolean;
  dataIndex: string;
  inputType: 'text' | 'select' | 'date';
  options?: SelectProps['options'];
  record: Record<string, unknown>;
  index: number;
  children: ReactNode;
  handleChange: (value: string, dataIndex?: string, record?: Record<string, unknown>) => void;
} & TdHTMLAttributes<HTMLTableCellElement>;

/**
 * 테이블 개별 셀 수정 렌더링 컴포넌트
 * @param title 테이블 헤더
 * @param editing 편집 모드 여부
 * @param dataIndex 테이블 데이터 인덱스
 * @param inputType 입력 타입 (text, select, date)
 * @param options 셀렉트 옵션 (select 타입일 경우)
 * @param record 현재 행 데이터
 * @param children 자식 요소
 * @param handleChange 셀 값 변경 핸들러
 * @param restProps 기타 HTML 속성
 *
 * @since 2025.05.16
 * @author 권민지
 */
const EditableCell = ({
  title,
  editing,
  dataIndex,
  inputType,
  options,
  record,
  children,
  handleChange,
  ...restProps
}: EditableCellProps) => {
  // 상태 컬럼일 시 select 대신 클릭만 처리
  if (dataIndex === 'status') {
    return (
      <td
        {...restProps}
        style={{ cursor: 'pointer', textAlign: 'center' }}
        onClick={() => {
          handleChange(record.status as string, dataIndex, record);
        }}
      >
        {children}
      </td>
    );
  }

  const renderInputNode = () => {
    switch (inputType) {
      case 'text':
        return <Input onChange={(e) => handleChange(e.target.value)} />;
      case 'select':
        return <Select options={options} onChange={(value) => handleChange(String(value))} />;
      case 'date':
        return (
          <DatePicker
            format="YYYY-MM-DD"
            onChange={(_, dateString) =>
              handleChange(Array.isArray(dateString) ? dateString.join(',') : dateString)
            }
          />
        );
      default:
        return <Input onChange={(e) => handleChange(e.target.value)} />;
    }
  };

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `${title}을(를) 입력하세요.` }]}
        >
          {renderInputNode()}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
