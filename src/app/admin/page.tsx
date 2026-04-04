'use client';

import { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    window.location.href = '/sfbl-admin.html';
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0c1829', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ededed' }}>
      Redirecting to admin...
    </div>
  );
}
