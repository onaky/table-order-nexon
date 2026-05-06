import { useState } from 'react';
import { useTableLogin } from '@/hooks/useAuth';
import { showToast } from '@/components/common/Toast';
import ToastContainer from '@/components/common/Toast';

export default function CustomerLoginPage() {
  const [storeId, setStoreId] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useTableLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId || !tableNo || !password) {
      showToast('error', '모든 필드를 입력해주세요.');
      return;
    }
    loginMutation.mutate(
      { storeId, tableNo: Number(tableNo), password },
      { onError: () => showToast('error', '로그인에 실패했습니다.') },
    );
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">TABLE ORDER</h1>
          <p className="text-gray-500 text-sm">테이블 초기 설정</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">매장 ID</label>
            <input
              type="text"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              placeholder="매장 식별자 입력"
              className="input-field"
              data-testid="login-store-id"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">테이블 번호</label>
            <input
              type="number"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              placeholder="테이블 번호 입력"
              className="input-field"
              data-testid="login-table-no"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="input-field"
              data-testid="login-password"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="btn-primary w-full mt-6 disabled:opacity-50"
            data-testid="login-submit"
          >
            {loginMutation.isPending ? '로그인 중...' : '설정 완료'}
          </button>
        </form>
      </div>
    </div>
  );
}
