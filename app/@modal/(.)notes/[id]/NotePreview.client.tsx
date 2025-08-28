"use client";

import React from "react";
import css from "./NotePreview.client.module.css";
import { getSingleNote } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";

interface NotePreviewClientProps {
  id: string;
}

const NotePreviewClient = ({ id }: NotePreviewClientProps) => {
  const router = useRouter();

  const { data: note, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => getSingleNote(id),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Something went wrong.</p>;
  if (!note) return <p>No note found</p>;

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <button className={css.backBtn} onClick={handleClose}>
            Back
          </button>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.createdAt}</p>
        </div>
      </div>
    </Modal>
  );
};

export default NotePreviewClient;
