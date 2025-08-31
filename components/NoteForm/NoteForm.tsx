// components/NoteForm/NoteForm.tsx
// "use client";

// import { useId } from "react";
// import { useRouter } from "next/navigation";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createNote } from "@/lib/api/clientApi";
// import type { NewNoteData } from "@/types/note"; // tag: string
// import { useNoteStore } from "@/lib/store/noteStore"; // ← саме useNoteStore
// import css from "./NoteForm.module.css";

// interface NoteFormProps {
//   tags: string[];
// }

// export default function NoteForm({ tags }: NoteFormProps) {
//   const router = useRouter();
//   const fieldId = useId();
//   const queryClient = useQueryClient();

//   const { draft, setDraft, clearDraft } = useNoteStore();

//   const mutation = useMutation({
//     mutationFn: (noteData: NewNoteData) => createNote(noteData),
//     onSuccess() {
//       queryClient.invalidateQueries({ queryKey: ["notes"] });
//       clearDraft();
//       router.back(); // або router.push("/notes/filter/all")
//     },
//   });

//   const handleChange = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     setDraft({
//       ...draft,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const handleSubmit = (formData: FormData) => {
//     // Збираємо значення з форми у тип NewNoteData (tag: string)
//     const values = Object.fromEntries(formData) as unknown as NewNoteData;
//     mutation.mutate(values);
//   };

//   return (
//     <form action={handleSubmit} className={css.form}>
//       <div className={css.formGroup}>
//         <label htmlFor={`${fieldId}-title`}>Title</label>
//         <input
//           id={`${fieldId}-title`}
//           type="text"
//           name="title"
//           className={css.input}
//           defaultValue={draft?.title}
//           onChange={handleChange}
//           required
//           minLength={3}
//           maxLength={50}
//         />
//       </div>

//       <div className={css.formGroup}>
//         <label htmlFor={`${fieldId}-content`}>Content</label>
//         <textarea
//           id={`${fieldId}-content`}
//           name="content"
//           rows={8}
//           className={css.textarea}
//           defaultValue={draft?.content}
//           onChange={handleChange}
//           maxLength={500}
//         />
//       </div>

//       <div className={css.formGroup}>
//         <label htmlFor={`${fieldId}-tag`}>Tag</label>
//         <select
//           id={`${fieldId}-tag`}
//           name="tag"
//           className={css.select}
//           defaultValue={draft?.tag || (tags.length ? tags[0] : "")}
//           onChange={handleChange}
//           required
//         >
//           {tags.map((t) => (
//             <option key={t} value={t}>
//               {t}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className={css.actions}>
//         <button type="button" className={css.cancelButton} onClick={() => router.back()}>
//           Cancel
//         </button>
//         <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
//           {mutation.isPending ? "Creating..." : "Create note"}
//         </button>
//       </div>
//     </form>
//   );
// }

// "use client";

// import { useRouter } from "next/navigation";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createNote } from "@/lib/api/clientApi";           // ✅ залишаємо createNote звідси
// import type { NewNote } from "@/types/note";                 // ✅ тип беремо з types
// import { useNoteStore } from "@/lib/store/noteStore";        // ✅ правильний хук
// import css from "./NoteForm.module.css";
// import { useMemo } from "react";

// const ALLOWED_TAGS = [
//   "Todo",
//   "Work",
//   "Personal",
//   "Meeting",
//   "Shopping",
//   "Ideas",
//   "Travel",
//   "Finance",
//   "Health",
//   "Important",
// ] as const;

// type TagValue = (typeof ALLOWED_TAGS)[number];

// const DEFAULT_DRAFT: NewNote = {
//   title: "",
//   content: "",
//   tag: "Todo",
// };

// export default function NoteForm() {
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   // ✅ використовуємо правильний хук
//   const { draft, setDraft, clearDraft } = useNoteStore();

//   // Завжди маємо валідний драфт (щоб не впасти на undefined)
//   const safeDraft: NewNote = useMemo(() => {
//     const title = draft?.title ?? "";
//     const content = draft?.content ?? "";
//     const tagRaw = (draft?.tag ?? "Todo") as string;

