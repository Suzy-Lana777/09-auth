// app/@modal/(.)notes/[id]/page.tsx

import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import NotePreviewClient from "./NotePreview.client";
import { fetchNoteByIdServer } from "@/lib/api/serverApi";

interface NotePreviewProps {
  params: Promise<{ id: string }>;
}

export default async function NotePreview({ params }: NotePreviewProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
