import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkhSb61yqK8Q2BaVUAV5ShYsThvrt_cvc", // This is a public key
  authDomain: "puff--n-quit-presale-site.firebaseapp.com",
  projectId: "puff--n-quit-presale-site",
  storageBucket: "puff--n-quit-presale-site.appspot.com",
  messagingSenderId: "1045456087759",
  appId: "1:1045456087759:web:a2c7e85004e7bf5a4025ba",
  measurementId: "G-9RGR65MTVS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let emailFormElement = null;
let submittedMessageElement = null;
let emailInput = null;
let submitButton = null;

let submissionLock = true; // Used to prevent multiple submissions from spamming the submit button or the enter key

window.onload = () => {
  // Get email form and submitted message elements
  emailFormElement = document.querySelector(".email-form");
  submittedMessageElement = document.querySelector(".submitted-message");

  // Check if email form exists
  if (!emailFormElement) {
    return console.error("Form with class 'email-form' not found.");
  }

  // Check if submitted message exists
  if (!submittedMessageElement) {
    return console.error("Element with class 'submitted-message' not found.");
  }

  // Get email input field
  emailInput = emailFormElement.querySelector(".email-input");

  // Check if email input field exists
  if (!emailInput) {
    return console.error("Input with class 'email-input' not found.");
  }

  // Get submit button
  submitButton = emailFormElement.querySelector(".submit-button");

  // Check if submit button exists
  if (!submitButton) {
    return console.error("Button with class 'submit-button' not found.");
  }

  // Add event listener for submit button
  submitButton.addEventListener("click", (event) => {
    if (submissionLock) return;
    lockSubmission();
    event.preventDefault();
    handleEmailFormSubmit(emailInput);
  });

  // Add event listener for email input field for enter key
  emailInput.addEventListener("keypress", (event) => {
    if (submissionLock) return;
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      lockSubmission();
      event.preventDefault();
      handleEmailFormSubmit(emailInput);
    }
  });

  // Add event listener for email input field for input
  emailInput.addEventListener("input", (event) => {
    if (emailInput.value.trim() === "") {
      submitButton.disabled = true;
    } else {
      submitButton.disabled = false;
    }
  });

  // Unlock submission
  unlockSubmission();
};

/**
 * Handles the email form submit event
 * @returns void
 */
function handleEmailFormSubmit(emailInput) {
  // Validate email
  const email = emailInput.value.trim();
  if (!email) {
    unlockSubmission();
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    unlockSubmission();
    return console.error("Invalid email entered."); //TODO: Display error message to user
  }

  // Disable email form and add email to database
  disableEmailForm();
  console.log("Collected email:", email);
  addEmailToDatabase(email);
}

/**
 * Adds an email to the database
 * @param email The email to add
 * @returns void
 */
async function addEmailToDatabase(email) {
  try {
    // Add a new document with a generated id
    const docRef = await addDoc(collection(db, "emails"), {
      email: email,
    });

    // Check if document reference is undefined
    if (!docRef) {
      console.error("Document reference is undefined");
      alert("Error adding email to database. Please try again later.");
      enableEmailForm();
      unlockSubmission();
      return;
    }

    // Log success message
    console.log("Added email to database: ", email);
    showSubmissionSuccessMessage();
  } catch (error) {
    // Log error message
    console.error("Error adding document: ", error);
    alert("Error adding email to database. Please try again later.");

    // Re-enable email form and unlock submission
    enableEmailForm();
    unlockSubmission();
  }
}

/**
 * Shows the submission success message
 * @returns void
 */
function showSubmissionSuccessMessage() {
  emailFormElement.style.display = "none";
  emailInput.value = "";
  submittedMessageElement.style.display = "block";
}

/**
 * Disables the email form
 * @returns void
 */
function disableEmailForm() {
  emailInput.disabled = true;
}

/**
 * Enables the email form
 * @returns void
 */
function enableEmailForm() {
  emailInput.disabled = false;
}

/**
 * Locks the submission
 * @returns void
 */
function lockSubmission() {
  submissionLock = true;
}

/**
 * Unlocks the submission
 * @returns void
 */
function unlockSubmission() {
  submissionLock = false;
}
