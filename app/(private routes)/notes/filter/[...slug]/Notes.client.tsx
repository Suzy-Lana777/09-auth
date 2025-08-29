"use client";

import React, { useEffect, useState } from "react";
import css from "./page.module.css";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import type { FetchNotesResponse } from "@/lib/api";
import Link from "next/link";

import { fetchNotes } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";

interface NotesClientProps {
  initialPage: number;
  initialData: FetchNotesResponse;
  initialQuery: string;
  selectedTag?: string;
}

export default function NotesClient({
  initialPage,
  initialData,
  initialQuery,
  selectedTag,
}: NotesClientProps) {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const searchTag =
    selectedTag?.toLowerCase() === "all" ? undefined : selectedTag;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearchQuery, searchTag],
    queryFn: () => fetchNotes(currentPage, debouncedSearchQuery, searchTag),
    placeholderData: keepPreviousData,
    initialData:
      currentPage === initialPage && searchQuery === initialQuery
        ? initialData
        : undefined,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load notes. Please try again.", {
        duration: 2000,
        position: "top-center",
      });
    }
  }, [isError]);

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            totalNumberOfPages={totalPages}
            currentActivePage={currentPage}
            setPage={setCurrentPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading ? (
        <p className={css.loading}>Loading notes...</p>
      ) : (
        <NoteList notes={notes} />
      )}
    </div>
  );
}
