import React from 'react'

export default class Footer extends React.Component {
    /*
        Footer component on all authentication components

        - Allows signin from 3rd party providers (Facebook, Google)
    */
    constructor() {
        super();
        // Initialize variables for action methods to keep component as a controlled component
        this.facebookSignIn = this.facebookSignIn.bind(this);
        this.googleSignIn = this.googleSignIn.bind(this);
    }

    facebookSignIn(event) {
        /*
            Signin/Signup with facebook provider

        */
        event.preventDefault();
        // Todo: Sign in with facebook
    }

    googleSignIn(event) {
        /*
            Signin/Signup with google provider
        */
        event.preventDefault();
        // Todo: Sign in with google
    }

    render() {
        return(
            <div>
                <h5 className="text-center"> - Or sign in using -</h5>
                <ul className="list-inline text-center">
                    <li>
                        <button onClick={this.facebookSignIn} className="btn btn-primary btn-circle"><i className="fa fa-facebook"/></button>
                    </li>
                    <li>
                        <button onClick={this.googleSignIn} className="btn btn-info btn-circle"><i className="fa fa-google"/></button>
                    </li>
                </ul>
            </div>
        )
    }
}