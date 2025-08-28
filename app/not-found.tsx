// app/not-found.tsx

import css from "./page.module.css"
import React from 'react'
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '404 - Page not found',
    description: 'Sorry, the page you are looking for does not exist.',
    openGraph:{
        url: '/not-found',
        title: 'Page Not Found',
        description: 'This page has been not found',
        images: [{
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            height: 630,
            width: 1200,
        }]
    }
}

const NotFound = () => {
  
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>

    </div>
  );
};

export default NotFound
