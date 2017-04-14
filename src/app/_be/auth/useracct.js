import * as firebase from 'firebase'

export class UserProfile {

    constructor(uid=""){
        this.uid = uid;
        this.firstname = "";
        this.lastname = "";
        this.email = "";
        this.phone = "";
        this.phone_type = "";
        this.street1 = "";
        this.street2 = "";
        this.city = "";
        this.state = "";
        this.zip = "";
        this.country = "";
        this.address_type = "";
        this.photoDownloadURL = "";
        this.profileDataPath = `users/${this.uid}`;
        this.profileStoragePath = `users/${this.uid}/`
        if(uid != ""){
            this.downloadProfile();
        }
    }
    /* Create a user profile in our database for a user who has used an email and password to sign up */
    createProfileViaEmail(firstname, lastname, email, uid){
        this.uid = uid;
        this.profileDataPath = `users/${this.uid}`;
        this.profileStoragePath = `users/${this.uid}/`
        this.setName(firstname,lastname);
        this.setEmail(email);
        this.setPhone();
        this.setAddress();
        this.setProfileImg();
        this.setPhotoURL();
        this.downloadProfile();

    };

    /* Create a user profile in our database for a user who has used Facebook or Google to sign up */
    createProfileViaProvider(user){
        this.uid = user.uid;
        this.profileDataPath = `users/${this.uid}`;
        this.profileStoragePath = `users/${this.uid}/`
        var displayName = user.displayName;
        var name = displayName.split(" ");
        this.setName(name[0],name[name.length-1]); //take the first and last name only
        this.setEmail(user.email);
        this.setPhone();
        this.setAddress();
        this.setPhotoURL(user.photoURL);
        this.downloadProfile();

    }


    setName(firstname="", lastname=""){
        firebase.database().ref(this.profileDataPath).update({
            firstname: firstname,
            lastname: lastname
        });
    }

    setPhone(number="",type=""){
        firebase.database().ref(this.profileDataPath).update({
            phone: number,
            phone_type: type
        });
    }

    setAddress(street1="",street2="",city="",state="",zip="",country="",type=""){
        firebase.database().ref(this.profileDataPath).update({
            street1: street1,
            street2: street2,
            city: city,
            state: state,
            zip: zip,
            country: country,
            type: type
        });
    }

    setEmail(email=""){
        firebase.database().ref(this.profileDataPath).update({
            email: email
        });
    }

    setProfileImg(file=null){
        var imgStorageRef = firebase.storage().ref();
        var profilePhoto = imgStorageRef.child(`${this.profileStoragePath}\profileimg`);
        if(file != null){
            profilePhoto.put(file).then(function(snapshot){
                this.setPhotoURL(snapshot.downloadURL);
            }.bind(this));
        }

    }

    setPhotoURL(URL="assets/img/avatars/user.png"){
        firebase.database().ref(this.profileDataPath).update({
            photoURL: URL
        });
    }

    downloadProfile(){
        firebase.database().ref(this.profileDataPath).on('value', function(snapshot) {
            this.firstname = snapshot.val().firstname;
            this.lastname = snapshot.val().lastname;
            this.email = snapshot.val().email;
            this.phone = snapshot.val().phone;
            this.phone_type = snapshot.val().phone_type;
            this.street1 = snapshot.val().street1;
            this.street2 = snapshot.val().street2;
            this.city = snapshot.val().city;
            this.state = snapshot.val().state;
            this.zip = snapshot.val().zip;
            this.country = snapshot.val().country;
            this.address_type = snapshot.val().address_type;
            this.photoDownloadURL = snapshot.val().photoURL;
        }.bind(this));

    }


    /* Getters to access user data. */

    getUserProfile(){
        var profileData = {
            uid: this.uid,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            phone: {
                number: this.phone,
                type: this.phone_type
            },
            address: {
                street1: this.street1,
                street2: this.street2,
                city: this.city,
                state: this.state,
                zip: this.zip,
                country: this.country,
                type: this.address_type
            },
            photoURL: this.photoDownloadURL

        };
        return profileData;
    }

    getUID(){
        return this.uid;
    }

    getFirstName(){
        return this.firstname;
    }

    getLastName(){
        return this.lastname;
    }

    getEmail(){
        return this.email;
    }

    getPhone(){
        var phone = {
            number: this.phone,
            type: this.phone_type
        };

        return phone;
    }

    getAddress(){
        var address = {
            street1: this.street1,
            street2: this.street2,
            city: this.city,
            state: this.state,
            zip: this.zip,
            country: this.country,
            type: this.address_type
        };

        return address;
    }

    getProfileURL(){
        return this.profileDownloadURL;
    }

}

