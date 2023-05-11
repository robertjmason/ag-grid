import DocumentationLink from 'components/DocumentationLink';
import { Icon } from 'components/Icon';
import React from 'react';
import isServerSideRendering from 'utils/is-server-side-rendering';
import styles from './CodeOptions.module.scss';

const isGeneratedExample = (type) => ['generated', 'mixed', 'typescript'].includes(type);

const ImportTypeSelector = ({ id, importType, onChange }) => {
    const formId = `${id}-import-style-selector`;
    return isServerSideRendering() ? null : (
        <>
            <label className="font-size-small" htmlFor={formId}>
                Import type:
            </label>{' '}
            <select
                className={styles.simpleSelect}
                id={formId}
                value={importType}
                onChange={onChange}
                onBlur={onChange}
            >
                {['packages', 'modules'].map((type) => (
                    <option key={type} value={type}>
                        {type[0].toUpperCase()}
                        {type.substring(1)}
                    </option>
                ))}
            </select>
        </>
    );
};

const ReactStyleSelector = ({ id, useFunctionalReact, useTypescript, onChange }) => {
    const formId = `${id}-react-style-selector`;
    return isServerSideRendering() ? null : (
        <>
            <label className="font-size-small" htmlFor={formId}>
                Code style:
            </label>{' '}
            <select
                className={styles.simpleSelect}
                id={formId}
                value={useFunctionalReact ? (useTypescript ? 'hooksTs' : 'hooks') : 'classes'}
                onChange={onChange}
                onBlur={onChange}
            >
                <option value="classes">Classes</option>
                <option value="hooks">Hooks</option>
                <option value="hooksTs">Hooks TS</option>
            </select>
        </>
    );
};

const VueStyleSelector = ({ id, useVue3, onChange }) => {
    const formId = `${id}-vue-style-selector`;
    return isServerSideRendering() ? null : (
        <>
            <label className="font-size-small" htmlFor={formId}>
                Version:
            </label>{' '}
            <select
                className={styles.simpleSelect}
                id={formId}
                value={JSON.stringify(useVue3)}
                onChange={onChange}
                onBlur={onChange}
            >
                <option value="false">Vue 2</option>
                <option value="true">Vue 3</option>
            </select>
        </>
    );
};

const TypescriptStyleSelector = ({ id, useTypescript, onChange }) => {
    const formId = `${id}-typescript-style-selector`;
    return isServerSideRendering() ? null : (
        <>
            <label className="font-size-small" htmlFor={formId}>
                Code style:
            </label>{' '}
            <select
                className={styles.simpleSelect}
                id={formId}
                value={JSON.stringify(useTypescript)}
                onChange={onChange}
                onBlur={onChange}
            >
                <option value="false">Javascript</option>
                <option value="true">Typescript</option>
            </select>
        </>
    );
};

const CodeOptions = ({ exampleInfo }) => {
    const isGenerated = isGeneratedExample(exampleInfo.type);

    return (
        <div className={styles.outer}>
            {exampleInfo.framework === 'javascript' &&
                (isGenerated || type === 'multi') &&
                (exampleInfo.internalFramework === 'vanilla' || exampleInfo.internalFramework === 'typescript') && (
                    <div>
                        <TypescriptStyleSelector
                            id={`${exampleInfo.linkId}-typescript-style-selector`}
                            useTypescript={exampleInfo.useTypescript}
                            onChange={(event) => exampleInfo.set({ useTypescript: JSON.parse(event.target.value) })}
                        />
                    </div>
                )}

            {/* perversely we don't show the hook/class when the type is react as the example provided will be displayed "as is" */}
            {exampleInfo.framework === 'react' && exampleInfo.type !== 'react' && (
                <div>
                    <ReactStyleSelector
                        id={exampleInfo.linkId}
                        useFunctionalReact={exampleInfo.useFunctionalReact}
                        useTypescript={exampleInfo.useTypescript}
                        onChange={(event) => {
                            switch (event.target.value) {
                                case 'classes':
                                    exampleInfo.set({ useFunctionalReact: false, useTypescript: false });
                                    break;
                                case 'hooks':
                                    exampleInfo.set({ useFunctionalReact: true, useTypescript: false });
                                    break;
                                case 'hooksTs':
                                    exampleInfo.set({ useFunctionalReact: true, useTypescript: true });
                                    break;
                                default:
                                    exampleInfo.set({ useFunctionalReact: true, useTypescript: true });
                                    break;
                            }
                        }}
                    />
                </div>
            )}

            {exampleInfo.enableVue3 && exampleInfo.framework === 'vue' && (
                <div>
                    <VueStyleSelector
                        id={exampleInfo.linkId}
                        useVue3={exampleInfo.useVue3}
                        onChange={(event) => exampleInfo.set({ useVue3: JSON.parse(event.target.value) })}
                    />
                </div>
            )}

            {exampleInfo.library === 'grid' &&
                (exampleInfo.framework !== 'javascript' || exampleInfo.internalFramework === 'typescript') &&
                isGenerated && (
                    <div>
                        <ImportTypeSelector
                            id={exampleInfo.linkId}
                            importType={exampleInfo.exampleImportType}
                            onChange={(event) => exampleInfo.set({ exampleImportType: event.target.value })}
                        />
                        <DocumentationLink
                            className={styles.importInfoIcon}
                            framework={exampleInfo.framework}
                            target="_blank"
                            href={`/packages-modules`}
                            role="tooltip"
                            title={
                                exampleInfo.exampleImportType === 'packages'
                                    ? 'Example is using AG Grid packages where all the grid features are included by default. Click for more info.'
                                    : 'Example is using AG Grid modules to minimise application bundle size and only includes the modules required to demonstrate the given feature. Click for more info.'
                            }
                        >
                            <Icon name="info" />
                        </DocumentationLink>
                    </div>
                )}
        </div>
    );
};

export default CodeOptions;
