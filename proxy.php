<?php

echo "test";
    if ( !empty($_POST)){//["authenticate"]) {
        header('Content-Type: application/json');
        echo json_encode(["test"=>"testing"]);
        exit();
        $partnerName = "applicant";
        $partnerPassword = "d7c3119c6cdab02d68d9";
        $partnerUserID = "expensifytest@mailinator.com";
        $password = "hire_me";

        httpPost($partnerName, $partnerPassword, $partnerUserID, $password);
        exit();
    }



    function httpPost($partnerName, $partnerPassword, $partnerUserID,$password){
       $url = "https://www.expensify.com/api?command=Authenticate";

       $fields = [
           "partnerName"        => $partnerName,
           "partnerPassword"    => $partnerPassword,
           "partnerUserID"      => $partnerUserID,
           "password"           => $password
       ];

       $fields_string = http_build_query($fields);

       $ch = curl_init();

       curl_setopt($ch, CURLOPT_URL, $url);
       curl_setopt($ch, CURLOPT_POST, count($fields));
       curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);

       curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

       $result = curl_exec($ch);
       echo $result;
    }