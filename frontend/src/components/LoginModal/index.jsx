import { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Button from "../Button";
import { signup as apiSignUp, signin as apiSignIn } from "../../api/requets/account";
import cn from "classnames";
import { render, unmountComponentAtNode as unmount } from "react-dom";
import { pick } from "../../utils";

const LoginModal = (props) => {
  const { type, onClosed } = props;

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    repeatpassword: "",
    email: "",
  });
  const [visible, setVisible] = useState(false);
  const [modalType, setType] = useState(type);
  const [errorMessage, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const isSignin = modalType === "signin";

  const setFormVal = (filedName, val) => {
    setErrMsg(null);
    setLoginForm({
      ...loginForm,
      [filedName]: val,
    });
  };

  const switchTo = (type) => {
    setType(type);
  };

  const validate = () => {
    if (isSignin && ["email", "password"].find((f) => !loginForm[f])) {
      setErrMsg("Please input email and password");
      return false;
    }
    if (
      !isSignin &&
      ["email", "password", "repeatpassword", "username"].find(
        (f) => !loginForm[f]
      )
    ) {
      setErrMsg("Please input correct information");
      return false;
    }
    return true;
  };

  const signIn = async () => {
    try {
      setLoading(true);
      if (validate()) {
        const res = await apiSignIn(pick(loginForm, "email", "password"));
        let userInfo = { ...res, uuid: res._id };
        closeModal(userInfo);
      }
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    try {
      setLoading(true);
      if (validate()) {
        const res = await apiSignUp(loginForm);
        let userInfo = { ...res, uuid: res._id };
        closeModal(userInfo);
      }
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setVisible(true);
  }, []);

  const closeModal = (data) => {
    setVisible(false);
    setTimeout(() => onClosed && onClosed(data), 300);
  };

  return (
    <div
      className={cn(styles["login-modal-layer"], visible && styles.visible)}
      style={{ pointerEvents: loading ? "none" : "" }}
    >
      <div onClick={() => closeModal(null)} className={styles["mask-layer"]} />
      <div className={styles["login-modal"]}>
        <h1 className={styles["brand-logo"]}>LinkUs</h1>
        {isSignin ? (
          <div className={styles["signin-title"]}>
            <p className={styles["welcome-message"]}>Welcome back !</p>
            <h1 className={styles["title"]}>Sign In</h1>
          </div>
        ) : (
          <h1 className={styles["title"]}>Sign Up</h1>
        )}
        <div className={styles["form-wrapper"]}>
          {errorMessage && (
            <p className={styles["error-message"]}>{errorMessage}</p>
          )}
          {isSignin ? (
            <>
              <div className={styles["form-item"]}>
                <p className={styles["label"]}>Email</p>
                <input
                  type="text"
                  value={loginForm.email}
                  onChange={(e) => setFormVal("email", e.target.value)}
                />
              </div>
              <div className={styles["form-item"]}>
                <p className={styles["label"]}>
                  Password
                  <span className={styles["label-extra"]}>
                    Forgot Password?
                  </span>
                </p>
                <input
                  type="text"
                  value={loginForm.password}
                  onChange={(e) => setFormVal("password", e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className={styles["form-item"]}>
                <p className={styles["label"]}>Email</p>
                <input
                  type="text"
                  value={loginForm.email}
                  onChange={(e) => setFormVal("email", e.target.value)}
                />
              </div>
              <div className={styles["form-item"]}>
                <p className={styles["label"]}>Username</p>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setFormVal("username", e.target.value)}
                />
              </div>
              <div className={styles["form-item"]}>
                <p className={styles["label"]}>Password</p>
                <input
                  type="text"
                  value={loginForm.password}
                  onChange={(e) => setFormVal("password", e.target.value)}
                />
              </div>
              <div className={styles["form-item"]}>
                <p className={styles["label"]}>Repeat Password</p>
                <input
                  type="text"
                  value={loginForm.repeatpassword}
                  onChange={(e) => setFormVal("repeatpassword", e.target.value)}
                />
              </div>
            </>
          )}
        </div>
        <Button
          type="primary"
          size="large"
          radius={23}
          style={{ minWidth: 150 }}
          className={styles["login-btn"]}
          onClick={isSignin ? signIn : signUp}
        >
          {loading ? "Please wait..." : isSignin ? "sign in" : "sign up"}
        </Button>
        {isSignin && (
          <p className={styles["signin-link"]}>
            I don't have an account ?
            <a onClick={() => switchTo("signup")}>Sign up</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;

/**
 *
 * @param props : { type: 'signin' | 'signup' }
 *
 */
export const openLoginModal = (type) =>
  new Promise((resolve) => {
    const renderNode = document.createElement("div");
    renderNode.style.position = "fixed";
    renderNode.style.bottom = "0px";
    document.body.appendChild(renderNode);

    render(
      <LoginModal
        type={type}
        onClosed={(data) => {
          unmount(renderNode);
          document.body.removeChild(renderNode);
          resolve(data);
        }}
      />,
      renderNode
    );
  });
