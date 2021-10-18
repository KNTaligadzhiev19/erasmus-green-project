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
 * @function getInputRegister
 */
function getInput() {
  let am = new AccountManager(localStorage);

  //Get input from user
  let fname = am.escapeHtml(document.getElementById("fname").value);
  let lname = am.escapeHtml(document.getElementById("lname").value);
  let email = am.escapeHtml(document.getElementById("email").value);
  let pass = am.escapeHtml(document.getElementById("pass").value);
  let volunteer = document.getElementById("volunteer").checked;

  let output = am.registerUser(fname, lname, email, pass, Number(volunteer), "Burgas");

  switch (output) {
    case 0:
      window.location.href = "../pages/login.html";
      break;
    case 1:
      document.getElementById("error").innerHTML = "The first name must start with a capital letter!";
      break;
    case 2:
      document.getElementById("error").innerHTML = "The last name must start with a capital letter!";
      break;
    case 3:
      document.getElementById("error").innerHTML = "Password must be at least 8 characters long!";
      break;
    case 4:
      document.getElementById("error").innerHTML = "There is already a registered user with such an e-mail!";
      break;
    case 5:
      document.getElementById("error").innerHTML = "The entered e-mail is invalid!";
      break;
    default:
      console.log("A wild error appeared");
      break;
  }
}
