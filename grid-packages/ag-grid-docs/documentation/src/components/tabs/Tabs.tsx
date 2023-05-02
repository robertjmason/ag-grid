import React, { ReactNode, FunctionalComponent, useState } from 'react';
import classnames from 'classnames';
import { doOnEnter } from '../key-handlers';
import styles from './Tabs.module.scss';

const TAB_LABEL_PROP = 'tab-label'; // NOTE: kebab case to match markdown html props
const TABS_HEADING_COMPONENT_NAME = 'tabsHeading';

interface Props {
    children: ReactNode;
}

export const Tabs: FunctionalComponent<Props> = ({ children }) => {
    const heading = children.find((child) => child.type?.name === TABS_HEADING_COMPONENT_NAME);
    const contentChildren = children.filter((child) => child.props && child.props[TAB_LABEL_PROP]);

    const [selected, setSelected] = useState(contentChildren[0]?.props[TAB_LABEL_PROP]);

    return <div className='tabs-outer'>
        <header className={classnames("tabs-header", {
            [styles.hasHeading]: Boolean(heading)
        })}>
            {heading}
            <ul className="tabs-nav-list" role="tablist">
                {contentChildren.map(({ props }, idx) => {
                    const label = props[TAB_LABEL_PROP];
                    return (
                        <li key={label} className="tabs-nav-item" role="presentation">
                            <a
                                href={`#${label}`}
                                className={classnames('tabs-nav-link', {'active': label === selected})}
                                onClick={(e) => { setSelected(label); e.preventDefault(); }}
                                onKeyDown={(e) => doOnEnter(e, () => { setSelected(label); })}
                                role="tab"
                                tabIndex={idx}
                            >
                                {label}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </header>
        <div className="tabs-content" role="tabpanel" aria-labelledby={`${selected} tab`}>
            {contentChildren.find(({ props }) => props[TAB_LABEL_PROP] === selected)}
        </div>
    </div>;
};
