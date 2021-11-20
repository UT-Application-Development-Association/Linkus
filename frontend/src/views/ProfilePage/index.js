/* eslint-disable import/no-anonymous-default-export */
import styles from "./style.module.css";
import Header from "../../components/Header";
import SideBar from "./SideBar/index";
import RightPart from "./RightPart";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById as apiGetUserById } from "../../api/requets/account";
import { useUserInfo } from "../../hooks/useUserInfo";

export default function (prop) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { uuid } = useParams();
  const [profile, setProfile] = useState(null);
  const user = useUserInfo()
  const requestForProfile = async (uuid) => {
    // TODO: This is mockup data, will be changed after backend being implemented.

    let userDetail = await apiGetUserById(uuid);
    if (!userDetail || !userDetail.profile) {
      throw new Error("No such user");
    }
    return userDetail.profile;
  };
  useEffect(() => {
      setLoading(true);
      requestForProfile(uuid)
        .then((profileVal) => setProfile(profileVal))
        .catch((e) => {
              alert("Please login");
              navigate(-1);
        })
        .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.bodyWrapper}>
        {loading && <h1>Loading</h1>}
        {profile && (
          <div className={styles.body}>
            <div className={styles.sidebarContainer}>
              <SideBar profile={profile} />
            </div>
            <div className={styles.rightContainer}>
              <RightPart profile={profile} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
