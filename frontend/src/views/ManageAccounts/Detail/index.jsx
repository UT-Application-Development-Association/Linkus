import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Permission from "../../../components/Permission";
import Layout from "../../../components/Layout";
import { getUserById } from "../../../api/requets/account";
import Button from "../../../components/Button";
import { useParams } from "react-router-dom";
import cn from "classnames";
import { useUserInfo } from "../../../hooks/useUserInfo";
import { deleteComment as apiDeleteComment } from "../../../api/requets/report";

const Rate = ({ rate }) => {
  let rateInt = Math.floor(rate);
  rateInt = rateInt >= 5 ? 5 : rateInt;
  rateInt = rateInt <= 0 ? 0 : rateInt;
  return (
    <div className={styles.rate}>
      {new Array(rateInt).fill("").map((_, idx) => (
        <span key={idx} className={styles.item} />
      ))}
      {new Array(5 - rateInt).fill("").map((_, idx) => (
        <span key={idx} className={cn(styles.item, styles.bg)} />
      ))}
    </div>
  );
};

const AccountDetailManageScreen = () => {
  const { id: acctId } = useParams();
  const [acctDetail, setAcctDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useUserInfo()

  useEffect(() => {
    if (user && acctId) {
      setLoading(true);
      getUserById(acctId)
        .then((detail) => setAcctDetail(detail))
        .finally(() => setLoading(false));
    }
  }, [acctId, user]);

  const deleteComments = (id, idx) => {
    if (window.confirm("Are you sure you want to delete?")) {
      apiDeleteComment(id).then(() => {
        const newDetail = { ...acctDetail };
        newDetail.comments.splice(idx, 1);
        setAcctDetail(newDetail);
      }).catch(() => alert('Failed to delete'))
    }
  };

  // const deleteAcct = () => {
  //   if (window.confirm("Are you sure you want to delete?")) {
  //   }
  // };

  const { profile = {} } = acctDetail || {}

  return (
    <Layout>
      <Permission role={Permission.ROLES.admin}>
        {loading ? (
          <h2 className={styles.loading}>Please wait...</h2>
        ) : acctDetail ? (
          <div className={styles.detailScren}>
            <aside className={styles.aside}>
              <img className={styles.avatar} src={profile.avatar} />
              {/* <Rate rate={acctDetail.rate || 0} /> */}
              <div className={styles.infoItem}>
                <p className={styles.label}>Name</p>
                <h2>{profile.username}</h2>
              </div>
              <div className={styles.infoItem}>
                <p className={styles.label}>Year of Study</p>
                <h2>{profile.yearOfStudy ? `${profile.yearOfStudy} Year` : 'none'}</h2>
              </div>
              <div className={styles.infoItem}>
                <p className={styles.label}>Program of Study</p>
                <h2>{profile.program || 'none'}</h2>
              </div>
              <div className={styles.infoItem}>
                <p className={styles.label}>Expected CGPA</p>
                <h2>{profile.exGPA || 'none'}</h2>
              </div>
            </aside>
            <main className={styles.main}>
              <h2>Biography</h2>
              <article>
                {profile.bio ? profile.bio : <p className={styles.emptyMessage}>No bio</p>}
              </article>
              <h2>Couses Taking</h2>
                {(profile.courses && profile.courses.length > 0) ? (
                  <ul>{profile.courses.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                  </ul>) : <p className={styles.emptyMessage}>No cources</p>}
              
              <h2>Comments</h2>
              {(profile.comments && profile.comments.length > 0) ?  profile.comments.map((comment, idx) => (
                <div className={styles.commentList}>
                  <p className={styles.comment}>{comment.comment}</p>
                  <Button onClick={() => deleteComments(comment._id, idx)} type="danger">
                    Delete
                  </Button>
                </div>
              )): <p className={styles.emptyMessage}>No comments</p>}
              {/* <div className={styles.actionBtn}>
                <Button
                  size="larger"
                  onClick={() => deleteAcct()}
                  type="danger"
                >
                  Delete This Account
                </Button>
              </div> */}
            </main>
          </div>
        ) : (
          <div />
        )}
      </Permission>
    </Layout>
  );
};

export default AccountDetailManageScreen;
