import React, { ReactNode, FunctionalComponent } from 'react';
import styles from './TabsHeading.module.scss';


interface Props {
    children: ReactNode;
}

export const TabsHeading: FunctionalComponent<Props> = ({ children }) => {
    return <h3 className={styles.heading}>{children}</h3>
};
