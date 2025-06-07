import React, { useEffect, useState } from 'react';

interface PasskeyInfo {
  id: string;
  name: string;
  createdAt: string;
}

export default function PasskeyManage() {
  const [passkeys, setPasskeys] = useState<PasskeyInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPasskeys = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/fido2/manage/list');
      if (!resp.ok) throw new Error('패스키 목록 조회 실패');
      const data: PasskeyInfo[] = await resp.json();
      setPasskeys(data);
    } catch (e: any) {
      setError(e.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 패스키를 삭제하시겠습니까?')) return;
    try {
      const resp = await fetch(`/api/fido2/manage/delete?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!resp.ok) throw new Error('삭제 실패');
      setPasskeys((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert(e.message || '삭제 중 오류 발생');
    }
  };

  useEffect(() => {
    fetchPasskeys();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      {passkeys.length === 0 ? (
        <p>등록된 패스키가 없습니다.</p>
      ) : (
        <ul>
          {passkeys.map(({ id, name, createdAt }) => (
            <li key={id}>
              <strong>{name}</strong> (등록일: {new Date(createdAt).toLocaleString()})
              <button onClick={() => handleDelete(id)} style={{ marginLeft: 8 }}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
