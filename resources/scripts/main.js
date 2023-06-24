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

window.onload = () => {
  console.log("Page loaded.");
  // Get email form
  const emailForm = document.querySelector(".email-form");

  // Check if email form exists
  if (!emailForm) {
    return console.error("Form with class 'email-form' not found.");
  }

  // Get email input field
  const emailInput = emailForm.querySelector(".email-input");

  // Check if email input field exists
  if (!emailInput) {
    return console.error("Input with class 'email-input' not found.");
  }

  // Get submit button
  const submitButton = emailForm.querySelector(".submit-button");

  // Check if submit button exists
  if (!submitButton) {
    return console.error("Button with class 'submit-button' not found.");
  }

  console.log("Email form found.");

  // Add event listener for submit button
  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleEmailFormSubmit(emailInput);
  });

  // Add event listener for email input field for enter key
  emailInput.addEventListener("keypress", (event) => {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
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

  // Initially disable the button
  submitButton.disabled = emailInput.value.trim() === "" ? true : false;
};

/**
 * Handles the email form submit event
 * @returns void
 */
function handleEmailFormSubmit(emailInput) {
  // Validate email
  const email = emailInput.value.trim();
  if (!email) {
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return console.error("Invalid email entered."); //TODO: Display error message to user
  }

  emailInput.value = "";
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
    const docRef = await addDoc(collection(db, "emails"), {
      email: email,
    });

    if (!docRef) {
      console.error("Document reference is undefined");
      return;
    }

    console.log("Added email to database: ", email);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
