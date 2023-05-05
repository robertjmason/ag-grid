import React, { FunctionComponent, ReactNode } from "react";
import styles from './TabsFooter.module.scss';

interface Props {
    children: ReactNode;
}

export const TabsFooter: FunctionComponent<Props> = ({ children }) => {
  return <div className={styles.footer}>
        {children}
    </div>;
};