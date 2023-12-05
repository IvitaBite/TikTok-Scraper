<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Collections\ETFCollection;
use App\Collections\ETFHoldingCollection;
use App\Collections\TikTokProfileCollection;
use Google\Client;
use Google\Service\Sheets;
use Google\Service\Sheets\ValueRange;

class GoogleSpreadsheetRepository
{
    private Client $client;
    private Sheets $sheets;

    public function __construct()
    {
        $this->client = new Client();
        $serviceAccountKeyPath = $_ENV['SERVICE_ACCOUNT_KEY_PATH'] ?? null;
        if ($serviceAccountKeyPath !== null) {
            $this->client->setAuthConfig(__DIR__ . "/$serviceAccountKeyPath");
            $this->client->addScope(Sheets::SPREADSHEETS);
            $this->sheets = new Sheets($this->client);
        } else {
            throw new \Exception('SERVICE_ACCOUNT_KEY_PATH environment variable not set.');
        }
    }

    public function saveToSheet(
        string        $spreadsheetID,
        string        $range,
        TikTokProfileCollection $profiles
    ): void
    {
        $values = $this->prepareDataForSaving($profiles);
        $updateBody = new ValueRange([
            'values' => $values
        ]);
        $updateOptions = ['valueInputOption' => 'RAW'];
        $this->sheets->spreadsheets_values
            ->update(
                $spreadsheetID,
                $range,
                $updateBody,
                $updateOptions
            );
    }

    private function prepareDataForSaving(TikTokProfileCollection $profiles): array
    {
        $values = [[
            'Profile URL',
            'Followers',
            'Likes',
            'Likes Of Last Five Videos',
            'Views Sum Of Last Five Videos'
        ]];

        foreach ($profiles->getAllTiktokProfiles() as $profile) {
            $rowData = [
                $profile->getProfileUrl(),
                $profile->getFollowers(),
                $profile->getLikes(),
                $profile->getLikesOfLastFiveVideos(),
                $profile->getViewsSumOfLastFiveVideos()
            ];

            $values[] = $rowData;

        }
        return $values;
    }
}