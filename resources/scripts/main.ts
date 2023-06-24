window.onload = () => {
  const form: HTMLElement | null = document.getElementById("emailForm");
  if (!form) {
    console.error("Could not find element with ID 'emailForm'");
    return;
  }

  if (!(form instanceof HTMLFormElement)) {
    console.error("Element with ID 'emailForm' is not a form element");
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleFormSubmit(form);
  });
};

function handleFormSubmit(form: HTMLFormElement) {
  const emailInput: any = form.elements.namedItem("email");

  if (!emailInput) {
    console.error("Could not find input element with name 'email' in form");
    return;
  }

  if (!(emailInput instanceof HTMLInputElement)) {
    console.error("Element with name 'email' in form is not an input element");
    return;
  }

  const email = emailInput.value;
  if (!email) {
    console.error("Email input is empty");
    return;
  }

  console.log(`Email submitted: ${email}`);
  // Send email code to backend here
}
