import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getFirestore,
  Timestamp,
} from "firebase/firestore";

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
  // Get referral code
  const referralCode = getReferralCode();
  if (referralCode) {
    addReferralCodeToDatabase(referralCode);
  }

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

  // Hide submitted message
  submittedMessageElement.style.display = "none";

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
 * Adds the referral code to the database
 * @param {string} referralCode The referral code to add to the database
 * @returns
 */
async function addReferralCodeToDatabase(referralCode) {
  try {
    // Add a new document with a generated id
    const docRef = await addDoc(collection(db, "referrals"), {
      referral: referralCode,
      timestamp: Timestamp.now(),
    });

    // Check if document reference is undefined
    if (!docRef) {
      console.error("Document reference is undefined");
      alert("Error adding referral to database. Please try again later.");
      return;
    }
  } catch (error) {
    // Log error message
    console.error("Error adding document: ", error);
  }
}

/**
 * Gets the referral code from the URL
 */
function getReferralCode() {
  const urlParams = getURLSearchParams();
  const referralCode = urlParams.get("referral");
  return referralCode;
}

/**
 * Gets the URL search parameters
 */
function getURLSearchParams() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams;
}

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
  addEmailToWaitlistDatabase(email);
}

/**
 * Adds an email to the waitlist database
 * @param {string} email The email to add
 * @returns void
 */
async function addEmailToWaitlistDatabase(email) {
  try {
    // Add a new document with a generated id
    const docRef = await addDoc(collection(db, "waitlist"), {
      email: email,
      timestamp: Timestamp.now(),
    });

    // Check if document reference is undefined
    if (!docRef) {
      console.error("Document reference is undefined");
      alert("Error adding email to database. Please try again later.");
      enableEmailForm();
      unlockSubmission();
      return;
    }
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
 * Shows the submission success message and hides the email form
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
