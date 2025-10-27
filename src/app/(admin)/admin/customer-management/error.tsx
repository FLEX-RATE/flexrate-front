'use client';

const AdminCustomerError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  console.error('[admin/customer-management] error:', error);
  return (
    <div style={{ padding: 24 }}>
      <h2>관리자 페이지에서 오류가 발생했어요.</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error?.stack || error?.message)}</pre>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  );
};

export default AdminCustomerError;
