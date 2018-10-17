<?php

if(!empty($_POST)){
    if($_POST['command'] == "login") {
        $result = loginToExpensify($_POST["partnerName"], $_POST["partnerPassword"], $_POST['partnerUserID'], $_POST["partnerUserSecret"]);
        header('Content-Type: application/json');
        echo json_encode($result);
    }
    else if($_POST['command'] =="createTransaction"){
        $result = createTransaction($_POST['authToken'],$_POST['created'], $_POST['amount'], $_POST['merchant']);
        header('Content-Type: application/json');
        echo json_encode($result);
    }
}

if(!empty($_GET)){
    $result = getTransactionList($_GET["authToken"], $_GET["returnValueList"]);
    header('Content-Type: application/json');
    echo json_encode($result);
}

/**
 * Function loginToExpensify
 * Goal:    to send a POST request to expensify's API
 *
 * @param $partnerName
 * @param $partnerPassword
 * @param $partnerUserID
 * @param $partnerUserSecret
 * @return mixed, typically a JSON response with 'email', 'accountID', 'authToken'
 */
function loginToExpensify($partnerName, $partnerPassword, $partnerUserID,$partnerUserSecret){
   $url = "https://www.expensify.com/api?command=Authenticate";

   $fields = [
       "partnerName"        => $partnerName,
       "partnerPassword"    => $partnerPassword,
       "partnerUserID"      => $partnerUserID,
       "partnerUserSecret"  => $partnerUserSecret
   ];

   $fields_string = http_build_query($fields);

   $ch = curl_init();

   curl_setopt($ch, CURLOPT_URL, $url);
   curl_setopt($ch, CURLOPT_POST, count($fields));
   curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);

   curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

   $result = curl_exec($ch);
   return $result;
}

/**
 * Function createTransaction
 * Goal:    to allow the user to create a transaction
 * @param $authToken
 * @param $created
 * @param $amount
 * @param $merchant
 * @return mixed
 */
function createTransaction($authToken, $created, $amount, $merchant){
    $url = "https://www.expensify.com/api?command=CreateTransaction";

    $fields = [
        "authToken"     => $authToken,
        "created"       => $created,
        "amount"        => $amount,
        "merchant"      => $merchant
    ];

    $fields_string = http_build_query($fields);

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, count($fields));
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $result = curl_exec($ch);
    return $result;
}

/**
 * Function getTransactionList
 * Goal:    to retrieve the transactions based on the specified parameters.
 * @param $authToken
 * @param $returnValueList
 * @param null $startDate
 * @param null $endDate
 * @param null $limit
 * @param null $offset
 * @return mixed, typically returns a JSON response with `transaction` as a key.
 */
function getTransactionList($authToken, $returnValueList){
    $url = "https://www.expensify.com/api?command=Get";

    $fields = [
        "authToken"             => $authToken,
        "returnValueList"       => $returnValueList
    ];

    $ch = curl_init();

    //Append to URL
    $url .= "&" .http_build_query($fields);

    curl_setopt($ch, CURLOPT_URL, $url);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $result = curl_exec($ch);
    return $result;
}