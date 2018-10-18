//Perform on startup
checkAuthToken();

/**
 * Event:   On UserLogin Submit
 * Goal:    to log the user into the Expensify API. This will return a variety of information.
 *          Find the information in loginToExpensify.
 */
$("#userlogin").submit(function(event){

    event.preventDefault();

    var partName        = $("#partnerName").val(),
        partPassword    = $("#partnerPassword").val(),
        partUserID      = $("#partnerUserID").val(),
        partUserSecret  = $("#partnerUserSecret").val();

    var form = $(this),
        url = form.attr("action");

    loginToExpensify(partName,partPassword,partUserID,partUserSecret);

});

/**
 * Event: transactionForm Submit
 * Goal:    to submit a request to the Expensify API via createTransaction.
 */
$("#transactionForm").submit(function(event){
   event.preventDefault();

   var  created     = $("#created").val(),
        amount      = $("#amount").val(),
        merchant    = $("#merchant").val();

   createTransaction(created, amount, merchant);
});

//COOKIE FUNCTIONS
/**
 * Function setCookie
 * Goal:    to allow the storage of programmer defined cookies
 * @param cname
 * @param cvalue
 */
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";" + ";path=/";
}

/**
 * Function getCookie
 * Goal:    to retrieve the cookie from memory
 * @param cname
 * @returns {string}
 */
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

/**
 * Function checkAuthToken
 * Goal:    to handle the authentication and add necessary login forms
 *
 **/
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

//ADD | REMOVE ELEMENT FUNCTIONS
/**
 * Function addTransactionTable
 * Goal:    to add the transactionTable to the document
 */
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

/**
 * Function addLoginForm
 * Goal:    to add the login form to the document
 */
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

/**
 * Function addTransactionForm
 * Goal:    to add the transaction form to the document
 */
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

/**
 * Function removeLoginForm
 * Goal:    to remove the loginForm div
 */
function removeLoginForm(){
    $("#loginContent").remove();
}

/**
 * Function removeErrorMessage
 * Goal:    remove the errorMessage div
 */
function removeErrorMessage(){
    $("#errorMessage").remove();
}

/**
 * Function addLoggedInFunctions
 * Goal:    to add the necessary functions if the user is logged in.
 */
function addLoggedInFunctions(){
    addTransactionTable();
    addTransactionForm();
    getTransactionList();
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

/**
 * Function simpleVerifyLogin
 * Goal:    to verify the user logging in
 * @param success
 * @returns {boolean}
 */
function simpleVerifyLogin(success){
         return  success.accountID   !== null &&
                 success.authToken   !== null &&
                 success.email       !== null &&
                 success.httpCode    === 200  &&
                 success.jsonCode    === 200  &&
                 success.requestID   !== null;
     }

 //TRANSACTION FUNCTIONS

/**
 * Function getTransactionList
 * Goal:    to call the Expensify API to retrieve the user's transaction List.
 * @returns {*}
 */
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
                console.log(JSON.parse(success).transactionList.length);
                let t0 = performance.now();
                writeDataToTable(JSON.parse(success).transactionList);
                let t1 = performance.now();
                console.log("parsing/writing to table took " + (t1 - t0) + " milliseconds.");
            },
            error: function(error){
                console.log(error)
            }
        });
    }

/**
 * Function writeDataToTable
 * Goal:    this function is called when the user is to add the transaction list to the
 *          document.
 * @param data
 */
function writeDataToTable(data){
    console.log("building insert");
    var i,j,temparray,chunk = 10000;
    // 1        takes 2925 ms.
    // 100      takes 261 ms.
    // 500      takes 271 ms.
    // 1000     takes 180 ms.
    // 10000    takes 151~175ms.
    // no size  takes 175 ms.
    for (i=0,j=data.length; i<j; i+=chunk) {
        temparray = data.slice(i,i+chunk);
        recursiveWrite(temparray, "");
        console.log("inserting to table");

    }


}

/**
 * Function recursiveWrite
 * Goal:    to tail-recursively concatenate strings to add them to the transactionTableBody.
 * @param dataLeft
 * @param finalString
 */
function recursiveWrite(dataLeft, finalString){
    if(dataLeft.length === 0) {
        $("#transactionTableBody").append(finalString);
    } else {
        recursiveWrite(dataLeft, finalString + pullRequiredFields(dataLeft.shift()));
    }
}

/**
 * Function pullRequiredFields
 * Goal:    to pull necessary fields and format them into table cells
 * @param row
 * @returns {string}
 */
function pullRequiredFields(row){
    return "<tr>" +
        "<td style='max-width: 200px;border: 1px solid black;text-align:center;'>"+row.created+"</td>"+
        "<td style='max-width: 200px;border: 1px solid black;text-align:center;'>"+row.merchant+ "</td>"+
        "<td style='max-width: 200px;border: 1px solid black;text-align:center;'>"+row.amount+"</td>" +
        "</tr>";
}

/**
 * Function createTransaction
 * Goal:    to create the transaction according to Expensify's API
 * @param create
 * @param amt
 * @param merch
 * @returns {*}
 */
function createTransaction(create, amt, merch){
    let data = {
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
            let transaction = JSON.parse(success);
            if(transaction.message){
                if($('#errorMessage').length) {
                    removeErrorMessage();
                }
                let message = transaction.message;
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
