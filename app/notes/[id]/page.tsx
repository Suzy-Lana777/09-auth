// app/notes/[id]/page.tsx

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import { getSingleNote } from '@/lib/api';
import { Metadata } from 'next';

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: NoteDetailsProps): Promise<Metadata> => {
  const { id } = await params;
  const data = await getSingleNote(id);

  return {
    title: `Note: ${data.title}`,
    description: data.content.slice(0, 30),
    openGraph: {
      title: `Note: ${data.title}`,
      description: data.content.slice(0, 100),
      url: `https://notehub.com/notes/${id}`,
      images: [
        {
          url: `https://ac.goit.global/fullstack/react/notehub-og-meta.jpg`,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
  };
};

export default async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = await params;
  const parsedId = String(id);

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['note', parsedId],
      queryFn: () => getSingleNote(parsedId),
    });
  } catch (e) {
    console.error('prefetch note error', e);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
