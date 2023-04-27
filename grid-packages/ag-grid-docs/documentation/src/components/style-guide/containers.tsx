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
                <header className="tabs-header">
                    <h3>Here's some tabs, you can switch content!</h3>
                    <ul className="nav nav-tabs tabs-nav-list" id="myTab" role="tablist">
                        <li className="nav-item tabs-nav-item" role="presentation">
                            <a
                                className="nav-link tabs-nav-link active"
                                data-toggle="tab"
                                href="#sec-one"
                                role="tab"
                                aria-controls="sec-one"
                                aria-selected="true"
                            >
                                Section ONE
                            </a>
                        </li>
                        <li className="nav-item tabs-nav-item" role="presentation">
                            <a
                                className="nav-link tabs-nav-link"
                                id="sec-two-tab"
                                data-toggle="tab"
                                href="#sec-two"
                                role="tab"
                                aria-controls="sec-two"
                                aria-selected="false"
                            >
                                Section TWO
                            </a>
                        </li>
                        <li className="nav-item tabs-nav-item" role="presentation">
                            <a
                                className="nav-link tabs-nav-link"
                                id="sec-three-tab"
                                data-toggle="tab"
                                href="#sec-three"
                                role="tab"
                                aria-controls="sec-three"
                                aria-selected="false"
                            >
                                Section THREE
                            </a>
                        </li>
                        <li className="nav-item tabs-nav-item" role="presentation">
                            <a
                                className="nav-link tabs-nav-link"
                                id="sec-four-tab"
                                data-toggle="tab"
                                href="#sec-four"
                                role="tab"
                                aria-controls="sec-four"
                                aria-selected="false"
                            >
                                Section FOUR
                            </a>
                        </li>
                    </ul>
                </header>
                <div className="tab-content tabs-content" id="myTabContent">
                    <div
                        id="sec-one"
                        role="tabpanel"
                        aria-labelledby="sec-one-tab"
                        className="tab-pane tabs-panel show active"
                    >
                        <b>Section ONE:</b> Et inventore est veniam expedita adipisci. Dolor rerum in ex illo. Rerum
                        autem deleniti aut eligendi tempora aliquam nihil id magnam. Porro eveniet quisquam voluptate
                        labore tempore saepe qui qui facilis.
                    </div>
                    <div id="sec-two" role="tabpanel" aria-labelledby="sec-two-tab" className="tab-pane tabs-panel">
                        <b>Section TWO:</b> Ut natus velit quaerat quas quis distinctio illo aut. Neque autem atque sunt
                        doloribus illum fuga quam est mollitia. Et molestiae quia vero quos ipsa est eius voluptates
                        repellendus. Placeat consequatur maiores provident.
                    </div>
                    <div id="sec-three" role="tabpanel" aria-labelledby="sec-three-tab" className="tab-pane tabs-panel">
                        <b>Section THREE:</b> Velit laboriosam sed numquam excepturi quam distinctio incidunt ut ut.
                        Odit in quia nemo officiis perferendis aspernatur animi molestiae. Quia recusandae dolorem hic
                        repellat.
                    </div>
                    <div id="sec-four" role="tabpanel" aria-labelledby="sec-four-tab" className="tab-pane tabs-panel">
                        <b>Section FOUR:</b> Harum non non eveniet quo sit. Et qui aut cum. Aliquid sunt magnam quidem
                        qui non sint qui. Quis ex voluptatibus ad id eaque dolor tempora qui est. Vitae velit cum sunt
                        eaque illum quae et. Quo sapiente at est vitae ipsam.
                    </div>
                </div>
            </div>
        </>
    );
};
