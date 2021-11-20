/* eslint-disable import/no-anonymous-default-export */
import styles from "./style.module.css";
import bfStyles from "./bf.module.css";
import afStyles from "./af.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openLoginModal } from "../LoginModal";
import { setUser } from "../../store/slices/accountSlice";
import { useState } from "react";
import { useUserInfo } from "../../hooks/useUserInfo";
import { signout as apiSignOut }  from "../../api/requets/account";
import { useEffect } from "react";
import { checkSession } from "../../api/requets/account";

export default function () {
  const user = useUserInfo();
  const isLogin = user ? true : false;
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
        checkSession()
        .then(user => dispatch(setUser(user)))
        .catch(e => { });
  }, [])
    
  const openSignInModal = (type = "signin") => {
      openLoginModal(type)
          .then((user) => {
              dispatch(setUser(user));
              if (user.role === 1) {
                  navigate("/");
              }
              else {
                  navigate("/manage");
              }
          })
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      // use this to encode special characters.
      const param = new URLSearchParams({ content: content });
      navigate("/search?" + param.toString());
    }
  };
  const toMyProfile = () => {
    if (isLogin) {
        navigate(`/profile/${user._id}`); 
    }
  };

  const signOut = () => {
    apiSignOut(user?.id)
      .then(() => {
        navigate("/");  
        dispatch(setUser(null));
      })
      .catch(() => alert('Failed'));
  };

  const getHeaderContent = (isLogin) => {
    if (!isLogin) {
      return (
        <div className={bfStyles.right}>
          <div className={bfStyles.loginButtonWrapper}>
            <span
              onClick={() => openSignInModal()}
              to="/test"
              className={bfStyles.link}
            >
              Login
            </span>
          </div>
          <div className={bfStyles.signupButtonWrapper}>
            <span
              onClick={() => openSignInModal("signup")}
              to="/test"
              className={bfStyles.link}
            >
              Sign up
            </span>
          </div>
        </div>
      );
    }
    return (
      <div className={afStyles.right}>
        {
            user.role === 1? <Link to="/" className={afStyles.link}>Home</Link> :
            <Link to="/manage" className={afStyles.link}>ManagerPage</Link>
        }
        
        <Link to="/createProject" className={afStyles.link}>
          Create
        </Link>
        <Link to="/myProjects" className={afStyles.link}>
          My Projects
        </Link>
        <div
          className={afStyles.avatar}
          onClick={() => toMyProfile()}
        >
          <img
            title={user.profile.username}
            src={user.profile.avatar}
            alt="avatar"
          />
        </div>
        <div className={afStyles.signoutBtn} onClick={signOut}>
          Sign Out
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            Linkus
          </Link>
          <div className={styles.searchBar}>
            <input
              onKeyPress={(e) => handleSearch(e)}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Search Course (ex. CSC108)"
              className={styles.searchInput}
            />
          </div>
        </div>
        {getHeaderContent(isLogin)}
      </div>
    </div>
  );
}
