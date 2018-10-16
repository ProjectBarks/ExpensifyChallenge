//Perform
checkAuthToken();


$("#userlogin").submit(function(event){

    event.preventDefault();

    var partName        = $("#partnerName").val(),
        partPassword    = $("#partnerPassword").val(),
        partUserID      = $("#partnerUserID").val(),
        partUserSecret  = $("#partnerUserSecret").val();

    var form = $(this),
        url = form.attr("action");

    var postRequest = loginToExpensify(partName,partPassword,partUserID,partUserSecret);

    postRequest.done(function(data){
        alert(data);
    })



});


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
function loginToExpensify(partName, partPassword, partUserID, partUserSecret){

    var data = {
         partnerName:        partName,
         partnerPassword:    partPassword,
         partnerUserID:      partUserID,
         partnerUserSecret:  partUserSecret,
     };

    console.log("User Is Attempting to Log in");

     $.ajax({
         type: "POST",
         url: "./proxy.php",

         headers:{"name":"tim"},
         data: data,
         dataType: 'json',
         success: function(success){

             success = JSON.parse(success);

             if(simpleVerifyLogin(success)){
                  console.log("Successful Request");
             } else {
                  console.log("There was an error in the request");
                  return;
             }

             if(success.authToken) {
                 setCookie("authToken", success.authToken);
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