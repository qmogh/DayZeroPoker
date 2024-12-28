'use client';

import { useEffect, useState } from 'react';

export default function ViewCounter() {
  const [views, setViews] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {

    fetch('/api/views')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setViews(data.views);
        

        return fetch('/api/views', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              setError(data.error);
              return;
            }
            setViews(data.views);
          });
      })
      .catch(err => {
        console.error('Error:', err);
        setError('Failed to fetch view count');
      });
  }, []);

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 text-red-400 text-sm">
        Error loading views
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 text-slate-400 text-sm">
      {views.toLocaleString()} views
    </div>
  );
} 