import { useState, useEffect } from "react";
import styles from "./style.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../../components/Button";
import { getProjectDetail } from "../../../api/requets/projects";

const PostDetailPage = (props) => {
  const navigate = useNavigate();
  const { id: postId } = useParams();
  const [loading, setLoading] = useState(false);
  const [postDetail, setPostDetail] = useState(null);
  const user = useSelector((state) => state.accountReducer.user);
  const isLogin = user !== null;

  useEffect(() => {
      setLoading(true);
      getProjectDetail(postId)
          .then(p => {
              console.log(p);
              setPostDetail(p);
          })
          .finally(() => setLoading(false))
          .catch(e => {
              alert('Please login.');
              navigate(-1);
          })
  }, [])

  // eslint-disable-next-line no-restricted-globals
  const goBack = () => navigate(-1);
  const makeRequest = () => {
      navigate(`/request/${postDetail._id}`);
  };

  return (
    <Layout>
      <div className={styles["post-detail-page"]}>
        {loading ? (
          <div className={styles.loading}>Please wait...</div>
        ) : postDetail ? (
          <div className={styles["post-wrapper"]}>
            <button
              onClick={() => goBack()}
              className={styles["action-btn-back"]}
            ></button>
            <div className={styles["info-wrapper"]}>
              <div className={styles["avatar-wrapper"]}>
                <img src={postDetail.ownerSimple.avatar} alt="avatar" />
                <span className={styles["name"]}>{postDetail.ownerSimple.username}</span>
                <span className={styles["year"]}>
                  • Year {postDetail.ownerSimple.yearOfStudy}
                </span>
                <span className={styles["title"]}>{postDetail.title}</span>
              </div>
            </div>
            <article>{postDetail.description}</article>
            <p className={styles["date"]}>{ new Date(postDetail.creationDate).toISOString().slice(0, 10) }</p>
          </div>
        ) : (
          <div>CONTENT NOT FOUND</div>
        )}

        {isLogin && (
          <div style={{ width: '890px', marginTop: 24, textAlign: 'right' }}>
            <Button size="larger" type="primary" onClick={makeRequest}>
              Create Request
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PostDetailPage;
