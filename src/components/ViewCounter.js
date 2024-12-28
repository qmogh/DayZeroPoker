'use client';

import { useEffect, useState } from 'react';

export default function ViewCounter() {
  const [views, setViews] = useState(0);

  useEffect(() => {
    const currentViews = parseInt(localStorage.getItem('pageViews') || '0');
    const newViews = currentViews + 1;
    localStorage.setItem('pageViews', newViews.toString());
    setViews(newViews);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 text-slate-400 text-sm">
      {views.toLocaleString()} views
    </div>
  );
} 