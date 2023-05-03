import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import isServerSideRendering from 'utils/is-server-side-rendering';
import { getEntryFile, getExampleFiles } from './helpers';
import { doOnEnter } from 'components/key-handlers';
import styles from './CodeViewer.module.scss';
import Code from '../Code';

/**
 * This renders the code viewer in the example runner.
 */
const CodeViewer = ({ isActive, exampleInfo }) => {
    const [files, setFiles] = useState(null);
    const [activeFile, setActiveFile] = useState(null);

    let unmount = false;
    const didUnmount = () => unmount;

    useEffect(() => {
        updateFiles(exampleInfo, setFiles, setActiveFile, didUnmount);
        return () => unmount = true;
    }, [exampleInfo]);

    const keys = files ? Object.keys(files).sort() : [];
    const exampleFiles = keys.filter(key => !files[key].isFramework);
    const frameworkFiles = keys.filter(key => files[key].isFramework);

    return <div className={classnames(styles.codeViewer, { [styles.hidden]: !isActive })}>
        <div className={styles.files}>
            {frameworkFiles.length > 0 && <h4>App</h4>}
            <ul className='list-style-none'>
                {exampleFiles.map(path => <FileItem key={path} path={path} isActive={activeFile === path} onClick={() => setActiveFile(path)} />)}
            </ul>
            {frameworkFiles.length > 0 &&
                <>
                    <h4>Framework</h4>
                    <ul className='list-style-none'>
                        {frameworkFiles.map(path => <FileItem key={path} path={path} isActive={activeFile === path} onClick={() => setActiveFile(path)} />)}
                    </ul>
                </>}
        </div>
        <div className={styles.code}>
            {!files && <FileView path={'loading.js'} code={'// Loading...'} />}
            {files && activeFile && files[activeFile] && <FileView key={activeFile} path={activeFile} code={files[activeFile].source} />}
        </div>
    </div>;
};

const updateFiles = (exampleInfo, setFiles, setActiveFile, didUnmount) => {
    if (isServerSideRendering()) { return; }

    const { framework, internalFramework } = exampleInfo;

    getExampleFiles(exampleInfo).then(files => {
        if (didUnmount()) { return; }

        setFiles(files);

        const entryFile = getEntryFile(framework, internalFramework);

        if (files[entryFile]) {
            setActiveFile(entryFile);
        } else {
            setActiveFile(Object.keys(files).sort()[0]);
        }
    });
};

const FileItem = ({ path, isActive, onClick }) =>
    <li>
        <button
            className={classnames('button-style-none', styles.file, { [styles.isActive]: isActive })}
            title={path}
            onClick={onClick}
            onKeyDown={e => doOnEnter(e, onClick)}
            tabIndex="0">{path}</button>
    </li>;

const ExtensionMap = {
    sh: 'bash',
    vue: 'html',
    tsx: 'jsx',
    json: 'js'
};

const FileView = ({ path, code }) => {
    const parts = path.split('.');
    const extension = parts[parts.length - 1];

    return <Code code={code} language={ExtensionMap[extension] || extension} />;
};

export default CodeViewer;