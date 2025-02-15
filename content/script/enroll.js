
const databasename = "users";
const databaseusers = 51;
// Firebase Configuration
const firebaseConfig = 
{
apiKey: "AIzaSyBrBLIYoqy09phhRa1RbViQO8BlaLMblRo",
authDomain: "pro121-bcffe.firebaseapp.com",
projectId: "pro121-bcffe",
storageBucket: "pro121-bcffe.firebasestorage.app",
messagingSenderId: "507255926995",
appId: "1:507255926995:web:ca1794ed489bac38ab2426" 
};

// Initialize Firebase (Using Compatibility Mode)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

/*********************************************************************************/
// Function to count registered users
async function getUserCount() {
  const snapshot = await db.collection(databasename).get();
  return snapshot.size; // Returns the number of users
}

// Sign Up function with user limit
async function signUp() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
      const userCount = await getUserCount(); // Check the number of users

      if (userCount >= databaseusers) {
          alert("عذرًا، الحد الأقصى لعدد المستخدمين قد تم بلوغه.");
          return;
      }

      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName: name });

      // Save user info in Firestore
      await db.collection(databasename).doc(userCredential.user.uid).set({
          name: name,
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      window.location.href = "content/cont1.html"; // Redirect to home page
  } catch (error) {
      alert("خطأ: " + error.message);
  }
}
/*************************************************************************************************/
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        console.log("Persistence enabled: User stays logged in after closing the browser.");
    })
    .catch(error => {
        console.error("Persistence error: ", error);
    });
// Login function
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = "content/cont1.html"; // Redirect to home page
        })
        .catch(error => {
            alert('خطأ: ' + error.message);
        });
}

// Google Sign-In
function googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => {
            window.location.href = "content/cont1.html"; // Redirect to home page
        })
        .catch(error => {
            alert('خطأ: ' + error.message);
        });
}
/*************************************************************************************************/

