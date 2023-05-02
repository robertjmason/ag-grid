import classnames from 'classnames';
import { withPrefix } from 'gatsby';
import React, { useState } from 'react';
import { Icon } from './Icon';
import styles from './IconsPanel.module.scss';

const icons = [
    'aggregation',
    'arrows',
    'asc',
    'cancel',
    'chart',
    'checkbox-checked',
    'checkbox-indeterminate',
    'checkbox-unchecked',
    'color-picker',
    'columns',
    'contracted',
    'copy',
    'cut',
    'cross',
    'csv',
    'desc',
    'excel',
    'expanded',
    'eye-slash',
    'eye',
    'filter',
    'first',
    'grip',
    'group',
    'last',
    'left',
    'linked',
    'loading',
    'maximize',
    'menu',
    'minimize',
    'next',
    'none',
    'not-allowed',
    'paste',
    'pin',
    'pivot',
    'previous',
    'radio-button-off',
    'radio-button-on',
    'right',
    'save',
    'small-down',
    'small-left',
    'small-right',
    'small-up',
    'tick',
    'tree-closed',
    'tree-indeterminate',
    'tree-open',
    'unlinked',
];

const capitalizeName = (name) => `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`;

const themes = ['alpine', 'balham', 'material'];

const onTabClick = (e, setActiveTheme, theme) => {
    e.preventDefault();
    setActiveTheme(theme);
};

const PanelTabs = ({ activeTheme, setActiveTheme }) => (
    <header>
        <ul className="tabs-nav-list">
            {themes.map((theme) => (
                <li className="tabs-nav-item" key={`${theme}-tab`}>
                    <button
                        className={classnames('button-style-none', 'tabs-nav-link', {
                            active: theme === activeTheme,
                        })}
                        data-toggle="tab"
                        role="tab"
                        onClick={(e) => onTabClick(e, setActiveTheme, theme)}
                        aria-controls={theme}
                        aria-selected={theme === activeTheme ? 'true' : 'false'}
                        disabled={theme === activeTheme}
                    >
                        {`${capitalizeName(theme)} Icons`}
                    </button>
                </li>
            ))}
        </ul>
    </header>
);

const IconsList = ({ theme }) => (
    <>
        {icons.map((icon) => (
            <div className={styles.iconItem}>
                <img src={withPrefix(`/theme-icons/${theme}/${icon}.svg`)} alt={icon} title={icon}></img>
                <p className={styles.iconName}>{icon}</p>
            </div>
        ))}
    </>
);

const PanelWrapper = ({ theme }) => (
    <div className={styles.iconList} role="tabpanel" aria-labelledby={`${theme}-tab`}>
        <IconsList theme={theme} />
    </div>
);

const BottomBar = ({ theme }) => (
    <footer className={styles.footer}>
        <a
            className={classnames('button', styles.downloadButton)}
            href={withPrefix(`/theme-icons/${theme}/${theme}-icons.zip`)}
        >
            Download All <Icon name="download" />
        </a>
    </footer>
);

/**
 * This is a viewer for the available theme icons, and will also let the user download the icons.
 */
const IconsPanel = () => {
    const [activeTheme, setActiveTheme] = useState('alpine');

    return (
        <div className="ag-styles">
            <div className="tabs-outer">
                <PanelTabs activeTheme={activeTheme} setActiveTheme={setActiveTheme} />

                <div className="tabs-content">
                    <PanelWrapper theme={activeTheme} />
                    <BottomBar theme={activeTheme} />
                </div>
            </div>
        </div>
    );
};

export default IconsPanel;
