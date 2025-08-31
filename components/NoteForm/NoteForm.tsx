// components/NoteForm/NoteForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/api/clientApi";
import css from "./NoteForm.module.css";

export interface NoteFormProps {
  tags: string[]; // список доступних тегів
}

export default function NoteForm({ tags }: NoteFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState(tags[0] || "Todo");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createNote({ title, content, tag }); // <- API очікує { title, content, tag }
      // очистимо форму
      setTitle("");
      setContent("");
      setTag(tags[0] || "Todo");
      // редирект на список
      router.push("/notes/filter/all");
    } catch (err) {
      console.error("Create note error:", err);
      setError("Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={css.input}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={css.textarea}
          rows={8}
          maxLength={500}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className={css.select}
          required
        >
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button type="submit" className={css.submitButton} disabled={loading}>
          {loading ? "Creating..." : "Create Note"}
        </button>
      </div>

      {error && <p className={css.error}>{error}</p>}
    </form>
  );
}
