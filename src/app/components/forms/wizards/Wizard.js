import React from 'react'

export default class Wizard extends React.Component {

    componentDidMount() {
        let self = this;
        let element = $(this.refs.wizard);
        var stepsCount = $('[data-smart-wizard-tab]').length;

        self.currentStep = 1;

        var validSteps = [];

        var $form = element.closest('form');

        var $prev = $('[data-smart-wizard-prev]', element);

        var $next = $('[data-smart-wizard-next]', element);

        self.next = $next;
        self.prev = $prev;

        var joinOrgCode = "1";

        function setStep(step) {
            self.currentStep = step;
            $('[data-smart-wizard-pane=' + step + ']', element).addClass('active').siblings('[data-smart-wizard-pane]').removeClass('active');
            $('[data-smart-wizard-tab=' + step + ']', element).addClass('active').siblings('[data-smart-wizard-tab]').removeClass('active');
            $prev.toggleClass('disabled', step == 1)
        }


        element.on('click', '[data-smart-wizard-tab]', function (e) {
            e.preventDefault();
            // Disable tabs from being accessed directly
            return false;
        });

        $next.on('click', function (e) {
            if (!this.props.orgLoaded && self.currentStep == 2 && this.props.compCode == joinOrgCode) {
                return false;
            }

            if ($form.data('validator')) {
                if (!$form.valid()) {
                    validSteps = _.without(validSteps, self.currentStep);
                    $form.data('validator').focusInvalid();
                    return false;
                } else {
                    validSteps = _.without(validSteps, self.currentStep);
                    validSteps.push(self.currentStep);
                    element.find('[data-smart-wizard-tab=' + self.currentStep + ']')
                        .addClass('complete')
                        .find('.step')
                        .html('<i class="fa fa-check"></i>');
                }
            }

            if (self.currentStep < stepsCount) {
                setStep(self.currentStep + 1);
            } else {
                if (validSteps.length < stepsCount) {
                    var steps = _.range(1, stepsCount + 1)

                    _(steps).forEach(function (num) {
                        if (validSteps.indexOf(num) == -1) {
                            setStep(num);
                            return false;
                        }
                    })
                } else {
                    var data = {};
                    _.each($form.serializeArray(), function (field) {
                        data[field.name] = field.value
                    });
                    if (_.isFunction(self.props.onComplete)) {
                        self.props.onComplete(data)
                    }
                }
            }

            e.preventDefault();
        }.bind(this));

        $prev.on('click', function (e) {
            if (!$prev.hasClass('disabled') && self.currentStep > 0) {
                setStep(self.currentStep - 1);
            }
            e.preventDefault();
        });

        setStep(self.currentStep);
    }

    render() {
        let {children, onComplete, orgLoaded, compCode, ...props} = this.props;
        return (
            <div {...props} ref="wizard">
                {children}
            </div>
        )
    }
}
