import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { NewMemo } from "./NewMemo";
import { MemoList } from "./MemoList";
import { useLocalStorage } from "./useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import { MemoLayout } from "./MemoLayout";
import { Memo } from "./Memo";
import { EditMemo } from "./EditMemo";

export type Memo = {
  id: string;
} & MemoData;

export type RawMemo = {
  id: string;
} & RawMemoData;

export type RawMemoData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type MemoData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [Memos, setMemos] = useLocalStorage<RawMemo[]>("MEMOS", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const MemosWithTags = useMemo(() => {
    return Memos.map((Memo) => {
      return {
        ...Memo,
        tags: tags.filter((tag) => Memo.tagIds.includes(tag.id)),
      };
    });
  }, [Memos, tags]);

  function onCreateMemo({ tags, ...data }: MemoData) {
    setMemos((prevMemos) => {
      return [
        ...prevMemos,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function onUpdateMemo(id: string, { tags, ...data }: MemoData) {
    setMemos((prevMemos) => {
      return prevMemos.map((memo) => {
        if (memo.id === id) {
          return { ...memo, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return memo;
        }
      });
    });
  }

  function onDeleteNote(id: string) {
    setMemos((prevMemos) => {
      return prevMemos.filter((memo) => memo.id !== id);
    });
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function updateTag(id: string, newLabel: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, newLabel };
        } else {
          return tag;
        }
      });
    });
  }

  function deleteTag(id: string) {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <MemoList
              availableTags={tags}
              Memos={MemosWithTags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        ></Route>
        <Route
          path="/new"
          element={
            <NewMemo
              onSubmit={onCreateMemo}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        ></Route>
        <Route path="/:id" element={<MemoLayout memos={MemosWithTags} />}>
          <Route index element={<Memo onDelete={onDeleteNote} />}></Route>
          <Route
            path="edit"
            element={
              <EditMemo
                onSubmit={onUpdateMemo}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          ></Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
    </Container>
  );
}

export default App;
