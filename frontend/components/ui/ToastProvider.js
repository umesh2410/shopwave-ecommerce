'use client';
import { Toaster } from 'react-hot-toast';
export default function ToastProvider() {
  return <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', background: '#1c1917', color: '#fafaf9' } }} />;
}
