// components/BootstrapJs.tsx
'use client';

import { useEffect } from 'react';

export default function BootstrapJs() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}
