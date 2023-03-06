import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { MemoData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid";

type MemoFormProps = {
  onSubmit: (data: MemoData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[]; // セレクトのオプションに設定するタグ(現在保存されているタグ)
} & MemoData;

export const MemoForm = ({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
}: MemoFormProps) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    });

    navigate("..");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>タイトル</Form.Label>
              <Form.Control
                ref={titleRef}
                required
                defaultValue={title}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="Tags">
              <Form.Label>タグ</Form.Label>
              <CreatableReactSelect
                // タグ作成時のアクション
                onCreateOption={(label) => {
                  const newTag = { id: uuidV4(), label };
                  onAddTag(newTag);
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
                //セレクトのオプション(現在保存されているタグ)
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                // 現在選択されているタグ
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                // タグを選択
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
        <Form.Group controlId="Markdown">
          <Form.Label>本文</Form.Label>
          <Form.Control
            ref={markdownRef}
            required
            as="textarea"
            rows={15}
            defaultValue={markdown}
          ></Form.Control>
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button type="submit" variant="primary">
            保存
          </Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">
              キャンセル
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
};
