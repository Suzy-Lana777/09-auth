// components/NoteForm/NoteForm.tsx

"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ChangeEvent, FormEvent } from "react";
import type { NewNote } from "@/types/note";
import { createNote } from "@/lib/api/clientApi";
import { useNoteStore } from "@/lib/store/noteStore"; // ⬅️ правильний хук
import css from "./NoteForm.module.css";

export interface NoteFormProps {
  tags: string[];
}

export default function NoteForm({ tags }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // глобальна чернетка зі стора
  const { draft, setDraft, clearDraft } = useNoteStore();

  const fallbackTag = tags?.[0] ?? "Todo";
  const title = draft?.title ?? "";
  const content = draft?.content ?? "";
  const tag = (draft?.tag as NewNote["tag"]) ?? (fallbackTag as NewNote["tag"]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setDraft({ ...draft, [name]: value });
  };

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.push("/notes/filter/all");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate({
      title: title.trim(),
      content: content.trim(),
      tag,
    });
  };

  const handleCancel = () => {
    clearDraft();
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
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
          value={content}
          onChange={handleChange}
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
          name="tag"
          value={tag}
          onChange={handleChange}
          className={css.select}
          required
        >
          {(tags?.length
            ? tags
            : [
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
              ]
          ).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? "Creating..." : "Create Note"}
        </button>
      </div>

      {isError && <p className={css.error}>{(error as any)?.message ?? "Failed to create note"}</p>}
    </form>
  );
}
