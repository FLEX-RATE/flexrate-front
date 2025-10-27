'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { css, cx } from '@emotion/css';
import Form from 'antd/es/form';
import Pagination from 'antd/es/pagination';
import Table from 'antd/es/table';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

import UserDetailButton from '@/assets/icons/userDetailButton.svg';
import EditableCell from '@/components/admin/EditableCell/EditableCell';
import TableSkeleton from '@/components/admin/skeleton/TableSkeleton/TableSkeleton';

import {
  rowCellStyle,
  emptyRowStyle,
  customRowHoverStyle,
  lastRowNoBorderStyle,
  EmptyTextWrapper,
  TableWrapper,
  TableTitleWrapper,
  PaginationCenterWrapper,
  UserDetailButtonWrapper,
} from './DataTable.style';

interface ColumnMeta {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  editable?: boolean;
  inputType?: 'text' | 'select' | 'date';
  options?: ReadonlyArray<{ label: string; value: string }>;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  onChange: (page: number) => void;
}

interface DataTableProps<
  T extends {
    key: React.Key;
    isEmpty?: boolean;
    userId?: number;
    handleChange?: (value: string, dataIndex?: string, record?: T) => void;
  }
> {
  data: T[];
  loading: boolean;
  columnMetas: ColumnMeta[];
  pageSize?: number;
  linkPrefix?: string;
  paginationInfo?: PaginationInfo;
}

const PAGE_SIZE = 8;
const TABLE_MIN_HEIGHT = 200;
const TABLE_MIN_WIDTH = 1020;

/**
 * 테이블 컴포넌트
 * @param data - 데이터 배열
 * @param loading - 로딩 상태
 * @param columnMetas - 컬럼 메타 정보 배열
 * @param columnWidths - 컬럼 너비 정보 객체
 * @param linkPrefix - 링크 접두사
 * @param paginationInfo - 페이지네이션 정보 객체
 *
 * @since 2025.05.13
 * @lastmodified 2025.05.16
 * @author 권민지
 */
const DataTable = <
  T extends {
    key: React.Key;
    isEmpty?: boolean;
    userId: number;
    handleChange?: (value: string, dataIndex?: string, record?: T) => void;
  } & Record<string, unknown>
