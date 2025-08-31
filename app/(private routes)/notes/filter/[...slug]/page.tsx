// app/notes/filter/[...slug]/page.tsx

import NotesClient from "./Notes.client";
import type { Metadata } from "next";
import { fetchNotesServer } from "@/lib/api/serverApi";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const raw = slug?.[0]?.toLowerCase();
  const tag = raw && raw !== "all" ? raw : undefined;

  const title = tag ? `Notes filtered by ${tag}` : "All notes";
  const description = tag
    ? `Browse notes filtered by the "${tag}" tag.`
    : "Browse all available notes without filters.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-routing-nextjs-blond.vercel.app/notes/filter/${tag ?? "all"}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: tag ?? "all",
        },
      ],
      type: "article",
    },
  };
}

export default async function NotesByCategory({ params }: Props) {
  const { slug } = await params;
  const raw = slug?.[0]?.toLowerCase();
  const tag = raw && raw !== "all" ? raw : undefined;

  const initialPage = 1;
  const perPage = 12;
  const initialQuery = "";

  let data: any = { notes: [], totalPages: 0 };

  try {
    data = await fetchNotesServer({ page: initialPage, perPage, search: initialQuery, tag });
  } catch (e) {
    console.error("fetchNotesServer failed:", e);
  }

  return (
    <NotesClient
      initialPage={initialPage}
      initialData={data}
      initialQuery={initialQuery}
      selectedTag={tag ?? "all"}
    />
  );
}
