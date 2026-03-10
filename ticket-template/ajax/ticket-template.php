<?php
// Portal endpoint to fetch the ticket template for a service subcategory.

$sDir = __DIR__;
$sApproot = '';
for ($i = 0; $i < 8; $i++) {
	$sCandidate = $sDir . '/approot.inc.php';
	if (file_exists($sCandidate)) {
		$sApproot = $sCandidate;
		break;
	}
	$sDir = dirname($sDir);
}

if ($sApproot === '') {
	throw new Exception('approot.inc.php not found');
}

require_once $sApproot;
require_once APPROOT . 'application/startup.inc.php';

$bDebug = (utils::ReadParam('debug', '0', false, 'raw_data') === '1');

$fnRespond = function ($sTemplate, $iStatusCode = 200, $sError = '') use ($bDebug) {
	http_response_code($iStatusCode);
	$aResponse = array('template' => $sTemplate);
	if ($bDebug && $sError !== '') {
		$aResponse['error'] = $sError;
	}
	echo json_encode($aResponse);
	exit;
};

if (class_exists('LoginWebPage') && method_exists('LoginWebPage', 'CheckLoggedIn')) {
	LoginWebPage::CheckLoggedIn();
}

$sId = utils::ReadParam('service_subcategory_id', '', false, 'raw_data');
$sId = trim($sId);

header('Content-Type: application/json; charset=UTF-8');

if ($sId === '') {
	$fnRespond('');
}

try {
	$oSubcategory = MetaModel::GetObject('ServiceSubcategory', $sId, false);
	if ($oSubcategory === null) {
		$fnRespond('', 404);
	}

	if (!UserRights::IsActionAllowed('ServiceSubcategory', UR_ACTION_READ, $oSubcategory)) {
		$fnRespond('', 403);
	}

	$sTemplate = (string) $oSubcategory->Get('ticket_template');
	$fnRespond($sTemplate);
} catch (Throwable $e) {
	IssueLog::Error('ticket-template endpoint failed: ' . $e->getMessage());
	$fnRespond('', 500, $e->getMessage());
}
