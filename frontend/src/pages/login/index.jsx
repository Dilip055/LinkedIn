import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Userlayout from "@/layout/userLayout";
import {
  getUserProfile,
  loginUser,
  registerUser,
} from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";
import styles from "./login.module.css";
import { toast } from "react-toastify";

const LoginSignup = () => {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(emptyMessage());
  }, [isLogin]);

  useEffect(() => {
    if (authState.message) {
      toast(authState.message);
    }
  }, [authState.message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        setFormData({
          username: "",
          name: "",
          email: "",
          password: "",
        });
        dispatch(getUserProfile({ token: localStorage.getItem("token") }));
      }
    } else {
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        setFormData({
          username: "",
          name: "",
          email: "",
          password: "",
        });
        setIsLogin(true); 
      }
    }
  };

  useEffect(() => {
    if (authState?.loggedIn) router.push("/dashboard");
  }, [authState.loggedIn]);

  useEffect(() => {
    if (localStorage.getItem("token")) router.push("/dashboard");
  }, []);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Userlayout>
      <div className={styles.containerWrapper}>
        <div className={styles.cardWrapper}>
          <img src="/Images/logo.png" alt="Logo" className={styles.logo} />
          <h2 className={styles.heading}>{isLogin ? "Sign in" : "Join now"}</h2>
          <p className={styles.subText}>
            {isLogin
              ? "Stay updated on your professional world"
              : "Make the most of your professional life"}
          </p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter username"
                  />
                </div>
              </>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter email"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.mb2}`}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter password"
              />
            </div>

            <div className={styles.dGrid}>
              <button
                type="submit"
                className={`btn btn-primary ${styles.btnSubmit}`}
              >
                <i
                  className={`bi ${isLogin ? "bi-box-arrow-in-right" : "bi-person-plus"}`}
                ></i>
                {isLogin ? "Sign in" : "Sign up"}
              </button>
            </div>

            <div className={styles.textCenter}>
              <small className="text-muted">
                {isLogin ? "New to LinkedIn?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  className={`btn btn-link ${styles.toggleLink}`}
                  onClick={toggleForm}
                >
                  {isLogin ? "Join now" : "Sign in"}
                </button>
              </small>
            </div>
          </form>
        </div>
      </div>
    </Userlayout>
  );
};

export default LoginSignup;
