import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <nav style={styles.navbar}>
            <div style={styles.logo}>
                <Link href="/">TodoApp</Link>
            </div>
            <ul style={styles.navLinks}>
                <li style={styles.navItem}>
                    <Link href="/">Login</Link>
                </li>
                <li style={styles.navItem}>
                    <Link href="/signup">Signup</Link>
                </li>
                <li style={styles.navItem}>
                    <Link href="/allRoutes">All Routes</Link>
                </li>
            </ul>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#333',
        color: '#fff',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    navLinks: {
        listStyle: 'none',
        display: 'flex',
        gap: '1rem',
    },
    navItem: {
        fontSize: '1rem',
    },
};

export default Navbar;