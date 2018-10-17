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
    var rValueList  = $("#return-value-list").val(),
        sDate       = $("#start-date").val(),
        eDate       = $("#end-date").val(),
        Lim         = $('#limit').val(),
        Oset        = $('#offset').val();

   getTransactionList(rValueList, sDate, eDate, Lim, Oset);
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
        addTransactionForm();

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

function addTransactionForm(){
    $("#transactionForm").append(
        ` <form id="transaction-form">
            <p>Return Value List</p>
            <input type="text" name="return-value-list">
            
            <p>Start Date</p>
            <input type="date" name="start-date">
    
            <p>End Date</p>
            <input type="date" name="end-date">
    
            <p>Limit</p>
            <input type="number" name="limit">
    
            <p>Offset</p>
            <input type="number" name="offset">
    
            <button type="submit" name="transaction-submit"> Find </button>
        </form>`
    )
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

function getTransactionList(rValueList, sDate=null,eDate=null,Lim=null,Oset=null){
        var data = {
            authToken: getCookie("authToken"),
            returnValueList: rValueList,
        };

        if(sDate !=null)
            data.push({key: "startDate", value: sDate});
        if(eDate != null)
            data.push({key:"endDate", value: eDate});
        if(Lim != null)
            data.push({key:"Limit", value: Lim});
        if(Oset != null)
            data.push({key: "Offset", value: Oset});

        return $.ajax({
            type: "GET",
            url: "./proxy.php",
            data: data,
            dataType: 'json',
            success: function(success){
                console.log(success)
            },
            error: function(error){
                console.log(error)
            }
        });
    }
