
"use client"; 

import { useState } from 'react';
import Link from 'next/link';
import css from './TagsMenu.module.css';
import { NoteTag } from "@/types/note";

// Список тегів для нотаток
const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={css.menuContainer}>
      <button onClick={toggle} className={css.menuButton}>
        Notes ▾
      </button>

      {isOpen && (
        <ul className={css.menuList}>
          {/* Посилання на всі нотатки */}
          <li className={css.menuItem}>
            <Link 
              href="/notes/filter/all" 
              className={css.menuLink} 
              onClick={toggle}
            >
              All notes
            </Link>
          </li>

          {/* Посилання на кожен тег */}
          {tags.map(tag => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={`/notes/filter/${tag}`}
                className={css.menuLink}
                onClick={toggle}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
