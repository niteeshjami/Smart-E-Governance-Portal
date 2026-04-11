// form-submit.js - handles form submission to Firebase

function toBase64(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function() { resolve(reader.result); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function submitToFirebase(serviceData) {
  var btn = document.getElementById("submitBtn");
  var msg = document.getElementById("msg");
  btn.disabled = true;
  btn.textContent = "Submitting...";
  msg.style.color = "blue";
  msg.textContent = "Please wait...";

  var appID = "GOV" + Math.floor(Math.random() * 900000 + 100000);

  var fileInput = document.getElementById("userFile");
  var fileData = "";
  if (fileInput && fileInput.files.length > 0) {
    fileData = await toBase64(fileInput.files[0]);
  }

  var application = Object.assign({}, serviceData, {
    id: appID,
    status: "Pending",
    reason: "",
    certificate: "",
    userFile: fileData,
    submittedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  try {
    await db.collection("applications").doc(appID).set(application);
    msg.style.color = "green";
    msg.textContent = "Application submitted! ID: " + appID;
    alert("Application Submitted!\nYour Application ID: " + appID + "\n\nPlease save this ID to track your application.");
    window.location.href = "track.html";
  } catch (e) {
    msg.style.color = "red";
    msg.textContent = "Error: " + e.message;
    btn.disabled = false;
    btn.textContent = "Submit Application";
  }
}
