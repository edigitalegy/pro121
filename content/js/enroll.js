import { db, auth } from "./firebase.js";

const databasename = "usersid";
const pageload = "./content/cont1.html";
const databaseusers = 51;
/*************************************************************************************************/
// Ensure Firebase is initialized before using `auth`
if (firebase.auth()) {
    // Set persistent authentication
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            console.log("Persistence enabled: User stays logged in after closing the browser.");
        })
        .catch(error => {
            console.error("Persistence error: ", error);
            alert("Authentication persistence could not be set. Please check your connection.");
        });

    // Check authentication state (runs on page load)
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("User is authenticated:", user.uid);
            window.location.href = pageload; // Redirect to home page
        } else {
            console.log("No user authenticated.");
            document.getElementById('auth-container').classList.remove('d-none');
            document.getElementById('user-info-container').classList.add('d-none');
        }
    });
} else {
    console.error("Firebase authentication is not initialized.");
}
/*************************************************************************************************/
// Function to validate email format using regex
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Function to validate password strength
/*
function isValidPassword(password) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
}
*/

// Function to check if an email is already registered in Firestore
async function isEmailRegistered(email) {
    const snapshot = await db.collection(databasename).where("email", "==", email).get();
    return !snapshot.empty; // Returns true if the email is already in use
}

// Function to check if a username is already taken
async function isUsernameTaken(username) {
    const snapshot = await db.collection(databasename).where("user", "==", username).get();
    return !snapshot.empty; // Returns true if the username is already taken
}

// Function to count registered users
async function getUserCount() {
    const snapshot = await db.collection(databasename).get();
    return snapshot.size; // Returns the number of users
}
/*************************************************************************************************/
// Sign up function
document.getElementById("create-btn").addEventListener("click", signUp);
async function signUp() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const user = document.getElementById("user").value; // Username field

    // Check if all fields are filled
    if (!name || !email || !password || !user) {
        alert("خطأ: يرجى ملء جميع الحقول.");
        return;
    }

    // Validate email
    if (!isValidEmail(email)) {
        alert("خطأ: يرجى إدخال بريد إلكتروني صالح.");
        return;
    }

    const emailExists = await isEmailRegistered(email);
    if (emailExists) {
        alert("خطأ: هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد إلكتروني آخر.");
        return;
    }

    // Check if the username is already taken
    const usernameExists = await isUsernameTaken(user);
    if (usernameExists) {
        alert("خطأ: اسم المستخدم مأخوذ بالفعل.");
        return;
    }

    try {
        const userCount = await getUserCount(); // Check the number of users
        if (userCount >= databaseusers) {
            alert("عذرًا، الحد الأقصى لعدد المستخدمين قد تم بلوغه.");
            return;
        }

        // Save user info in Firestore first
        const tempUserRef = db.collection(databasename).doc(); // Temporary Firestore document
        await tempUserRef.set({
            name: name,
            email: email,
            user: user,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Create user in Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid; // Get user ID

        // Update user profile with display name
        await userCredential.user.updateProfile({ displayName: name });

        // Move Firestore data to user-specific document
        const userRef = db.collection(databasename).doc(uid);
        await userRef.set({
            uid: uid,
            name: name,
            email: email,
            user: user,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Verify the document was saved successfully
        const doc = await userRef.get();
        if (doc.exists) {
            console.log("User registered and data saved in Firestore:", uid);

            // Delay before redirecting
            setTimeout(() => {
                window.location.href = pageload;
            }, 1000); // Delay of 2 seconds
        } else {
            throw new Error("Failed to save user data in Firestore.");
        }

    } catch (error) {
        alert("خطأ: " + error.message);
    }
}

/*************************************************************************************************/
// Login function using username and password
async function login() {
    const username = document.getElementById('user').value; // Get username input
    const password = document.getElementById('password').value;

    // Check if any input field is empty
    if (!username || !password) {
        alert("خطأ: يرجى ملء جميع الحقول.");
        return;
    }

    try {
        // Query Firestore to find the user document with the given username
        const userSnapshot = await db.collection(databasename).where("user", "==", username).get();

        if (userSnapshot.empty) {
            alert("خطأ: اسم المستخدم غير موجود.");
            return;
        }

        // Extract email from Firestore result
        const userData = userSnapshot.docs[0].data();
        const email = userData.email;

        // Validate email before signing in
        if (!isValidEmail(email)) {
            alert("خطأ: البريد الإلكتروني غير صالح.");
            return;
        }

        // Authenticate with email and password
        await auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = pageload; // Redirect to home page
            /*
            document.getElementById('auth-container').classList.add('d-none');
            document.getElementById('user-info-container').classList.remove('d-none');
            */
        })
        .catch(error => alert(error.message));

    }
     catch (error) {
        alert("خطأ: " + error.message);
    }
}
/*****************************************************************************************************************/
// Google Sign-In function
function googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            return db.collection(databasename).doc(user.uid).set({
                name: user.displayName,
                email: user.email
            }, { merge: true });
        })
        .then(() => {
            window.location.href = pageload; // Redirect to home page
            /*
            document.getElementById('auth-container').classList.add('d-none');
            document.getElementById('user-info-container').classList.remove('d-none');
            document.getElementById('welcome-message').innerText = `مرحبًا، ${auth.currentUser.displayName}`;
            */
        })
        .catch(error => alert(error.message));
}
/*******************************************************************************************/
document.getElementById("enter-btn").addEventListener("click", login);
document.getElementById("google-btn").addEventListener("click", googleSignIn);
document.getElementById("out-btn").addEventListener("click", logout);

// Logout function
function logout() {
    auth.signOut().then(() => {
        console.log("good");
        /*
        document.getElementById('auth-container').classList.remove('d-none');
        document.getElementById('user-info-container').classList.add('d-none');
        */
    });
}

