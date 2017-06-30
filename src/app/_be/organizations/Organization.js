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

    constructor(orgID = ""){
        /* initialize organization attributes */
        this.initializeOrg(orgID);

        if(orgID != ""){
            /* Download the organization information from the database. */
            this.downloadOrganizationInfo();
        }
    }

    setOrg(orgID = ""){
        /* initialize this class structore to the given orgUID */
        this.initializeOrg(orgID);

        if(orgID != ""){
            /* Download the organization information from the database. */
            this.downloadOrganizationInfo();
        }
    }

    initializeOrg(orgID = ""){
        this.org = {
            uid: orgID ,
            name: "",
            physicalAddress:{
               street1:"",
               street2:"",
               city:"",
               state:"",
               zip:"",
               country:""
            },
            mailingAddress:{
               street1:"",
               street2:"",
               city:"",
               state:"",
               zip:"",
               country:"",
            },
            ownerUID:"",
            description:"",
            phone:"",
            fax:"",
            logoURL:""
        }


        this.orgDataPath = null;
        this.orgStoragePath = null;
        if(orgID){
            this.orgDataPath = `${ORGANIZATION_DATAPATH}/${orgID}`
            this.orgStoragePath = `${ORGANIZATION_DATAPATH}/${orgID}`
        }

        this.administratorUIDs = []
        this.memberUIDs = []
        this.requests = []

        this.hasLoaded = false;
    }

    //make user an administrator of this organization
    addAdministrator(userUID=null){
        if(userUID && this.org.uid){
            /* update organanization records to indicate new administrator */
            firebase.database().ref(`${this.orgDataPath}/administrators/${userUID}`).set(true)

            /* make sure this user is in the members list for this organization. they should be already- just precaution */
            firebase.database().ref(`${this.orgDataPath}/members/${userUID}`).set(true)

            /* remove user from pending list. again, another precaution */
            firebase.database().ref(`${this.orgDataPath}/requests/${userUID}`).remove();

            /* update the organization roles within this user's profile */
            const userRole = {
               isOwner:false,
               isMember: true,
               isAdministator: true,
               isPending: false,
               name: this.org.name,
               logoURL: this.org.logoURL
            }
            const ownerProfile = new UserProfile(userUID);
            const userOrgRef = ownerProfile.getOrgRef(this.org.uid);
            userOrgRef.update(userRole);
        }else{
            //TODO throw an error message
        }
    }

    removeAdministrator(userUID=null){
        if(userUID && this.org.uid){

            if(userUID != this.ownerUID){
                /* remove this user from the organization's administrator list*/
                firebase.database().ref(`${this.orgDataPath}/administrators/${userUID}`).remove();
                /* update the organization roles within this user's profile */
                const userRole = {
                    isAdministator: false
                }
                const ownerProfile = new UserProfile(userUID);
                const userOrgRef = ownerProfile.getOrgRef(this.org.uid);
                userOrgRef.update(userRole);
            }else{
            // TODO - error, can't remove owner from administrator role
            }



        }
    }

    //make user a member of this organization
    addMember(userUID=null){
        if(userUID && this.org.uid){
            /* add this user to the member list for this organization*/
            firebase.database().ref(`${this.orgDataPath}/members/${userUID}`).set(true)
            /* update the organization roles within this user's profile */
            const userRole = {
                isMember: true,
                isPending:false,
                name: this.org.name,
                logoURL: this.org.logoURL
            }
            const ownerProfile = new UserProfile(userUID);
            const userOrgRef = ownerProfile.getOrgRef(this.org.uid);
            userOrgRef.update(userRole);
        }
    }

    removeMember(userUID=null){
        if(userUID && this.org.uid){
            if(userUID != this.org.ownerUID){
                /* remove this user from the organization's administrator list if exist*/
                firebase.database().ref(`${this.orgDataPath}/administrators/${userUID}`).remove();

                /* remove this user from the organization's members list*/
                firebase.database().ref(`${this.orgDataPath}/members/${userUID}`).remove();

                /* remove the organization from the user profile*/
                const ownerProfile = new UserProfile(userUID);
                const userOrgRef = ownerProfile.getOrgRef(this.org.uid);
                userOrgRef.remove();

            }else{
             //TODO can't remove owner of organization from member list
            }

        }

    }

    denyMemberRequest(userUID=null){
        if(userUID && this.org.uid){
            /* remove this user from the organization's request list*/
            firebase.database().ref(`${this.orgDataPath}/requests/${userUID}`).set(false);

            /* remove the organization from the user profile*/
            const ownerProfile = new UserProfile(userUID);
            const userOrgRef = ownerProfile.getOrgRef(this.org.uid);
            userOrgRef.remove();

        }

    }

    setOwner(userUID=null){
       if(userUID != null && this.org.uid){
           /* update organization records to indicate new owner */
           firebase.database().ref(`${this.orgDataPath}/ownerUID`).set(userUID)

           /* update organization records to indicate new administrator */
           firebase.database().ref(`${this.orgDataPath}/administrators/${userUID}`).set("true")

           /* make sure this user is in the members list for this organization. they should be already- just precaution */
           firebase.database().ref(`${this.orgDataPath}/members/${userUID}`).set("true")

           /* remove user from pending list. again, another precaution */
           firebase.database().ref(`${this.orgDataPath}/requests/${userUID}`).remove();

           /* update the organization roles within this user's profile */
           const userRole = {
               isOwner:true,
               isMember: true,
               isAdministator: true,
               isPending: false,
               name: this.org.name,
               logoURL: this.org.logoURL
           }
           const ownerProfile = new UserProfile(userUID);
           const userOrgRef = ownerProfile.getOrgRef(this.org. uid);
           userOrgRef.update(userRole);
       }else{
           //TODO throw an error message
       }
    }


    requestMemembership(userUID=null){
        if(userUID && this.org.uid){
            /* add the user to the organization's requests list */
            firebase.database().ref(`${this.orgDataPath}/requests/${userUID}`).set("true")

            /* update the user's profile to reflect the organizaition request */
            const userRole = {
                isMember: false,
                isPending:true,
                isAdministator:false,
                isOwner:false,
                name: this.org.name,
                logoURL: this.org.logoURL
            }
            const ownerProfile = new UserProfile(userUID);
            const userOrgRef = ownerProfile.getOrgRef(this.uid);
            userOrgRef.update(userRole);

        }
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


    }

    updateOrganizationInfo(orgData){
        firebase.database().ref(`{this.orgDataPath}`).update(orgData);
    }

    downloadOrganizationInfo(){
        firebase.database().ref(this.profileDataPath).on('value', function(snapshot) {
            this.org = {
                name: snapshot.val().name ? snapshot.val().name : "",
                physicalAddress:{
                   street1: snapshot.val().physicalAddress.street1 ? snapshot.val().physicalAddress.street1 : "",
                   street2: snapshot.val().physicalAddress.street2 ? snapshot.val().physicalAddress.street2 : "",
                   city: snapshot.val().physicalAddress.city ? snapshot.val().physicalAddress.city : "",
                   state: snapshot.val().physicalAddress.state ? snapshot.val().physicalAddress.state : "",
                   zip: snapshot.val().physicalAddress.zip ? snapshot.val().physicalAddress.zip : "",
                   country: snapshot.val().physicalAddress.country ? snapshot.val().physicalAddress.country : ""
                },
                mailingAddress:{
                   street1: snapshot.val().mailingAddress.street1 ? snapshot.val().mailingAddress.street1 : "" ,
                   street2: snapshot.val().mailingAddress.street2 ? snapshot.val().mailingAddress.street2  : "",
                   city: snapshot.val().mailingAddress.city ? snapshot.val().mailingAddress.city : "",
                   state: snapshot.val().mailingAddress.state ? snapshot.val().mailingAddress.state : "",
                   zip: snapshot.val().mailingAddress.zip ? snapshot.val().mailingAddress.zip  : "",
                   country: snapshot.val().mailingAddress.country ? snapshot.val().mailingAddress.country : "",
                },
                ownerUID: snapshot.val().ownerUID ? snapshot.val().ownerUID : "",
                description: snapshot.val().description ? snapshot.val().description : "" ,
                phone: snapshot.val().phone ? snapshot.val().phone : "" ,
                fax: snapshot.val().fax ? snapshot.val().fax : "" ,
                logoURL: snapshot.val().logoURL ? snapshot.val().logoURL : ""
            }
            this.administrators = snapshop.val().administrators ? snapshop.val().administrators : [] ;
            this.members = snapshot.val().members ? snapshot.val().members : [];
            this.requests = snapshot.val().requests ? snapshot.val().requests : [];
            this.hasLoaded = true;
        }.bind(this));

    }


    /*takes the id for the org and set this object to that data */
    lookupOrgByID(id){

    }
}