// Check if the user is still logged in
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

/*************************************************************************************************/

// Initialize Firebase if not already initialized.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Function to redirect to the home page.

// Function to load essay results from the "essayResults" collection and display them in a table.
function loadEssayResults() {
  const essayResultsContainer = document.getElementById("essayResultsTable");
  
  db.collection("usersid").orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        essayResultsContainer.innerHTML = "<p class='text-center'>لا توجد نتائج للمقال لعرضها.</p>";
        return;
      }
      
      // Build the HTML table header with "العدد" and "حذف" (Delete) column.
      let tableHTML = `
        <table class="table table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>العدد</th>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>اسم المستخدم</th>
              <th>التاريخ والوقت</th>
              <th>إجراء</th>  <!-- Action column for delete button -->
            </tr>
          </thead>
          <tbody>
      `;

      let index = 1;  // Start index from 1

      snapshot.forEach(doc => {
        const data = doc.data();
        const docId = doc.id;  // Get document ID for deletion
        const createdAt = data.createdAt 
          ? data.createdAt.toDate().toLocaleString("ar-EG") 
          : "غير متاح";

        tableHTML += `
          <tr id="row-${docId}">
            <td>${index}</td>  
            <td>${data.name || "غير متوفر"}</td>
            <td>${data.email || "غير متوفر"}</td>
            <td>${data.user || "غير متوفر"}</td>
            <td>${createdAt}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="deleteUser('${docId}')">حذف</button>
            </td>
          </tr>
        `;

        index++;  // Increment the index for each student
      });

      tableHTML += "</tbody></table>";
      essayResultsContainer.innerHTML = tableHTML;
    })
    .catch(error => {
      essayResultsContainer.innerHTML = `<p class="text-danger text-center">حدث خطأ أثناء تحميل نتائج المقال: ${error.message}</p>`;
    });
}

// Function to delete a user file from Firestore
function deleteUser(docId) {
  if (confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟")) {
    db.collection("usersid").doc(docId)
      .delete()
      .then(() => {
        alert("تم حذف المستخدم بنجاح!");
        document.getElementById(`row-${docId}`).remove();  // Remove row from the table
      })
      .catch(error => {
        alert("حدث خطأ أثناء الحذف: " + error.message);
      });
  }
}

// Load essay results when the page loads.
window.onload = loadEssayResults;
