<?php

declare(strict_types=1);

use App\Services\Google\SaveToSpreadsheetService;
use Dotenv\Dotenv;

require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__ . '/');
$dotenv->load();

$serviceAccountKeyPath = $_ENV['SERVICE_ACCOUNT_KEY_PATH'];

$spreadSheetID = $_ENV['GOOGLE_SPREADSHEET_ID'];
$range = 'Sheet1';

$urls = ['https://www.tiktok.com/search?q=latvie%C5%A1utiktok&t=1679913963503',
    'https://www.tiktok.com/search?q=latviesutiktok&t=1679914008172',
    'https://www.tiktok.com/search?q=%23r%C4%ABga&t=1679914077948',
    'https://www.tiktok.com/search?q=%23riga&t=1679914093241',
    'https://www.tiktok.com/search?q=%23latvija&t=1679914138954',
    'https://www.tiktok.com/search?q=%D0%BB%D0%B0%D1%82%D0%B2%D0%B8%D1%8F&t=1683100658756',
    'https://www.tiktok.com/search?q=%23tiktoklatvia&t=1683102332617',
    'https://www.tiktok.com/search?q=%23latviantiktok&t=1683102479276',
    'https://www.tiktok.com/search?q=%23latviatiktok&t=1683102521058',
    'https://www.tiktok.com/search?q=%23rekl%C4%81ma&t=1683102843919'
];

$etfCollection = new SaveToSpreadsheetService();
$etfCollection->execute($urls, $spreadSheetID, $range);