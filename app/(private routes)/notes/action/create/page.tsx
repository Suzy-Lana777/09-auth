// app/(private routes)/notes/action/create/page.tsx


// app/(private routes)/notes/action/create/page.tsx
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";
import type { Metadata } from "next";
import { getCategoriesServer } from "@/lib/api/serverApi"; // має повертати масив категорій

export const metadata: Metadata = {
  title: "New Note Page",
  description: "Page for add new note",
  openGraph: {
    title: "New Note Page",
    description: "Page for add new note",
    url: "https://your-domain/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "New Note Page",
      },
    ],
  },
};

export default async function CreateNote() {
  // тягнемо категорії на сервері
  const categories = await getCategoriesServer();
  // формуємо масив назв тегів
  const tags = categories.map((c) => c.name);

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        {/* ПЕРЕДАЄМО обов’язковий проп tags */}
        <NoteForm tags={tags} />
      </div>
    </main>
  );
}
