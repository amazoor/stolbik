<?php
$vk_id = $_GET['vk_id'];
$firstname = $_GET['firstname'];
$lastname = $_GET['lastname'];
$sex = $_GET['sex'];
$coins = 100;

$link = mysql_connect('localhost', 'amazoor_stolbik', 'stolbik');

if (!$link) {
    die('Could not connect: ' . mysql_error());
}
mysql_query("SET NAMES 'utf8'");
echo 'Connected successfully';

mysql_select_db('amazoor_stolbik');

$query = "INSERT INTO `amazoor_stolbik`.`users_vk` (`id`, `firstname`, `lastname`, `sex`, `coins`) VALUES ('$vk_id', '$firstname', '$lastname', '$sex', '$coins');";

$res = mysql_query($query);

mysql_close($link);
header("Content-type: text/txt; charset=UTF-8");
?>