<?php

if(!empty($_POST)){
    $result = expensifyPOST($_POST["partnerName"], $_POST["partnerPassword"], $_POST['partnerUserID'], $_POST["partnerUserSecret"]);
    header('Content-Type: application/json');
    echo json_encode($result);
}

function expensifyPOST($partnerName, $partnerPassword, $partnerUserID,$partnerUserSecret){
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