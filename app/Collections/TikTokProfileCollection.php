<?php

declare(strict_types=1);

namespace App\Collections;

use App\Models\TikTokProfile;

class TikTokProfileCollection
{
    private array $profiles = [];

    public function __construct(array $profiles = [])
    {
        foreach ($profiles as $profile) {
            if (!$profile instanceof TikTokProfile) {
                continue;
            }
            $this->add($profile);
        }
    }

    public function add(TikTokProfile $profile): void
    {
        $this->profiles[] = $profile;
    }

    public function getAllTiktokProfiles(): array
    {
        return $this->profiles;
    }
}