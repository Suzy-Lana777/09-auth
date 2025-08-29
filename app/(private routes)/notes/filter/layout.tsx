// app/notes/filter/layout.tsx

import css from "./LayoutNotes.module.css"

interface NotesLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode; // слот паралельного сегмента @sidebar
};

export default function NotesLayout({ children, sidebar }: NotesLayoutProps) {
   return (
        <section className={css.container}>
            <aside className={css.sidebar}>{sidebar}</aside>
            <div className={css.notesWrapper}>{children}</div>
        </section>
    );
}

