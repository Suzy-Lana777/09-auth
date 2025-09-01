// app/notes/filter/[...slug]/page.tsx

// app/(private routes)/notes/filter/[...slug]/page.tsx
import NotesClient from "./Notes.client";
import type { Metadata } from "next";
import { fetchNotesServer } from "@/lib/api/serverApi";
import type { FetchNotesResponse } from "@/lib/api/clientApi"; // лише тип!

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
      url: `https://07-routing-nextjs-blond.vercel.app/notes/filter/${tag ?? "all"}`,
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

  const page = 1;
  const perPage = 12;
  const search = "";

  // Юніон можливих форм відповіді серверного API
  type ServerRespA = { notes: FetchNotesResponse["notes"]; totalPages: number };
  type ServerRespB = { data: FetchNotesResponse["notes"]; totalPages: number };
  type ServerRespC = { items: FetchNotesResponse["notes"]; totalPages: number };

  let initialData: FetchNotesResponse = { notes: [], totalPages: 0 };

  try {
    const resp = (await fetchNotesServer({
      page,
      perPage,
      search,
      tag,
    })) as ServerRespA | ServerRespB | ServerRespC;

    if ("notes" in resp) {
      initialData = { notes: resp.notes, totalPages: resp.totalPages };
    } else if ("data" in resp) {
      initialData = { notes: resp.data, totalPages: resp.totalPages };
    } else {
      initialData = { notes: resp.items, totalPages: resp.totalPages };
    }
  } catch (e) {
    console.error("fetchNotesServer failed:", e);
    // залишаємо дефолтні дані
  }

  return (
    <NotesClient
      initialPage={page}
      initialData={initialData}
      initialQuery={search}
      selectedTag={tag ?? "all"}
    />
  );
}
