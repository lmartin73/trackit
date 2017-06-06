import React from 'react';

/*
    list of routes for profile components
*/
export default {
    path: 'settings',
    component: require('../../components/common/Layout').default,
    indexRoute: { onEnter: (nextState, replace) => replace('/settings/profile') },
    childRoutes: [
        {
            path: 'profile',
            getComponent(nextState, cb){
                System.import('./containers/profileContainer.js').then((m)=> {
                    cb(null, m.default)
                })
            }
        },
        {
            path: 'editprofile',
            getComponent(nextState, cb){
                System.import('./containers/editprofile.js').then((m)=> {
                    cb(null, m.default)
                })
            }
        }
    ]
};