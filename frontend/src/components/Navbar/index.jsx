import React from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";
import Search from "../Search";
import styles from './navbar.module.css';

const Navbar = () => {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push('/login');
    dispatch(reset());
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.left}>
          <a href="#" className={styles.logoLink}>
            <img src="/Images/logo.png" alt="Logo" className={styles.logo} />
          </a>
          <Search />
        </div>

        <div className={styles.right}>
          {authState.profileFetched ? (
            <div className={styles.userMenu}>
              <span className={styles.greeting}>
                Hey, {authState?.user?.userId?.username}!
              </span>

              <div className={styles.profileDropdown}>
                <div className={styles.avatar}>
                  {authState?.user?.userId?.username?.charAt(0).toUpperCase()}
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" className={styles.dropdownArrow}>
                  <path d="M8.5 11.5L13 7H4l4.5 4.5z"/>
                </svg>
              </div>

              <button className={styles.logoutBtn} onClick={handleLogout}>
                Sign out
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button onClick={() => router.push("/login")} className={styles.joinBtn}>
                Join now
              </button>
              <button onClick={() => router.push("/login")} className={styles.signinBtn}>
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
