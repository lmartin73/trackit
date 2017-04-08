import React from 'react'

import {Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget}  from '../../../components'

import BasicWizardWidget from '../components/wizards/BasicWizardWidget'
import FuelUxWizardWidget from '../components/wizards/FuelUxWizardWidget'

let Wizards = React.createClass({
    render: function () {
        return (
            <div id="content">
                <div className="row">
                    <BigBreadcrumbs items={['Forms', 'Wizards']} icon="fa fa-fw fa-pencil-square-o"
                                    className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
                    <Stats />
                </div>

                <WidgetGrid>

                    <div className="row">

                        <article className="col-sm-12 col-md-12 col-lg-6">

                            <BasicWizardWidget />
                        </article>

                        <article className="col-sm-12 col-md-12 col-lg-6">

                            <FuelUxWizardWidget />

                        </article>

                    </div>

                </WidgetGrid>

            </div>
        )
    }
});

export default Wizards