import React from 'react'

export const LoadingSpinner = (props) => {
    return (
        <div>
            <div style={{marginTop: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <img style={{width: '30px', height: '30px'}} src="assets/img/spinner/ripple.gif" />
            </div><br/>
            <p className="text-center text-muted">{props.text}</p>
        </div>
    )
}