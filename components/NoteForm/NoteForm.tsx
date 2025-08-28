
// "use client";

// import css from "./NoteForm.module.css";
// import { createNote, type NewNote } from "@/lib/api";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useNoteDraftStore } from "@/lib/store/noteStore";
// import { FormEvent } from "react";

// export default function NoteForm() {
//   const queryClient = useQueryClient();
//   const router = useRouter();
//   const { draft, setDraft, clearDraft } = useNoteDraftStore();

//   const { mutate, isPending } = useMutation({
//     mutationFn: (newNote: NewNote) => createNote(newNote),
//     onSuccess() {
//       queryClient.invalidateQueries({ queryKey: ["notes"] });
//       clearDraft();
//       router.push("/notes/filter/all");
//     },
//   });

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     mutate({
//       title: draft?.title || "",
//       content: draft?.content || "",
//       tag: (draft?.tag as NewNote["tag"]) || "Todo",
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className={css.form}>
//       <div className={css.formGroup}>
//         <label htmlFor="title">Title</label>
//         <input
//           id="title"
//           name="title"
//           type="text"
//           value={draft?.title || ""}
//           onChange={(e) => setDraft({ ...draft, title: e.target.value })}
//           className={css.input}
//           required
//         />
//       </div>

//       <div className={css.formGroup}>
//         <label htmlFor="content">Content</label>
//         <textarea
//           id="content"
//           name="content"
//           rows={8}
//           value={draft?.content || ""}
//           onChange={(e) => setDraft({ ...draft, content: e.target.value })}
//           className={css.textarea}
//         />
//       </div>

//       <div className={css.formGroup}>
//         <label htmlFor="tag">Tag</label>
//         <select
//           id="tag"
//           name="tag"
//           value={draft?.tag || "Todo"}
//           onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
//           className={css.select}
//         >
//           <option value="Todo">Todo</option>
//           <option value="Work">Work</option>
//           <option value="Personal">Personal</option>
//           <option value="Meeting">Meeting</option>
//           <option value="Shopping">Shopping</option>
//         </select>
//       </div>

//       <div className={css.actions}>
//         <button
//           type="submit"
//           className={css.submitButton}
//           disabled={isPending}
//         >
//           {isPending ? "Creating..." : "Create note"}
//         </button>

//         <button
//           type="button"
//           className={css.cancelButton}
//           onClick={() => router.back()}
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, type NewNote } from "@/lib/api";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

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
    mutate(draft);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setDraft({
      ...draft,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={draft.title}
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
          value={draft.content}
          onChange={handleChange}
          className={css.textarea}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={draft.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
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

        <button
          type="submit"
          className={css.submitButton}
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
