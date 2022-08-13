import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/Register.module.css";
import { useRouter } from "next/router";
import axios from "axios";

export default function register() {
  const [userName, setUserName] = useState("");
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

  async function handleFormSubmitRegister() {
    const formData = {
      userName,
      email,
      password,
    };

    const res = await axios.post(`http://localhost:4000/sign-up`, formData);

    if (res.data.error) {
      console.log(res.data.error);
    } else {
      localStorage.setItem("token", res.data.token);
      router.push("/")
    }
  }

  return (
    <>
      <div className={styles["signup-page-wrapper"]}>
        <div className={styles["left-main-wrapper"]}>
          <img
            className={styles["special-image-2"]}
            id={styles["signup-page-img"]}
            src="/static/images/netflix.png"
            alt=""
          />
        </div>

        <div className={styles["right-main-wrapper"]}>
          <form
            id={styles["signup-form"]}
            onSubmit={function (e) {
              e.preventDefault();
              handleFormSubmitRegister();
            }}
          >
            <h1>MovieLandia24</h1>

            <label id={styles["username"]} htmlFor="">
              <input
                type="text"
                placeholder="Enter your username"
                required
                onChange={function (e) {
                  setUserName(e.target.value);
                }}
              />
            </label>

            <label htmlFor="">
              <input
                type="text"
                id={styles["email"]}
                placeholder="Enter your email"
                onChange={function (e) {
                  setEmail(e.target.value);
                }}
              />
            </label>

            <label htmlFor="">
              <input
                type="password"
                name=""
                id={styles["password"]}
                placeholder="Enter your password"
                required
                onChange={function (e) {
                  setPassword(e.target.value);
                }}
              />
            </label>

            <label htmlFor="">
              <button>Sign Up</button>
            </label>

            <label id={styles["login-link-wrapper"]} htmlFor="">
              You have an account?
              <Link id={styles["link"]} href={"/login"}>
                Log In
              </Link>
            </label>
          </form>
        </div>
      </div>
    </>
  );
}
