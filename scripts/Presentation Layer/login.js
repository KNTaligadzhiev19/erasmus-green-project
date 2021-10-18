window.onload = () => {
    let am = new AccountManager(localStorage);
    let isTrue = (am.checkForEnterUser() == 'true');

    if (isTrue) {
        window.location.href = "../pages/account.html";
    }
}

/**
 * Function that gets the input 
 * and send it to the backend.
 * @function getInputLogin
 */
function getInput() {
    let am = new AccountManager(localStorage);
    
    let email = am.escapeHtml(document.getElementById("email").value);
    let pass = am.escapeHtml(document.getElementById("pass").value);

    if (am.login(email, pass)) {
        window.location.href = "../pages/account.html";
    } else {
        document.getElementById("error").innerHTML = "No user was found with such an email or the password did not match!";
    }
}
