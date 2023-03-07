import { Badge, Button, Card, Col, Form, Row, Stack } from "react-bootstrap";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "./App";
import { MemoCard } from "./MemoCard";
import { EditTagsModal } from "./EditTagsModal";

// 一覧に必要な情報のみに絞ったMemo
export type SimplifiedMemo = {
  tags: Tag[];
  title: string;
  id: string;
};

type MemoListProps = {
  availableTags: Tag[];
  Memos: SimplifiedMemo[];
  onUpdateTag: (id: string, newLabel: string) => void;
  onDeleteTag: (id: string) => void;
};

export const MemoList = ({
  availableTags,
  Memos,
  onUpdateTag,
  onDeleteTag,
}: MemoListProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

  // メモ検索処理
  const filteredMemos = useMemo(() => {
    return Memos.filter((Memo) => {
      return (
        (title === "" ||
          Memo.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            Memo.tags.some((MemoTag) => MemoTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, Memos]);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>メモ一覧</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">メモを作成</Button>
            </Link>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => setEditTagsModalIsOpen(true)}
            >
              タグを編集
            </Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>タイトル</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Tags">
              <Form.Label>タグ</Form.Label>
              <ReactSelect
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredMemos.map((Memo) => (
          <Col key={Memo.id}>
            <MemoCard id={Memo.id} title={Memo.title} tags={Memo.tags} />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
        show={editTagsModalIsOpen}
        availableTags={availableTags}
        handleClose={() => setEditTagsModalIsOpen(false)}
      />
    </>
  );
};
