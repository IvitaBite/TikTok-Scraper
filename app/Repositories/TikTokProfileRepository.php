<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Collections\TikTokProfileCollection;
use App\Models\TikTokProfile;

class TikTokProfileRepository
{
    private GoogleSpreadsheetRepository $sheetsRepository;

    public function __construct(GoogleSpreadsheetRepository $sheetsRepository)
    {
        $this->sheetsRepository = $sheetsRepository;
    }

    public function scrapeTikTokProfiles(
        array $urls,
        string $spreadsheetID,
        string $range
    ): TikTokProfileCollection
    {
        $urlsString = implode(' ', $urls);
        $command = "node tiktok_scraper.js \"$urlsString\"";
        $result = exec($command);
        $decodedProfileData = json_decode($result, true);
        var_dump($decodedProfileData);//todo
        $profileCollection = new TikTokProfileCollection();

        foreach ($decodedProfileData as $data) {
            $profile = new TikTokProfile(
                $data['profileUrl'],
                $data['followers'],
                $data['likes'],
                $data['likesOfLastFiveVideos'],
                $data['viewsSumOfLastFiveVideos']
            );

            $profileCollection->add($profile);
        }

        $this->sheetsRepository->saveToSheet($spreadsheetID, $range, $profileCollection);
        return $profileCollection;
    }
}