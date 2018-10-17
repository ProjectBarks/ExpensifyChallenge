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

   var  created     = $("#created").val(),
        amount      = $("#amount").val(),
        merchant    = $("#merchant").val();

   createTransaction(created, amount, merchant);
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
        addLoggedInFunctions();

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
          <col width="200">
          <col width="200">
          <col width="200">
        <tr>
            <th class="transactionDate">Transaction Date</th>
            <th class="merchant">Merchant</th>
            <th class="amount">Amount</th>
        </tr>
        </thead>

        <tbody id="transactionTableBody">
        <!-- Add the transaction rows here -->
        </tbody>

    </table>`
    )
    $("#transactionTable").css({"width":"600px", "height":"600px", "overflow-y":"scroll"});
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

function addTransactionForm(){
    $('#transactionForm').append(`
    <h2>Create A Transaction</h2>
    <form id="createTransaction" action="proxy.php" title="Login" method="post">
        <div>
            <label class="title">Created:</label>
            <input type="date" id="created" name="created" >
        </div>
        <div>
            <label class="title">Amount:</label>
            <input type="number" id="amount" name="amount" >
        </div>
        <div>
            <label class="title">Merchant:</label>
            <input type="text" id="merchant" name="merchant" >
        </div>
        <div>
            <input type="submit" id="transactionButton" name="transactionButton" value="Submit">
        </div>
    </form>
    `);
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
             command:           "login",
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

                     setCookie("authToken", success.authToken);
                     removeLoginForm();

                     if($('#errorMessage').length){
                         removeErrorMessage();
                     }

                     addLoggedInFunctions();

                 } else {
                      console.log("There was an error in the request");
                      if($('#errorMessage').length){
                          removeErrorMessage();
                      }
                      $("#loginContent").append("<div id='errorMessage'>Error: "+
                          success.message.substr(success.message.indexOf(" "))+"</div>");
                 }

             },
             error: function(error){
                 console.log(error);
             }
         });
    }

function removeErrorMessage(){
    $("#errorMessage").remove();
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
                console.log("fetching transaction list");
                writeDataToTable(JSON.parse(success).transactionList);
            },
            error: function(error){
                console.log(error)
            }
        });
    }

function writeDataToTable(data){
    console.log("building insert");
    var i,j,temparray,chunk = 500;

    for (i=0,j=data.length; i<j; i+=chunk) {
        temparray = data.slice(i,i+chunk);
        recursiveWrite(temparray, "");
        console.log("inserting to table");

    }


}

function recursiveWrite(dataLeft, finalString){
    if(dataLeft.length === 0) {
        $("#transactionTableBody").append(finalString);
        return;
    } else {
        var row = dataLeft.shift();
        recursiveWrite(dataLeft, finalString + pullRequiredFields(row));
    }
}

function pullRequiredFields(row){
    return "<tr>" +
        "<td style='max-width: 200px;border: 1px solid black;text-align:center;'>"+row.created+"</td>"+
        "<td style='max-width: 200px;border: 1px solid black;text-align:center;'>"+row.merchant+ "</td>"+
        "<td style='max-width: 200px;border: 1px solid black;text-align:center;'>"+row.amount+"</td>" +
        "</tr>";
}

function createTransaction(create, amt, merch){
    var data = {
        command:        "createTransaction",
        authToken:      getCookie("authToken"),
        created:        create,
        amount:         amt,
        merchant:       merch
    };
    console.log("User Is Creating a Transaction");

    return $.ajax({
        type: "POST",
        url: "./proxy.php",
        data: data,
        dataType: 'json',
        success: function(success){
            var transaction = JSON.parse(success);
            if(transaction.message){
                if($('#errorMessage').length) {
                    removeErrorMessage();
                }
                var message = transaction.message;
                $('#createTransaction').append("<div id='errorMessage'>"+
                    message.substr(message.indexOf(" "))+"</div>");
            } else {
                $("#transactionTableBody").prepend(pullRequiredFields(transaction.transactionList[0]));
            }
        },
        error: function(error){
            console.log(error);
        }
    });

}

function addLoggedInFunctions(){
    addTransactionTable();
    addTransactionForm();
    getTransactionList();
}

