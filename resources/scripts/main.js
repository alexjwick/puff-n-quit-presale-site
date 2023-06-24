window.onload = function () {
    var form = document.getElementById("emailForm");
    if (!form) {
        console.error("Could not find element with ID 'emailForm'");
        return;
    }
    if (!(form instanceof HTMLFormElement)) {
        console.error("Element with ID 'emailForm' is not a form element");
        return;
    }
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        handleFormSubmit(form);
    });
};
function handleFormSubmit(form) {
    var emailInput = form.elements.namedItem("email");
    if (!emailInput) {
        console.error("Could not find input element with name 'email' in form");
        return;
    }
    if (!(emailInput instanceof HTMLInputElement)) {
        console.error("Element with name 'email' in form is not an input element");
        return;
    }
    var email = emailInput.value;
    if (!email) {
        console.error("Email input is empty");
        return;
    }
    console.log("Email submitted: ".concat(email));
    // Send email code to backend here
}
//# sourceMappingURL=main.js.map