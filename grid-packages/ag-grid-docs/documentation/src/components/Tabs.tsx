import React, { ReactNode, FunctionalComponent, useState } from 'react';
import classnames from 'classnames';
import { doOnEnter } from './key-handlers';
import styles from './Tabs.module.scss';


interface Props {
    heading?: ReactNode;
    children: ReactNode;
}

export const Tabs: FunctionalComponent<Props> = ({ heading, children }) => {
    const realChildren = children.filter((child) => child?.props?.label != null);

    const [selected, setSelected] = useState(realChildren[0].props.label);

    return <div className='tabs-outer'>
        <header className="tabs-header">
            {heading && <h3 className={styles.heading}>{heading}</h3>}
            <ul className="tabs-nav-list" role="tablist">
                {realChildren.map(({ props: { label = '' } }, idx) => {
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
            {realChildren.find(({ props: { label } }) => label === selected)}
        </div>
    </div>;
};
