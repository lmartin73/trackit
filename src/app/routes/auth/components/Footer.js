import React from 'react'

export default class Footer extends React.Component {

    constructor() {
        super();
        // Initialize variables for action methods to keep component as a controlled component
        this.facebook = this.facebookAction.bind(this);
        this.google = this.googleAction.bind(this);
    }

    facebookAction(event) {
        event.preventDefault();
        // Todo: Sign in with facebook here
    }

    googleAction(event) {
        event.preventDefault();
        // Todo: Sign in with google here
    }

    render() {
        return(
            <div>
                <h5 className="text-center"> - Or sign in using -</h5>
                <ul className="list-inline text-center">
                    <li>
                        <button onClick={this.facebook} className="btn btn-primary btn-circle"><i className="fa fa-facebook"/></button>
                    </li>
                    <li>
                        <button onClick={this.google} className="btn btn-info btn-circle"><i className="fa fa-google"/></button>
                    </li>
                </ul>
            </div>
        )
    }
}