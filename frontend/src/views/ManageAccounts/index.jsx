import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Permission from "../../components/Permission";
import Layout from "../../components/Layout";
import {
  getAllAccounts as apiGetAllAccount,
  // deleteAccount as apiDeleteAccount
} from "../../api/requets/account";
import Button from "../../components/Button";
import { Link } from "react-router-dom";

const AccountListScreen = () => {
  const [acctList, setAcctList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiGetAllAccount()
      .then((list) => setAcctList(list))
      .finally(() => setLoading(false));
  }, []);

  // const deleteAccount = (id, idx) => {
  //   if (window.confirm("Are you sure you want to delete?")) {
  //     apiDeleteAccount(id).then(() => {
  //       const newList = [...acctList];
  //       newList.splice(idx, 1);
  //       setAcctList(newList);
  //     }).catch(() => alert('Failed to delete'))
  //   }
  // };

  return (
    <Layout>
      <Permission role={Permission.ROLES.admin}>
        <div className={styles.listPage}>
          <h1 className={styles.title}>All Accounts</h1>

          {loading ? (
            <h2>Please wait...</h2>
          ) : (
            <div className={styles.accountList}>
              {acctList.map((acct, idx) => (
                <div className={styles.listItem} key={idx}>
                  <img src={acct.profile.avatar} alt="avatar" />
                  <h3 className={styles.name}>{acct.profile.username}</h3>
                  <div className={styles.actionBtn}>
                    <Link to={`/account-manage/${acct._id}`}>
                      <Button type="primary">View</Button>
                    </Link>
                    {/* <Button type="danger" onClick={() => deleteAccount(acct._id, idx)}>
                      Delete
                    </Button> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Permission>
    </Layout>
  );
};

export default AccountListScreen;
