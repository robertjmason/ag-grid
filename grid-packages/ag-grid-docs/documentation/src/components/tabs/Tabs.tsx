import React, { ReactNode, FunctionalComponent, useState } from 'react';
import classnames from 'classnames';
import styles from './Tabs.module.scss';

const TAB_LABEL_PROP = 'tab-label'; // NOTE: kebab case to match markdown html props
const TABS_FOOTER_TYPE_NAME = 'TabsFooter';

interface Props {
    heading: string;
    children: ReactNode;
}

export const Tabs: FunctionalComponent<Props> = ({ heading, children }) => {
    const contentChildren = children.filter((child) => child.props && child.props[TAB_LABEL_PROP]);
    const footerChildren = children.filter((child) => child.type?.name === TABS_FOOTER_TYPE_NAME);

    const [selected, setSelected] = useState(contentChildren[0]?.props[TAB_LABEL_PROP]);
    const hasHeading = Boolean(heading);

    return <div className={classnames('tabs-outer', styles.tabsOuter)}>
        <header className={classnames("tabs-header", {
            [styles.hasHeading]: hasHeading
        })}>
            {hasHeading && <h3 className={styles.heading}>{heading}</h3>}
            <ul className="tabs-nav-list" role="tablist">
                {contentChildren.map(({ props }, idx) => {
                    const label = props[TAB_LABEL_PROP];
                    return (
                        <li key={label} className="tabs-nav-item" role="presentation">
                            <button
                                className={classnames('button-style-none', 'tabs-nav-link', {'active': label === selected})}
                                onClick={(e) => { setSelected(label); e.preventDefault(); }}
                                role="tab"
                                disabled={label === selected}
                            >
                                {label}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </header>
        <div className="tabs-content" role="tabpanel" aria-labelledby={`${selected} tab`}>
            {contentChildren.find(({ props }) => props[TAB_LABEL_PROP] === selected)}
        </div>
       {footerChildren}
    </div>;
};
