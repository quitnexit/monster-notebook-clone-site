import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import jwt from 'jsonwebtoken';  // JWT'yi decode etmek için
import { useRouter } from 'next/navigation';  // Yönlendirme için

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Hamburger menu açma kapama
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const router = useRouter();


  /*

  // Sayfa yüklendiğinde token kontrolü yap
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Token varsa, decode et
      const decoded = jwt.decode(token) as { email: string, exp: number };
      if (decoded) {
        const expirationTime = decoded.exp * 1000;  // Token'in son kullanma tarihini milisaniye olarak al
        const currentTime = Date.now();  // Günü al

        // Token süresi dolmuşsa, logout yap
        if (currentTime > expirationTime) {
          localStorage.removeItem('token'); //Token'ı sil
          setIsLoggedIn(false); //Kullanıcıyı çıkar
          setUserName(null); //Kullanıcı bilgisini sıfırla
          //router.push('/login'); //Kullanıcıyı login sayfasına yönlendir
        } else {
          setIsLoggedIn(true);
          setUserName(decoded.email || 'User');
        }
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [router]);   */

  useEffect(() => {
    const verifyToken = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        try {
            // Backend'e token kontrolü için istek at
            const response = await fetch('http://localhost:5000/verify-token', {
                headers: {
                    'Authorization': `Bearer ${token}`  // Token'ı backend'e gönder
                }
            });

            if (response.ok) {
                // Token geçerliyse
                const data = await response.json();
                setIsLoggedIn(true);
                setUserName(data.user.email);
            } else {
                // Token geçersiz veya süresi dolmuşsa
                const data = await response.json();
                if (data.expired) {  // Backend'den gelen expired flag'ini kontrol et
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    setUserName(null);
                    //router.push('/login');
                }
            }
        } catch (error) {
            console.error('Token doğrulama hatası:', error);
            setIsLoggedIn(false);
        }
    };

    verifyToken();
}, []);

  // Logout işlemi
  const handleLogout = () => {
    localStorage.removeItem('token');  // Token'ı sil
    setIsLoggedIn(false);  // Kullanıcıyı çıkar
    setUserName(null);  // Kullanıcı bilgisini sıfırla
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <div className={styles.logo}>
          <h2>MySite</h2>
        </div>

        {/* Hamburger Menu Icon */}
        <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`} onClick={toggleMenu}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>

        {/* Menu */}
        <ul className={`${styles.navList} ${isMenuOpen ? styles.active : ''}`}>
          <li className={styles.navItem}>
            <Link href="/">Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/about">About</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/services">Services</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/contact">Contact</Link>
          </li>

          {/* Giriş yapılmışsa Welcome ve Logout, yapılmamışsa Login ve Register */}
          {isLoggedIn ? (
            <>
              <li className={styles.navItem}>
                <span className={styles.welcomeMessage}>Welcome, {userName}!</span>
              </li>
              <li className={styles.navItem}>
                <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className={styles.navItem}>
                <Link href="/login">Login</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
