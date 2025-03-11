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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Create a reference to Firestore
const db = firebase.firestore();

// Function to redirect to the home page
function goHome() {
  window.location.href = "../cont1.html"; // Adjust this path if needed
}

// Function to load and display all documents from the "quizResults" collection
function loadData() {
  const dataTable = document.getElementById("data-table");

  db.collection("readprettest").orderBy("timestamp", "desc")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        dataTable.innerHTML = "<p class='text-center'>لا توجد بيانات لعرضها.</p>";
        return;
      }

      // Build the HTML table with an additional column for reviewData details.
      let table = `
        <table class="table table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>النتيجة</th>
              <th>الإجمالي</th>
              <th>التاريخ والوقت</th>
              <th>التفاصيل</th>
            </tr>
          </thead>
          <tbody>
      `;

      snapshot.forEach(doc => {
        const data = doc.data();
        const timestamp = data.timestamp ? data.timestamp.toDate().toLocaleString("ar-EG") : "غير متاح";
        table += `
          <tr>
            <td>${data.name || "غير متوفر"}</td>
            <td>${data.email || "غير متوفر"}</td>
            <td>${data.score}</td>
            <td>${data.total}</td>
            <td>${timestamp}</td>
            <td>
              <button class="btn btn-info btn-sm" onclick="showReviewData('${doc.id}')">عرض التفاصيل</button>
            </td>
          </tr>
        `;
      });

      table += "</tbody></table>";
      dataTable.innerHTML = table;
    })
    .catch(error => {
      dataTable.innerHTML = `<p class="text-danger text-center">حدث خطأ أثناء تحميل البيانات: ${error.message}</p>`;
    });
}

// Function to show reviewData for a specific quizResults document in a modal
function showReviewData(docId) {
  db.collection("readpretest").doc(docId).get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        const reviewData = data.responses;
        let content = "<div>";
        if (reviewData && reviewData.length > 0) {
          reviewData.forEach((item, index) => {
            content += `<div class="mb-3">
                          <h6>س${index + 1}: ${item.question}</h6>
                          <p>الإجابة الصحيحة: <strong>${item.correctAnswer}</strong></p>
                          <p>إجابتك: <strong>${item.userAnswer}</strong></p>
                        </div>`;
          });
        } else {
          content += "<p>لا توجد تفاصيل متوفرة.</p>";
        }
        content += "</div>";
        
        // Inject the content into the modal body
        document.getElementById("reviewModalBody").innerHTML = content;
        
        // Show the modal using Bootstrap's Modal API
        const reviewModal = new bootstrap.Modal(document.getElementById("reviewModal"));
        reviewModal.show();
      } else {
        alert("لا توجد تفاصيل متوفرة.");
      }
    })
    .catch(error => {
      alert("حدث خطأ: " + error.message);
    });
}

// Load the data when the page loads
window.onload = loadData;




//*************************CSV*********************************/
// Function to export test results as a CSV file and download it.
function exportResults() {
  db.collection("readpretest").orderBy("timestamp", "desc")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        alert("لا توجد بيانات لتصديرها.");
        return;
      }
      
      // Build CSV header
      let csv = "الاسم,النتيجة,الإجمالي,التفاصيل,التاريخ والوقت\n";
      
      // Process each document
      snapshot.forEach(doc => {
        const data = doc.data();
        const name = data.name || "غير متوفر";
        const score = data.score !== undefined ? data.score : "";
        const total = data.total !== undefined ? data.total : "";
        const reviewData = data.reviewData;
        const timestamp = data.timestamp ? data.timestamp.toDate().toLocaleString("ar-EG") : "";
        
        // Process reviewData if available
        let reviewDataStr = "لا توجد تفاصيل";
        if (reviewData && reviewData.length > 0) {
          reviewDataStr = reviewData.map((item, index) => {
            return `س${index + 1}: ${item.question} | الإجابة الصحيحة: ${item.correctAnswer} | إجابتك: ${item.userAnswer} | الملاحظات: ${item.feedback}`;
          }).join(" / ");
        }
        
        // Create CSV row (wrap fields in quotes to handle commas)
        csv += `"${name}","${score}","${total}","${reviewDataStr}","${timestamp}"\n`;
      });
      
      // Prepend a UTF-8 BOM to support Arabic characters in Excel
      const bom = "\uFEFF";
      const csvWithBom = bom + csv;
      
      // Create a Blob from the CSV string with BOM
      const blob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "testResults.csv");
      
      // Append link to the body and trigger click, then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(error => {
      alert("حدث خطأ أثناء تصدير النتائج: " + error.message);
    });
}
