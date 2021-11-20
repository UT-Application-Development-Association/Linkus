import styles from './style.module.scss';
import React from 'react';
import cn from 'classnames'
import Header from '../Header'

const Layout = (props) => {
  const { header = <Header />, children, className, ...restAsHTMLAttr } = props

  return (
    <div className={cn(styles.mainLayout, className)} {...restAsHTMLAttr}>
      <div className={styles.headerWrapper}>{header}</div>
      <main className={styles.mainWrapper}>
        {children}
      </main>
    </div>
  )
}

export default Layout