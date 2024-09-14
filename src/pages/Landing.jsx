import styles from "./Landing.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import AuthForm from "./forms/AuthForm";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

function Landing() {
  const { token } = useLocalStorageState(null, "token");
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add("login-template");

    return () => {
      document.body.classList.remove("login-template");
    };
  }, []);

  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, []);

  return (
    <Modal>
      <div className={styles["login-container"]}>
        <header>
          <nav className={styles["login-header"]}>
            <ul>
              <Modal.Open opens="login-form">
                <li
                  className={[styles["cta-btn"], styles["cta-btn-login"]].join(
                    " ",
                  )}
                >
                  Login
                </li>
              </Modal.Open>
              <Modal.Window name="login-form">
                <AuthForm formType="login-form" />
              </Modal.Window>
              <Modal.Open opens="signup-form">
                <li
                  className={[styles["cta-btn"], styles["cta-btn-signup"]].join(
                    " ",
                  )}
                >
                  Sign Up
                </li>
              </Modal.Open>
              <Modal.Window name="signup-form">
                <AuthForm formType="signup-form" />
              </Modal.Window>
              <Modal.Window name="reset-form">
                <AuthForm formType="reset-form" />
              </Modal.Window>
            </ul>
          </nav>
        </header>
        <div className={styles["login-content"]}>
          <div className={styles["login-heading-row"]}>
            <div className={styles["login-content-heading"]}>
              Start your Journaling journey Today
            </div>
            <p className={styles["login-content-text"]}>
              Take your Daily Experiences to an accountable level. Keep track of
              the momentums that got you to where you are now. Start Today!
            </p>
          </div>
          <div className={styles["login-content-row"]}>
            <div className={styles["login-content-outline"]}>
              <div className={styles["content-outlines"]}>
                <div className={styles["content-outline"]}>
                  <div className={styles["outline-heading"]}>
                    1. Start writing
                  </div>
                  <div className={styles["outline-text"]}>
                    Get your experiences written down. Budget time to reflect on
                    your day.
                  </div>
                </div>
                <div className={styles["content-outline"]}>
                  <div className={styles["outline-heading"]}>2. Tag it</div>
                  <div className={styles["outline-text"]}>
                    Create tags to culminate your experience to keep track of
                    it.
                  </div>
                </div>
                <div className={styles["content-outline"]}>
                  <div className={styles["outline-heading"]}>
                    3. Reflect and grow
                  </div>
                  <div className={styles["outline-text"]}>
                    Get to reflect on your experiences and daily activities for
                    growth.
                  </div>
                </div>
              </div>
              <div className={styles["content-img"]}>
                <div className={styles["content-img-box"]}>
                  <img
                    src="/journal.jpg"
                    alt="Diaries for Journaling stacked on each other"
                  />
                  <div className={styles["img-overlay"]}>
                    <ul>
                      <Modal.Open opens="login-form">
                        <li
                          className={[
                            styles["cta-btn"],
                            styles["cta-btn-login"],
                          ].join(" ")}
                        >
                          Login
                        </li>
                      </Modal.Open>
                      <Modal.Open opens="signup-form">
                        <li
                          className={[
                            styles["cta-btn"],
                            styles["cta-btn-signup"],
                          ].join(" ")}
                        >
                          Sign Up
                        </li>
                      </Modal.Open>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default Landing;
