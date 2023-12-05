<?php

declare(strict_types=1);

namespace App\Services\Google;

use App\Repositories\GoogleSpreadsheetRepository;
use App\Repositories\TikTokProfileRepository;
use Google\Client;

class SaveToSpreadsheetService
{
    public function execute(
        array $urls,
        string $spreadsheetID,
        string $range
    ): void
    {
        $client = new Client();
        $ethData = new TikTokProfileRepository(new GoogleSpreadsheetRepository($client));
        $ethData->scrapeTikTokProfiles($urls, $spreadsheetID, $range);
    }
}