//     const tag = (ALLOWED_TAGS.includes(tagRaw as TagValue)
//       ? tagRaw
//       : "Todo") as TagValue;

//     return { title, content, tag };
//   }, [draft]);

//   const { mutate, isPending } = useMutation({
//     mutationFn: (newNote: NewNote) => createNote(newNote),
//     onSuccess() {
//       queryClient.invalidateQueries({ queryKey: ["notes"] });
//       clearDraft();
//       router.push("/notes/filter/all");
//     },
//   });

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const title = safeDraft.title.trim();
//     const content = (safeDraft.content ?? "").trim();
//     const tag = safeDraft.tag;

//     // Простенька перевірка перед відправкою
//     if (title.length < 3 || title.length > 50) return;
//     if (content.length > 500) return;
//     if (!ALLOWED_TAGS.includes(tag as TagValue)) return;

//     const payload: NewNote = { title, content, tag };
//     mutate(payload);
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;

//     // Нормалізуємо tag до дозволених значень
//     if (name === "tag") {
//       const v = ALLOWED_TAGS.includes(value as TagValue) ? (value as TagValue) : "Todo";
//       setDraft({ ...safeDraft, tag: v });
//       return;
//     }

//     // Title/Content
//     setDraft({
//       ...safeDraft,
//       [name]: value,
//     });
//   };

//   const isTitleInvalid =
//     safeDraft.title.trim().length < 3 || safeDraft.title.trim().length > 50;
//   const isContentInvalid = (safeDraft.content ?? "").trim().length > 500;
//   const isTagInvalid = !ALLOWED_TAGS.includes(safeDraft.tag as TagValue);

//   const isSubmitDisabled = isPending || isTitleInvalid || isContentInvalid || isTagInvalid;

//   return (
//     <form onSubmit={handleSubmit} className={css.form}>
//       <div className={css.formGroup}>
//         <label htmlFor="title">Title</label>
//         <input
//           id="title"
//           type="text"
//           name="title"
//           value={safeDraft.title}
//           onChange={handleChange}
//           className={css.input}
//           required
//           minLength={3}
//           maxLength={50}
//         />
//         {isTitleInvalid && (
//           <span className={css.error}>Title must be 3–50 characters</span>
//         )}
//       </div>

//       <div className={css.formGroup}>
//         <label htmlFor="content">Content</label>
//         <textarea
//           id="content"
//           name="content"
//           rows={8}
//           value={safeDraft.content}
//           onChange={handleChange}
//           className={css.textarea}
//           maxLength={500}
//         />
//         {isContentInvalid && (
//           <span className={css.error}>Content must be ≤ 500 characters</span>
//         )}
//       </div>

//       <div className={css.formGroup}>
//         <label htmlFor="tag">Tag</label>
//         <select
//           id="tag"
//           name="tag"
//           value={safeDraft.tag}
//           onChange={handleChange}
//           className={css.select}
//         >
//           {ALLOWED_TAGS.map((t) => (
//             <option key={t} value={t}>
//               {t}
//             </option>
//           ))}
//         </select>
//         {isTagInvalid && <span className={css.error}>Invalid tag</span>}
//       </div>

//       <div className={css.actions}>
//         <button
//           type="button"
//           className={css.cancelButton}
//           onClick={() => router.back()}
//           disabled={isPending}
//         >
//           Cancel
//         </button>

//         <button type="submit" className={css.submitButton} disabled={isSubmitDisabled}>
//           {isPending ? "Creating..." : "Create note"}
//         </button>
//       </div>
//     </form>
//   );
// }

"use client";

import { useState } from "react";
import { createNote } from "@/lib/api/clientApi";
import css from "./NoteForm.module.css";

export interface NoteFormProps {
  tags: string[]; // список доступних тегів
}

export default function NoteForm({ tags }: NoteFormProps) {
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
      await createNote({ title, content, tag });
      setTitle("");
      setContent("");
      setTag(tags[0] || "Todo");
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
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={css.textarea}
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
        >
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className={css.submitButton} disabled={loading}>
        {loading ? "Creating..." : "Create Note"}
      </button>

      {error && <p className={css.error}>{error}</p>}
    </form>
  );
}
