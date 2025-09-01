// components/NoteForm/NoteForm.tsx

"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import type { NewNote } from "@/types/note";
import { useNoteStore } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const TAGS: NewNote["tag"][] = [
    "Todo",
    "Work",
    "Personal",
    "Meeting",
    "Shopping",
    "Ideas",
    "Finance",
    "Health",
    "Important",
    "Travel",
  ];

  // якщо draft.tag порожній/невалідний — беремо перший з переліку
  const selectedTag: NewNote["tag"] =
    draft.tag && TAGS.includes(draft.tag as any)
      ? (draft.tag as NewNote["tag"])
      : TAGS[0];

  const { mutate, isPending } = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.push("/notes/filter/all");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({
      title: (draft.title ?? "").trim(),
      content: (draft.content ?? "").trim(),
      tag: selectedTag,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setDraft({ ...draft, [e.target.name]: e.target.value } as Partial<NewNote>);
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={draft.title ?? ""}
          onChange={handleChange}
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
          name="content"
          rows={8}
          value={draft.content ?? ""}
          onChange={handleChange}
          className={css.textarea}
          maxLength={500}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={selectedTag}
          onChange={handleChange}
          className={css.select}
          required
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={() => router.back()}>
          Cancel
        </button>

        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
