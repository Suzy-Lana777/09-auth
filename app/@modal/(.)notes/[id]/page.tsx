// app/@modal/(.)notes/[id]/page.tsx

  import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import NotePreviewClient from "./NotePreview.client";
import { getSingleNote } from "@/lib/api";

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export default async function NotePreview({ params }: NoteDetailsProps) {
  const { id } = await params;
  const parsedId = String(id);

  const queryClient = new QueryClient();

 try {
  await queryClient.prefetchQuery({
    queryKey: ['note', parsedId],
    queryFn: () => getSingleNote(parsedId),
  });
} catch (e) {
  console.error("prefetch note error", e);
}

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={parsedId} />
    </HydrationBoundary>
  );
} 

