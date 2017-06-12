import React from 'react'

export const WelcomeContent = (props) => {
    return(
        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-6 text-center">
            <h3 className="text-muted login-header-big">Thank you for registering!</h3>
            <img src="assets/img/logo.png" style={{width: '160px', height: '35px'}} />
            <br/><br/>
            <p>
                A confirmation email has been sent to:<br/>
                <strong className="text-muted">{" " + props.email}</strong>
            </p><br/>
            <p className="text-danger">Now it is time to set up your profile...</p>
            <p>Complete the form to get started!</p>
            <br/><hr/><br/>
        </div>
    )
}