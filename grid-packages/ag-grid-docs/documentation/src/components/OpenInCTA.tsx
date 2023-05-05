import classnames from 'classnames';
import React, { FunctionComponent, MouseEventHandler, ReactNode } from 'react';
import styles from './OpenInCTA.module.scss';
import { Icon } from './Icon';

type CtaType = 'newTab' | 'plunkr' | 'stackblitz' | 'codesandbox';

interface Props {
    onClick: MouseEventHandler<HTMLButtonElement>;
    href: string;
    type: CtaType;
    children: ReactNode;
}

const COPY_TEXT: Record<CtaType, ReactNode> = {
    newTab: (
        <>
            Open in New Tab <Icon name="docs-import-export" />
        </>
    ),
    plunkr: (
        <>
            Open in Plunkr <Icon name="plunkr" />
        </>
    ),
    stackblitz: (
      <>
          Open in StackBlitz <Icon name="stackblitz" />
      </>
    ),
    codesandbox: (
        <>
            Open in CodeSandbox <Icon name="codesandbox" />
        </>
      ),
};

export const OpenInCTA: FunctionComponent<Props> = ({ onClick, href, type }) => {
    const isButton = Boolean(onClick);
    const copyText = COPY_TEXT[type];
    const typeClassName = styles.cta;
    const className = classnames('button-secondary', 'font-size-small', typeClassName);

    return isButton ? (
        <button className={className} onClick={onClick}>
            {copyText}
        </button>
    ) : (
        <a className={className} href={href} target="_blank" rel="noreferrer">
            {copyText}
        </a>
    );
};
