<?php

echo 'Hello ' . htmlspecialchars($_SERVER["name"]) . '!';
echo $_SERVER;
echo $_POST;



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