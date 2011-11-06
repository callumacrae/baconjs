<?php

header('Content-type: application/json');

echo json_encode(array(
	'method'	=> $_SERVER['REQUEST_METHOD'],
	'GET'		=> $_GET,
	'POST'		=> $_POST
));