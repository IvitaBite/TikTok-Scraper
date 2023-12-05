<?php

declare(strict_types=1);

namespace App\Models;

class TikTokProfile
{
    private string $profileUrl;
    private int $followers;
    private int $likes;
    private array $likesOfLastFiveVideos;
    private int $viewsSumOfLastFiveVideos;

    public function __construct(
        string $profileUrl,
        int $followers,
        int $likes,
        array $likesOfLastFiveVideos,
        int $viewsSumOfLastFiveVideos
    )
    {
        $this->profileUrl = $profileUrl;
        $this->followers = $followers;
        $this->likes = $likes;
        $this->likesOfLastFiveVideos = $likesOfLastFiveVideos;
        $this->viewsSumOfLastFiveVideos = $viewsSumOfLastFiveVideos;
    }

    public function getProfileUrl(): string
    {
        return $this->profileUrl;
    }

    public function getFollowers(): int
    {
        return $this->followers;
    }

    public function getLikes(): int
    {
        return $this->likes;
    }

    public function getLikesOfLastFiveVideos(): array
    {
        return $this->likesOfLastFiveVideos;
    }

    public function getViewsSumOfLastFiveVideos(): int
    {
        return $this->viewsSumOfLastFiveVideos;
    }
}