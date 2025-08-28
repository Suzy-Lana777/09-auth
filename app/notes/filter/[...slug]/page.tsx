// app/notes/filter/[...slug]/page.tsx

import { fetchNotes, FetchNotesResponse } from "@/lib/api";
import NotesClient from "../../filter/[...slug]/Notes.client";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export const generateMetadata = async ({params}: Props): Promise<Metadata> => {
    const { slug } = await params;
    const tag = slug[0].toLowerCase() === "all" ? undefined : slug[0].toLowerCase();
  
    return {
        title: tag ? `Notes filtered by ${tag}` : "All notes",
        description: tag ? `Viewing notes with tag ${tag} tag.`
            : "Browse all available notes without falters.",
        openGraph: {
            title: tag ? `Viewing notes with tag ${tag}` : "All notes",
            description: tag ? `Browse notes filtered by the ${tag} tag.`
                : "Browse all available notes without falters.",
            url:  `https://notehub.com/notes/${tag}`,
            images: [
                {
                    url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                    width: 1200,
                    height: 630,
                    alt: tag,
                }
            ]
        }
    }

}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params; 
  const tag = slug?.[0] || "all"; 

  const initialPage = 1;
  const initialQuery = "";

  let initialData: FetchNotesResponse = { notes: [], totalPages: 0 };

  try {
    initialData = await fetchNotes(initialPage, initialQuery, tag);
  } catch (e) {
    console.error("fetchNotes error:", e);
    // якщо API впаде — повертаємо запасні дані
  }

  return (
    <NotesClient
      initialPage={initialPage}
      initialData={initialData}
      initialQuery={initialQuery}
      selectedTag={tag}
    />
  );
}

