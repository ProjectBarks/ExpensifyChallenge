checkAuthToken();


function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";" + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkAuthToken() {
    var authToken = getCookie("authToken");
    if (authToken != "") {
        alert("user is logged in");
    } else {
        alert("user is not logged in");
    }
}

/**
 * Function loginToExpensify
 * Goal:    to allow the user to log in to the Expensify API.
 * Required:    partnerName
 *              partnerPassword
 *              partnerUserID
 *              partnerUserSecret
 *  POST via https://www.expensify.com/api?command=Authenticate
 */
function loginToExpensify(){

    var data = {
         partnerName:        "applicant",
         partnerPassword:    "d7c3119c6cdab02d68d9",
         partnerUserID:      "expensifytest@mailinator.com",
         partnerUserSecret:  "hire_me",
     };

    console.log("User Is Attempting to Log in");

     $.ajax({
         type: "POST",
         url: "./proxy.php",
         //headers:{authenticate: true},
         headers:{"name":"tim"},
         data: data,
         dataType: 'json',
         success: function(success){

             success = JSON.parse(success);
             console.log(success);
             if(success.authToken)
                 setCookie("authToken",success.authToken);

             if(simpleVerifyLogin(success)){
                  console.log("Successful Request");
             } else {
                  console.log("There was an error in the request");
                  return;
             }
         },
         error: function(error){
             console.log(error);
         }
     });
}
 function simpleVerifyLogin(success){
     return  success.accountID   !== null &&
             success.authToken   !== null &&
             success.email       !== null &&
             success.httpCode    === 200  &&
             success.jsonCode    === 200  &&
             success.requestID   !== null;
 }

loginToExpensify();