>({
  data,
  loading,
  columnMetas,
  linkPrefix,
  paginationInfo,
}: DataTableProps<T>) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | number | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);

  // 페이지네이션
  const currentPage = paginationInfo?.currentPage ?? 0;
  const pageSize = paginationInfo?.pageSize ?? PAGE_SIZE;
  const totalElements = paginationInfo?.totalElements ?? 0;

  // 스켈레톤/로딩
  const showSkeleton = initialLoading;
  const showAntdLoading = !initialLoading && loading;

  // 현재 row가 수정중인지 여부 판별
  const isEditing = useCallback((record: T) => record.key === editingKey, [editingKey]);

  // 날짜 필드 dayjs 객체로 변환
  const convertDateFields = useCallback((record: T, columnMetas: ColumnMeta[]) => {
    const converted: Record<string, unknown> = { ...record };
    columnMetas.forEach((meta) => {
      if (meta.inputType === 'date' && record[meta.dataIndex]) {
        converted[meta.dataIndex] = dayjs(record[meta.dataIndex] as string);
      }
    });
    return converted;
  }, []);

  // 컬럼 정의 (수정/상세/일반 컬럼 분기)
  const columns = useMemo(
    () =>
      columnMetas.map((meta) => {
        // 상세 페이지 이동 버튼 컬럼
        if (meta.key === 'userId') {
          return {
            title: <TableTitleWrapper>{meta.title}</TableTitleWrapper>,
            dataIndex: meta.dataIndex,
            key: meta.key,
            width: meta.width,
            align: 'center' as const,
            render: (_: unknown, record: T) =>
              record.isEmpty ? null : (
                <UserDetailButtonWrapper
                  aria-label="상세 페이지 이동"
                  onClick={() => {
                    if (record.userId) {
                      router.push(`${linkPrefix}${record.userId}`);
                    }
                  }}
                >
                  <UserDetailButton width={34} />
                </UserDetailButtonWrapper>
              ),
          };
        }

        // 수정 가능 컬럼
        if (meta.editable) {
          return {
            ...meta,
            align: 'center' as const,
            onCell: (record: T) => ({
              record,
              inputType: meta.inputType,
              dataIndex: meta.dataIndex,
              title: meta.title,
              editing: isEditing(record) && editingColumn === meta.dataIndex,
              options: meta.options,
              onClick: () => {
                if (!record.isEmpty) {
                  setEditingKey(
                    typeof record.key === 'bigint' ? record.key.toString() : record.key
                  );
                  setEditingColumn(meta.dataIndex);
                  form.setFieldsValue(convertDateFields(record, columnMetas));
                }
              },
              handleChange: (value: string) => {
                record.handleChange?.(value, meta.dataIndex, record);

                if (!record.isEmpty) {
                  setEditingKey(
                    typeof record.key === 'bigint' ? record.key.toString() : record.key
                  );
                  setEditingColumn(meta.dataIndex);
                  (record as Record<string, unknown>)[meta.dataIndex] = value;
                  form.setFieldsValue(convertDateFields(record, columnMetas));
                }
              },
            }),
            render: (text: string, record: T) => (record.isEmpty ? null : text),
          };
        }

        // 일반 컬럼
        return {
          ...meta,
          align: 'center' as const,
          render: (text: string, record: T) => (record.isEmpty ? null : text),
        };
      }),
    [columnMetas, router, linkPrefix, isEditing, editingColumn, form, convertDateFields]
  );

  // 데이터 부족 시 빈 row 처리 (항상 pageSize 만큼 row 유지)
  const renderData: T[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    const emptyRowsCount = pageSize - data.length;
    const emptyRows = Array.from({ length: emptyRowsCount }, (_, idx) => ({
      ...Object.fromEntries(columnMetas.map((meta) => [meta.dataIndex, ''])),
      key: `empty-${currentPage}-${idx}`,
      isEmpty: true,
    })) as T[];
    return [...data, ...emptyRows];
  }, [data, pageSize, columnMetas, currentPage]);

  // 스켈레톤 컬럼
  const skeletonColumns = useMemo(
    () =>
      columnMetas.map((meta) => ({
        key: meta.key,
        width: meta.width ?? 100,
      })),
    [columnMetas]
  );

  // 최초 마운트 시 짧은 스켈레톤 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton) {
    return <TableSkeleton columns={skeletonColumns} rowCount={pageSize} />;
  }

  return (
    <>
      <TableWrapper>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={columns}
            dataSource={renderData}
            pagination={false}
            loading={showAntdLoading}
            style={{ minHeight: TABLE_MIN_HEIGHT, minWidth: TABLE_MIN_WIDTH }}
            scroll={{ x: 'max-content' }}
            rowClassName={(_, index) =>
              cx(
                css(rowCellStyle),
                css(customRowHoverStyle),
                renderData?.[index]?.isEmpty && css(emptyRowStyle),
                index === renderData.length - 1 && css(lastRowNoBorderStyle)
              )
            }
            locale={{
              emptyText: (
                <EmptyTextWrapper>
                  <span>데이터가 없습니다.</span>
                </EmptyTextWrapper>
              ),
            }}
          />
        </Form>
      </TableWrapper>
      <PaginationCenterWrapper>
        <Pagination
          pageSize={pageSize}
          current={currentPage}
          total={totalElements}
          onChange={(page) => {
            if (paginationInfo?.onChange) {
              paginationInfo.onChange(page);
            }
          }}
          showSizeChanger={false}
        />
      </PaginationCenterWrapper>
    </>
  );
};

export default DataTable;
