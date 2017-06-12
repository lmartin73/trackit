import * as firebase from 'firebase'
import {UserProfile} from '../auth/useracct'
//Definitions

/* Root database path to organization information */
const ORGANIZATION_DATAPATH = "organizations/"

/* Organization data structure
    organization/uid/

    orgData = {
        uid: ...,
        name: ...,
        description: ...,
        physicalAddress:{
            street1: ...,
            street2: ...,
            city: ...,
            state: ...,
            zip: ...,
            country: ...
        },
        mailingAddress:{
            street1: ...,
            street2: ...,
            city: ...,
            state: ...,
            zip: ...,
            country: ...
        },
        phone: ...,
        fax: ...,
        logoURL: ...,
        ownerUID: ...

    }

    organization/uid/users
        administratorUIDs: {},
        memberUIDs:{},
        pendingUIDs: {},

*/

export default class Organization {

    constructor(orgID = null){
        /* initialize organization attributes */
        this.uid = orgID
        this.orgDataPath = null;
        this.orgStoragePath = null;
        if(orgID){
            this.orgDataPath = `${ORGANIZATION_DATAPATH}/${orgID}`
            this.orgStoragePath = `${ORGANIZATION_DATAPATH}/${orgID}`
        }
        this.name = ""
        this.physicalAddress = {
            street1: "",
            street2: "",
            city: "",
            state: "",
            zip: "",
            country: ""
        }

        this.mailingAddress = {
            street1: "",
            street2: "",
            city: "",
            state: "",
            zip: "",
            country: ""
        }

        this.ownerUID = ""
//        this.administratorUIDs = {}
//        this.memberUIDs = {}
//        this.pendingUIDs = {}
        this.description = ""
        this.phone = ""
        this.fax = ""
        this.logoURL = ""
    }


    /* Create a new organization */
    createOrganization(orgData){
        /* create a uid for this organization */
        this.uid = firebase.database().ref('organizations').push().key;

        /* update profile structure to include newly created organization uid */
        orgData.uid = this.uid;
        this.orgDataPath = `${ORGANIZATION_DATAPATH}/${orgData.uid}`
        this.orgStoragePath = `${ORGANIZATION_DATAPATH}/${orgData.uid}`

        /* store organization data */
        firebase.database().ref(`${this.orgDataPath}`).set(orgData);

        /* set organization data for the owner */
        this.setOwner(orgData.ownerUID)

        /* update user's profile to reflect ownership of organization
        * By default, the owner is a member, administrator and owner to organization
        */
        const userRole = {
            isMember: true,
            isAdministator: true,
            isOwner: true,
            isPending: false
        }
        ownerProfile = new UserProfile(orgData.ownerUID);
        userOrgRef = ownerProfile.getOrgRef(this.orgUID);
        userOrgRef.update(userRole);

    }

    //make user an administrator of this organization
    addAdministrator(userUID=null){
        if(userUID){
            /* update organanization records to indicate new administrator */
            firebase.database().ref(`${this.orgDataPath}/administrators`).update(userUID)

            /* make sure this user is in the members list for this organization. they should be already- just precaution */
            firebase.database().ref(`${this.orgDataPath}/members`).update(userUID)

            /* remove user from pending list. again, another precaution */
            firebase.database().ref(`${this.orgDataPath}/requests/${userUID}`).remove();

            /* update the organization roles within this user's profile */
            const userRole = {
                isMember: true,
                isAdministator: true,
                isPending: false,
            }
            ownerProfile = new UserProfile(userUID);
            userOrgRef = ownerProfile.getOrgRef(this.orgUID);
            userOrgRef.update(userRole);
        }else{
            //TODO throw an error message
        }
    }

    removeAdministrator(userUID=null){
        if(userUID){

            if(userUID != this.ownerUID){
                /* remove this user from the organization's administrator list*/
                firebase.database().ref(`${this.orgDataPath}/administrators/${userUID}`).remove();
                /* update the organization roles within this user's profile */
                const userRole = {
                    isAdministator: false
                }
                ownerProfile = new UserProfile(userUID);
                userOrgRef = ownerProfile.getOrgRef(this.orgUID);
                userOrgRef.update(userRole);
            }else{
            // TODO - error, can't remove owner from administrator role
            }



        }
    }

    //make user a member of this organization
    addMember(userUID=null){
        if(userUID && this.uid){
            /* add this user to the member list for this organization*/
            firebase.database().ref(`${this.orgDataPath}/members`).update(userUID);
            /* update the organization roles within this user's profile */
            const userRole = {
                isMember: true,
                isPending:false
            }
            ownerProfile = new UserProfile(userUID);
            userOrgRef = ownerProfile.getOrgRef(this.orgUID);
            userOrgRef.update(userRole);
        }
    }

    removeMember(userUID=null){
        if(userUID && this.uid){
            if(userUID != this.ownerUID){
                /* remove this user from the organization's administrator list if exist*/
                firebase.database().ref(`${this.orgDataPath}/administrators/${userUID}`).remove();

                /* remove this user from the organization's members list*/
                firebase.database().ref(`${this.orgDataPath}/members/${userUID}`).remove();

                /* remove the organization from the user profile*/
                ownerProfile = new UserProfile(userUID);
                userOrgRef = ownerProfile.getOrgRef(this.orgUID);
                userOrgRef.remove();

            }else{
             //TODO can't remove owner of organization from member list
            }

        }

    }

    denyMemberRequest(userUID=null){
        if(userUID){
            /* remove this user from the organization's request list*/
            firebase.database().ref(`${this.orgDataPath}/requests/${userUID}`).remove();

            /* remove the organization from the user profile*/
            ownerProfile = new UserProfile(userUID);
            userOrgRef = ownerProfile.getOrgRef(this.orgUID);
            userOrgRef.remove();

        }

    }

    setOwner(userUID=null){
       if(userUID){
           /* update organization records to indicate new owner */
           firebase.database().ref(`${this.orgDataPath}/ownerUID`).set(userUID)

           /* update organization records to indicate new administrator */
           firebase.database().ref(`${this.orgDataPath}/administrators`).update(userUID)

           /* make sure this user is in the members list for this organization. they should be already- just precaution */
           firebase.database().ref(`${this.orgDataPath}/members`).update(userUID)

           /* remove user from pending list. again, another precaution */
           firebase.database().ref(`${this.orgDataPath}/requests/${userUID}`).remove();

           /* update the organization roles within this user's profile */
           const userRole = {
               isOwner:true,
               isMember: true,
               isAdministator: true,
               isPending: false,
           }
           ownerProfile = new UserProfile(userUID);
           userOrgRef = ownerProfile.getOrgRef(this.orgUID);
           userOrgRef.update(userRole);
       }else{
           //TODO throw an error message
       }
    }


    requestMemembership(userUID=null){
        if(userUID){
            /* add the user to the organization's requests list */
            firebase.database().ref(`${this.orgDataPath}/requests`).update(userUID);

            /* update the user's profile to reflect the organizaition request */
            const userRole = {
                isMember: false,
                isPending:true,
                isAdministator:false,
                isOwner:false
            }
            ownerProfile = new UserProfile(userUID);
            userOrgRef = ownerProfile.getOrgRef(this.orgUID);
            userOrgRef.update(userRole);

        }
    }
}