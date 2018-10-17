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

});

$("#transactionForm").submit(function(event){
   event.preventDefault();

   getTransactionList();
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
        console.log("User is logged in");
        addTransactionTable();
        getTransactionList();

    } else {
        console.log("User is not logged in");
        addLoginForm();

    }
}



function addTransactionTable(){
    $("#transactionTable").append(`
     <h1>Transactions:</h1>
    <table>

        <thead>
        <tr>
            <th>Transaction Date</th>
            <th>Merchant</th>
            <th>Amount</th>
        </tr>
        </thead>

        <tbody id="transactionTableBody">
        <!-- Add the transaction rows here -->
        </tbody>

    </table>`
    )
}

function addLoginForm() {
    $("#loginContent").append(
        `<!-- Add your login form here -->
    <form id="userlogin" action="proxy.php" title="Login" method="post">
        <div>
            <label class="title">Partner Name:</label>
            <input type="text" id="partnerName" name="partnerName" >
        </div>
        <div>
            <label class="title">Partner Password:</label>
            <input type="password" id="partnerPassword" name="partnerPassword" >
        </div>
        <div>
            <label class="title">Partner User ID:</label>
            <input type="text" id="partnerUserID" name="partnerUserID" >
        </div>
        <div>
            <label class="title">Partner User Secret:</label>
            <input type="password" id="partnerUserSecret" name="partnerUserSecret" >
        </div>
        <div>
            <input type="submit" id="submitButton" name="submitButton" value="Submit">
        </div>
    </form>`
    );
}

function removeLoginForm(){
    $("#loginContent").remove();
}


//LOGIN FUNCTIONS

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

         return $.ajax({
             type: "POST",
             url: "./proxy.php",
             data: data,
             dataType: 'json',
             success: function(success){
                 success = JSON.parse(success);

                 if(simpleVerifyLogin(success)){
                      console.log("Successful Request");

                     removeLoginForm();

                     addTransactionTable();

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


 //TRANSACTION FUNCTIONS

function getTransactionList(){
        var data = {
            authToken: getCookie("authToken"),
            returnValueList: "transactionList",
        };
        return $.ajax({
            type: "GET",
            url: "./proxy.php",
            data: data,
            dataType: 'json',
            success: function(success){
                console.log(JSON.parse(success).transactionList);
                writeDataToTable(JSON.parse(success).transactionList);
            },
            error: function(error){
                console.log(error)
            }
        });
    }

function writeDataToTable(data){
    console.log("building insert");
    var i,j,temparray,chunk = 100;

    for (i=0,j=data.length; i<j; i+=chunk) {
        temparray = data.slice(i,i+chunk);
        var insert = recursiveWrite(temparray, "");
        console.log("inserting to table");
        $("#transactionTable").append(insert);
    }


}

function recursiveWrite(dataLeft, finalString){
    if(dataLeft.length == 0)
        return finalString;
    var row = dataLeft.shift();
    recursiveWrite(dataLeft, finalString+row);
}

function pullRequiredFields(row){
    return "<tr><td>"+row.created+"</td><td>"+row.merchant+"</td><td>"+row.amount+"</td></tr>";
}
