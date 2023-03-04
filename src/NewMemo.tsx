import { MemoForm } from "./MemoForm";
import { MemoData, Tag } from "./App";

type NewMemoProps = {
  onSubmit: (data: MemoData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export const NewMemo = ({
  onSubmit,
  onAddTag,
  availableTags,
}: NewMemoProps) => {
  return (
    <>
      <h1 className="mb-4">新しいメモ</h1>
      <MemoForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  );
};
