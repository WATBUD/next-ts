'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import AdLayout from '@/components/AdLayout';

// Default page if no valid page is specified
const DEFAULT_PAGE = 'language-practice-redux';

// Get the page name from environment variable or use default
const getPageComponent = (pageName: string = '') => {
  const page = pageName || DEFAULT_PAGE;
  const isDefaultPage = page === 'language-practice-redux';
  
  // Try to dynamically import the page component
  try {
    return dynamic(
      () => import(`@/app/${page}/page`)
        .then(module => {
          // Handle both default and named exports
          const PageComponent = module.default || module;
          return (props: any) => {
            const content = <PageComponent {...props} />;
            return isDefaultPage ? <AdLayout>{content}</AdLayout> : content;
          };
        })
        .catch(() => {
          // If page doesn't exist, fall back to default
          const DefaultPage = require(`@/app/${DEFAULT_PAGE}/page`).default;
          return (props: any) => <AdLayout><DefaultPage {...props} /></AdLayout>;
        }),
      {
        loading: () => (
          <div className="flex justify-center items-center min-h-screen">
            Loading {page}...
          </div>
        ),
      }
    );
  } catch (error) {
    // If there's any error, fall back to default page
    const DefaultPage = require(`@/app/${DEFAULT_PAGE}/page`).default;
    return dynamic(() => Promise.resolve((props: any) => (
      <AdLayout>
        <DefaultPage {...props} />
      </AdLayout>
    )));
  }
};

export default function Home() {
  // Get the page name from environment variable
  const pageName = process.env.NEXT_PUBLIC_HOME_PAGE || DEFAULT_PAGE;
  const isDefaultPage = pageName === 'language-practice-redux';
  
  // Get the component for the specified page
  const PageComponent = getPageComponent(pageName);

  const content = (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        Loading {pageName}...
      </div>
    }>
      <PageComponent />
    </Suspense>
  );

  // Only wrap with AdLayout for the default page
  return isDefaultPage ? <AdLayout>{content}</AdLayout> : content;
}
