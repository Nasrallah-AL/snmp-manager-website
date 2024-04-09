<?php
// SNMP Community String
$community = "public";


// SNMP Agent IP Address
$client_ip = "localhost";



$data = json_decode(file_get_contents('php://input'), true);

// Function to set value of System Group Values
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $data != null) {

    if (isset($data['System Contact'])) snmp2_set($client_ip, "public", "1.3.6.1.2.1.1.4.0", "s", $data['System Contact']);
    if (isset($data['System Name'])) snmp2_set($client_ip, "public", "1.3.6.1.2.1.1.5.0", "s", $data['System Name']);
    if (isset($data['System Location'])) snmp2_set($client_ip, "public", "1.3.6.1.2.1.1.6.0", "s", $data['System Location']);

}

// Function to fetch and return System Group information
function get_system_group_info() {
    global $client_ip, $community;
    $desc = snmp2_get($client_ip, $community, "1.3.6.1.2.1.1.1.0");
    $id = snmp2_get($client_ip, $community, "1.3.6.1.2.1.1.2.0");
    $time = snmp2_get($client_ip, $community, "1.3.6.1.2.1.1.3.0");
    $name = snmp2_get($client_ip, $community, "1.3.6.1.2.1.1.5.0");
    $location = snmp2_get($client_ip, $community, "1.3.6.1.2.1.1.6.0");
    $contact = snmp2_get($client_ip, $community, "1.3.6.1.2.1.1.4.0");

    return array(
        "System ID" => $id,
        "System Description" => $desc,
        "System UpTime" => $time,
        "System Name" => $name,
        "System Contact" => $contact,
        "System Location" => $location,

    );
}

// Function to fetch and return TCP table information
function get_tcp_table() {
    global $client_ip, $community;
    $tcpConnState_values = snmp2_walk($client_ip, $community, '1.3.6.1.2.1.6.13.1.1');
    $tcpConnLocalAddress_values = snmp2_walk($client_ip, $community, '1.3.6.1.2.1.6.13.1.2');
    $tcpConnLocalPort_values = snmp2_walk($client_ip, $community, '1.3.6.1.2.1.6.13.1.3');
    $tcpConnRemAddress_values = snmp2_walk($client_ip, $community, '1.3.6.1.2.1.6.13.1.4');
    $tcpConnRemPort_values = snmp2_walk($client_ip, $community, '1.3.6.1.2.1.6.13.1.5');


    return array(
        'tcpConnState' => $tcpConnState_values,
        'tcpConnLocalAddress' => $tcpConnLocalAddress_values,
        'tcpConnLocalPort' => $tcpConnLocalPort_values,
        'tcpConnRemAddress' => $tcpConnRemAddress_values,
        'tcpConnRemPort' => $tcpConnRemPort_values
    );

}

// Function to fetch and return ARP table information
function get_arp_table() {
    global $client_ip, $community;
    $ipNetToMediaIfIndex_values = snmp2_walk($client_ip, $community, '1.3.6.1.2.1.4.22.1.1');
    $ipNetToMediaPhysAddress_values = snmp2_walk($client_ip, $community, '1.3.6.1.2.1.4.22.1.2');
    $ipNetToMediaNetAddress_values = snmp2_walk($client_ip, $community, '1.3.6.1.2.1.4.22.1.3');
    $ipNetToMediaType_values = snmp2_walk($client_ip, $community, '1.3.6.1.2.1.4.22.1.4');


    return array(
        'ipNetToMediaIfIndex' => $ipNetToMediaIfIndex_values,
        'ipNetToMediaPhysAddress' => $ipNetToMediaPhysAddress_values,
        'ipNetToMediaNetAddress' => $ipNetToMediaNetAddress_values,
        'ipNetToMediaType' => $ipNetToMediaType_values
    );

}

// Function to fetch and return SNMP group statistics
function get_snmp_statistics() {
    global $client_ip, $community;

    $getMethodArray = [];

    for ($i = 1; $i <= 30; $i++) {
        if ($i === 7 || $i === 23) continue;
        $objectValue = snmp2_get($client_ip, $community, "1.3.6.1.2.1.11." . $i . ".0");
        $getMethodArray[$i] = explode(": ", $objectValue, 2)[1];
    }

    $walkMethodArray = snmp2_walk($client_ip, $community, '1.3.6.1.2.1.11');
    // Use both snmp2_get() and snmp2_walk() to fetch statistics
    // Return data as an array



    return array(
      'get_method' => $getMethodArray,
      'walk_method' => $walkMethodArray
    );
}


$page = isset($_GET['page']) ? $_GET['page'] : '';
if ($page) {
    switch ($page) {
        case 'systemGroup':
            $data = get_system_group_info();
            break;
        case 'tcpTable':
            $data = get_tcp_table();
            break;
        case 'arpTable':
            $data = get_arp_table();
            break;
        case 'snmpStatistics':
            $data = get_snmp_statistics();
            break;
        default:
            $data = array('error' => 'Invalid request');
    }

    header('Content-Type: application/json');
    echo json_encode($data);
}else {
    header('Content-Type: application/json');
    echo json_encode(array('error' => 'Invalid request'));
}


?>
