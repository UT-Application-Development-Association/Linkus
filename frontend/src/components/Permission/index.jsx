import React from "react";
import styles from "./style.module.scss";
import {useSelector} from "react-redux";

const DefaultErrorPage = (
  <div className={styles.err443}>
    <h1>You have no permission to view this page, please login as Admin.</h1>
    <a href="/">Back to home</a>
  </div>
);


const Permission = (props) => {
  const { role, children, errorPage = DefaultErrorPage } = props;
  const user = useSelector(state => state.accountReducer.user);
  const roleArr = Array.isArray(role) ? role : [role]
  const hasPermission = role && user && roleArr.includes(user.role)
  return hasPermission ? children : errorPage;
};

export const ROLES = {
  admin: 2,
  common: 1,
}

Permission.ROLES = ROLES

export default Permission;
