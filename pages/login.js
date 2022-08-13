import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Login.module.css";
import { useRouter } from "next/router";
import axios from "axios";

export default function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  function validateUser() {
    if (localStorage.token) {
      fetch("http://localhost:4000/validate", {
        headers: {
          Authorization: localStorage.token,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            router.push("/");
          }
        });
    }
  }

  useEffect(() => {
    validateUser();
  }, []);

  async function handleFormSubmitLogin() {
    const formData = {
      email,
      password,
    };

    const res = await axios.post(`http://localhost:4000/login`, formData);

    if (res.data.error) {
      console.log(res.data.error);
    } else {
      localStorage.setItem("token", res.data.token);
      router.push("/")
    }
  }

  return (
    <>
      <div className={styles["login-page-wrapper"]}>
        <div className={styles["left-main-wrapper"]}>
          <img
            className={styles["special-image-1"]}
            id={styles["login-page-img"]}
            src="/static/images/netflix.png"
            alt=""
          />
        </div>

        <div className={styles["right-main-wrapper"]}>
          <form
            id={styles["login-form"]}
            onSubmit={function (e) {
              e.preventDefault();
              handleFormSubmitLogin();
            }}
          >
            <h1>MovieLandia22</h1>

            <label htmlFor="">
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                required
                onChange={function (e) {
                  setEmail(e.target.value);
                }}
              />
            </label>

            <label htmlFor="">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                onChange={function (e) {
                  setPassword(e.target.value);
                }}
              />
            </label>

            <label htmlFor="">
              <button>Log In</button>
            </label>

            <label id={styles["signup-link-wrapper"]} htmlFor="">
              Don't have an account?{" "}
              <Link id={styles["link"]} href={"/register"}>
                Sign Up
              </Link>
            </label>
          </form>
        </div>
      </div>
    </>
  );
}
