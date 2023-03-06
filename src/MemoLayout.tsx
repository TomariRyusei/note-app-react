import {
  Navigate,
  Outlet,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { Memo } from "./App";

type MemoLayoutProps = {
  memos: Memo[];
};

export const MemoLayout = ({ memos }: MemoLayoutProps) => {
  const { id } = useParams();
  const memo = memos.find((n) => n.id === id);

  if (memo == null) return <Navigate to="/" replace />;

  return <Outlet context={memo} />;
};

// 子コンポーネント(Memo.tsx,EditMemo.tsx)でコンテキストの値(Memo = 表示しているMemoの情報)を使うためのカスタムフック
export const useMemo = () => {
  return useOutletContext<Memo>();
};
