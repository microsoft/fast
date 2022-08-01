import React from "react";
import { CardLayout } from "../../theme/DocCard";
import styles from "./styles.module.css";


export function DocCardList({ children }) {
  return (
    <div className={styles.cardContainer}>
      {children}
    </div>
  );
}

export function DocCardItem(props) {
  return (
    <div className={styles.docCard}>
      <CardLayout {...props} />
    </div>
  );
}
