/* eslint-disable import/no-anonymous-default-export */
import styles from "./style.module.css";
import headerBFLoginStyle from "./header.bf.module.css";
import headerAFLoginStyle from "./header.af.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openLoginModal } from "../../../components/LoginModal";
import { setUser } from "../../../store/slices/accountSlice";
import { useUserInfo } from "../../../hooks/useUserInfo";
import { checkSession, signout as apiSignout } from "../../../api/requets/account";
import { useEffect } from "react";

export default function () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useUserInfo();
    const isLogin = user ? true : false;
    
    useEffect(() => {
        checkSession()
        .then(user => dispatch(setUser(user)))
        .catch(e => { });
    }, [])

    const openAccountModal = (type = "signin") => {
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

    const toMyProfile = () => {
        if (isLogin) {
            navigate(`/profile/${user._id}`);
        }
    };

    const signOut = () => {
        apiSignout(user?.id)
        .then(() => {
            dispatch(setUser(null));
            navigate("/");
        })
        .catch(() => {});
    };

    console.log(user)

    const getMenuContent = (isLogin) => {
        if (!isLogin) {
        return (
            <div className={headerBFLoginStyle.menuContainer}>
            <button
                onClick={() => openAccountModal()}
                className={headerBFLoginStyle.loginButton}
            >
                Login
            </button>
            <button
                onClick={() => openAccountModal("signup")}
                className={headerBFLoginStyle.signupButton}
            >
                Sign up
            </button>
            </div>
        );
        }
        return (
        <div className={headerAFLoginStyle.menuContainer}>
        {
            user.role === 1? <Link to="/" className={headerAFLoginStyle.link}>Home</Link> :
            <Link to="/manage" className={headerAFLoginStyle.link}>ManagerPage</Link>
        }
            <Link to="/createProject" className={headerAFLoginStyle.link}>
            Create
            </Link>
            <Link to="/myProjects" className={headerAFLoginStyle.link}>
            My Projects
            </Link>
            <div
            className={headerAFLoginStyle.avatar}
            onClick={() => toMyProfile()}
            >
                <img title={user.profile.username} src={user.profile.avatar} alt="avatar" />
            </div>
            <div className={headerAFLoginStyle.signoutBtn} onClick={signOut}>Sign Out</div>
        </div>
        );
    };

    return (
        <div className={styles.container}>
        <div className={styles.wrapper}>
            <div className={styles.leftLogo}>
            <Link to="/" className={styles.link}>
                Linkus
            </Link>
            </div>
            {getMenuContent(isLogin)}
        </div>
        </div>
    );
}
