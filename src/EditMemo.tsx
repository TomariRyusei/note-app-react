import { MemoData, Tag } from "./App";
import { MemoForm } from "./MemoForm";
import { useMemo } from "./MemoLayout";

type EditNoteProps = {
  onSubmit: (id: string, data: MemoData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export const EditMemo = ({
  onSubmit,
  onAddTag,
  availableTags,
}: EditNoteProps) => {
  const memo = useMemo();

  return (
    <>
      <h1 className="mb-4">Edit Note</h1>
      <MemoForm
        title={memo.title}
        markdown={memo.markdown}
        tags={memo.tags}
        onSubmit={(data) => onSubmit(memo.id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  );
};
