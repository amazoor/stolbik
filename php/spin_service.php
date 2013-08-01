<?php
$vk_id = $_GET['vk_id'];

$digit0 = rand(0, 9);
$digit1 = rand(0, 9);
$digit2 = rand(0, 9);
$win = getWin($digit0, $digit1, $digit2);
$digits = array($digit0, $digit1, $digit2, $win, $matrix, getCoins());
$matrix = "111";
$error = null;

function getWin($d0, $d1, $d2)
{
    $win = 0;
    $combination = $d0 . $d1 . $d2;

    switch ($combination) {
        case 777:   $win = 200;   break;
        case 999:   $win = 100;   break;
        case 555:   $win = 50;    break;
        case 333:   $win = 25;    break;
        case 111:   $win = 15;    break;
        case 000:   $win = 10;    break;
        case 222:   $win = 10;    break;
        case 444:   $win = 10;    break;
        case 666:   $win = 10;    break;
        case 888:   $win = 10;    break;
        default:
            $win = chekOtherCombinations($d0, $d1, $d2);
    }

    return $win;
}

function getCoins() {
    global $vk_id;
    $link = mysql_connect('localhost', 'amazoor_stolbik', 'stolbik');
    if (!$link) {
        die('Could not connect: ' . mysql_error());
    }

    mysql_query("SET NAMES 'utf8'");
    mysql_select_db('amazoor_stolbik');
    $query = "SELECT `coins` FROM `amazoor_stolbik`.`users_vk` WHERE `id` = '$vk_id';";
    $res = mysql_query($query);
    $coins = 0;
    while($row = mysql_fetch_array($res))
    {
        $coins = $row['coins'];
    }
    global $win;
    $coins -= 1;
    $coins += $win;

    $query = "UPDATE `amazoor_stolbik`.`users_vk` SET `coins`='$coins' WHERE `id` = '$vk_id';";
    mysql_query($query);

    mysql_close($link);
    return $coins;
}

function chekOtherCombinations($d0, $d1, $d2)
{
    $combination = $d0 . $d1 . $d2;
    global $matrix;

    $matrix = "011";

    if ($d1 == 7 && $d2 == 7)
        $win = 5;
    else if ($d1 == 0 && $d2 == 0)
        $win = 3;
    else if ($d2 == 7) {
        $win = 2;
        $matrix = "001";
    }
    else if ($d2 == 0) {
        $win = 1;
        $matrix = "001";
    }
    else {
        $win = 0;
        $matrix = "000";
    }

    return $win;
}


echo json_encode($digits);
header("Access-Control-Allow-Origin: *");

?>