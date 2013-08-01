<?php
$vk_id = $_GET['vk_id'];

$digit0 = rand(0, 9);
$digit1 = rand(0, 9);
$digit2 = rand(0, 9);
$coins = 0;

$link = mysql_connect('localhost', 'amazoor_stolbik', 'stolbik');
if (!$link) {
    die('Could not connect: ' . mysql_error());
}

mysql_query("SET NAMES 'utf8'");
mysql_select_db('amazoor_stolbik');
$query = "SELECT `coins` FROM `amazoor_stolbik`.`users_vk` WHERE `id` = '$vk_id';";
$res = mysql_query($query);

 while($row = mysql_fetch_array($res))
 {
 	$coins = $row['coins'];
 }

mysql_close($link);

$digits = array($digit0, $digit1, $digit2, $coins);

echo json_encode($digits);

header("Access-Control-Allow-Origin: *");
?>