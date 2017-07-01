import React from 'react';

/*
    List of routes for organization components
*/
export default {
    path: 'organizations',
    component: require('../../components/common/Layout').default,
    indexRoute: { onEnter: (nextState, replace) => replace('/organizations/listorgs') },
    childRoutes: [
        {
            path: 'listorgs',
            getComponent(nextState, cb){
                System.import('./containers/ListOrgContainer.js').then((m)=> {
                    cb(null, m.default)
                })
            }
        },
        {
            path: 'detailorg',
            getComponent(nextState, cb){
                System.import('./containers/DetailOrgContainer.js').then((m)=> {
                    cb(null, m.default)
                })
            }
        },
//        {
//            path: 'editorg',
//            getComponent(nextState, cb){
//                System.import('./containers/EditOrg.js').then((m)=> {
//                    cb(null, m.default)
//                })
//            }
//        },
//        {
//            path: 'addorg',
//            getComponent(nextState, cb){
//                System.import('./containers/AddOrg.js').then((m)=> {
//                    cb(null, m.default)
//                })
//            }
//        },
//        {
//            path: 'joinorg',
//            getComponent(nextState, cb){
//                System.import('./containers/JoinOrg.js').then((m)=> {
//                    cb(null, m.default)
//                })
//            }
//        },
    ]
};