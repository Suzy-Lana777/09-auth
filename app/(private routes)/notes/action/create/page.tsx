// app/(private routes)/notes/action/create/page.tsx


import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";
import { Metadata } from "next";
import { getCategoriesServer, type CategoryType } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "New Note Page",
  description: "Page for add new note",
  openGraph: {
    title: "New Note Page",
    description: "Page for add new note",
    url: "https://notehub.com/notes/action/create",
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
  // тягнемо категорії на сервері й беремо з них назви як теги
  const categories: CategoryType[] = await getCategoriesServer();
  const tags: string[] = categories.map((c) => c.name);

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm tags={tags} />
      </div>
    </main>
  );
}
