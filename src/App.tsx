import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { NewMemo } from "./NewMemo";
import { MemoList } from "./MemoList";
import { useLocalStorage } from "./useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";

type Memo = {
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

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={<MemoList availableTags={tags} Memos={MemosWithTags} />}
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
        <Route path="/:id">
          <Route index element={<h1>Show</h1>}></Route>
          <Route path="edit" element={<h1>Edit</h1>}></Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
    </Container>
  );
}

export default App;
