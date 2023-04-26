import React from 'react';

export const Containers = () => {
    return (
        <>
            <p className="item-label">
                <span>Card:</span>
                <code>.card</code>
            </p>

            {/* `.ag-card` used because of bootstrap clash with `.card`. (.ag-styles issue)*/}
            <div className="ag-card">
                <header>
                    <h3>Card header example</h3>
                </header>

                <div className="content">
                    <p>
                        <b>Example content:</b> Non aut explicabo enim vel quos porro repellendus iure. Dolor sed
                        provident aut consequatur in.
                    </p>

                    <ul>
                        <li>
                            Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes
                            active muscles
                        </li>
                        <li>
                            New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10
                            Home, OS Office A & J 2016
                        </li>
                        <li>
                            Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back
                            for all-day comfort and support
                        </li>
                        <li>
                            Andy shoes are designed to keeping in mind durability as well as trends, the most stylish
                            range of shoes & sandals
                        </li>
                    </ul>
                </div>
            </div>

            <p className="item-label">
                <span>Tabbed section:</span>
                <code>.tabs-outer</code>
            </p>

            <div className="tabs-outer">
                <header>
                    <h3>Here's some tabs, you can switch content!</h3>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link active"
                                data-toggle="tab"
                                href="#component"
                                role="tab"
                                aria-controls="component"
                                aria-selected="true"
                            >
                                Component
                            </a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link"
                                id="template-tab"
                                data-toggle="tab"
                                href="#template"
                                role="tab"
                                aria-controls="template"
                                aria-selected="false"
                            >
                                Template
                            </a>
                        </li>
                    </ul>
                </header>
                <div className="tab-content" id="myTabContent">
                    <div
                        id="component"
                        role="tabpanel"
                        aria-labelledby="component-tab"
                        className="tab-pane show active"
                    >
                        Et inventore est veniam expedita adipisci. Dolor rerum in ex illo. Rerum autem deleniti aut
                        eligendi tempora aliquam nihil id magnam. Porro eveniet quisquam voluptate labore tempore saepe
                        qui qui facilis.
                    </div>
                    <div id="template" role="tabpanel" aria-labelledby="template-tab" className="tab-pane">
                        Ut natus velit quaerat quas quis distinctio illo aut. Neque autem atque sunt doloribus illum
                        fuga quam est mollitia. Et molestiae quia vero quos ipsa est eius voluptates repellendus.
                        Placeat consequatur maiores provident.
                    </div>
                </div>
            </div>
        </>
    );
};
