// app/notes/filter/@sidebar/default.tsx

import Link from 'next/link';
import css from "./SideBarNotes.module.css";
import type { NoteTag } from '@/types/note';

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const NotesSidebar = () => (
  <ul className={css.menuList}>
    {["All notes", ...tags].map(tag => {
      const href = tag === "All notes" ? "/notes/filter/all" : `/notes/filter/${tag}`;
      return (
        <li key={tag} className={css.menuItem}>
          <Link href={href} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      );
    })}
  </ul>
);

export default NotesSidebar;
