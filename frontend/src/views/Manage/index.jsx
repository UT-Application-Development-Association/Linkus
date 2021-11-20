import React from "react";
import styles from "./style.module.scss";
import Permission from '../../components/Permission'
import Layout from '../../components/Layout'
import { Link } from 'react-router-dom'
import Button from "../../components/Button";

const AdminManagePage = () => {
  return (
    <Layout>
      <Permission role={Permission.ROLES.admin}>
        <div className={styles.managePage}>
          <Button radius={4} width={300} size="larger" type="primary">
            <Link to="/project-manage">Manage Projects</Link>
          </Button>
          <Button radius={4} width={300} size="larger" type="primary" style={{ marginTop: 24 }}>
            <Link to="/account-manage">Manage Accounts</Link>
          </Button>
          <Button radius={4} width={300} size="larger" type="primary" style={{ marginTop: 24 }}>
            <Link to="/report">Manage Reported Comment</Link>
          </Button>
        </div>
      </Permission>
    </Layout>
  );
};

export default AdminManagePage;
