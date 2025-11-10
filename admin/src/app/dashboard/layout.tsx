'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>Green Music Admin</h1>
        <div style={styles.navLinks}>
          <Link href="/dashboard" style={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/dashboard/products" style={styles.navLink}>
            Productos
          </Link>
          <Link href="/dashboard/users" style={styles.navLink}>
            Usuarios
          </Link>
          <Link href="/dashboard/songs" style={styles.navLink}>
            Canciones
          </Link>
          <Link href="/dashboard/config" style={styles.navLink}>
            Configuración
          </Link>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Cerrar Sesión
          </button>
        </div>
      </nav>
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  nav: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  main: {
    padding: '30px',
  },
};

