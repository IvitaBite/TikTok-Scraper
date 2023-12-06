const puppeteer = require('puppeteer');

const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';

async function fetchTikTokData(urls) {
    try {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();

        await page.setUserAgent(userAgent);
        await page.waitForTimeout(5000);

        const results = [];

        for (const url of urls) {
            await page.goto(url, {waitUntil: 'load'});
            await page.waitForSelector('a[data-e2e="search-card-user-link"]');

            const profileUrls = await page.$$eval('a[data-e2e="search-card-user-link"]', links =>
                links.map(link => `https://www.tiktok.com${link.getAttribute('href')}`)
            );

            for (const profileUrl of profileUrls) {
                await page.goto(profileUrl, {waitUntil: 'load'});
                await page.waitForSelector('[data-e2e="followers-count"]');

                await page.waitForTimeout(5000);

                const profileData = await page.evaluate(() => {

                    const getFullNumber = (countText) => {
                        if(!countText) {
                            return null;
                        }

                        let multiplier = 1;
                        if (countText.includes('K')) {
                            multiplier = 1000;
                        } else if (countText.includes('M')) {
                            multiplier = 1000000;
                        }

                        const countWithoutMultiplier = countText.replace(/[^\d.]/g, '');
                        const count = parseFloat(countWithoutMultiplier) * multiplier;
                        return isNaN(count) ? null : Math.round(count);
                    }
                    const getFollowersCount = () => {
                        const followersCount = document.querySelector('[data-e2e="followers-count"]');
                        return followersCount ? getFullNumber(followersCount.textContent.trim()) : null;
                    };

                    const getLikesCount = () => {
                        const likeCount = document.querySelector('[data-e2e="likes-count"]');
                        return likeCount ? getFullNumber(likeCount.textContent.trim()) : null;
                    };

                    const getVideoData = () => {
                        const view = document.querySelectorAll('.tiktok-dirst9-StrongVideoCount');
                        const views = Array.from(view)
                            .slice(0, 5)
                            .map((element) => getFullNumber(element.textContent.trim()));

                        const viewsSum = views.reduce((sum, value) => sum + value, 0);

                        const videoElements = document.querySelectorAll('a[href*="/video/"]');
                        const videoUrls = Array.from(videoElements)
                            .slice(0, 5)
                            .map((link) => link.getAttribute('href'));

                        return {
                            viewsSum: viewsSum,
                            videoUrls: videoUrls
                        };
                    };

                    const getLikesOfLastFiveVideos = async (videoUrls) => {
                        const likesArray = [];

                        for (const videoUrl of videoUrls) {
                            await page.goto(videoUrl, {waitUntil: 'load'});
                            await page.waitForSelector('[data-e2e="likes-count"]', { timeout: 30000 });

                            const likeCount = await page.$eval('[data-e2e="likes-count"]', likesCount => {
                                return getFullNumber(likesCount.textContent.trim()) || 0;
                            });
                            likesArray.push(likeCount);
                        }
                        return likesArray;
                    };

                    const {videoUrls} = getVideoData();

                    return {
                        profileUrl: window.location.href,
                        followers: getFollowersCount(),
                        likes: getLikesCount(),
                        viewsSumOfLastFiveVideos: getVideoData(),
                        likesOfLastFiveVideos: getLikesOfLastFiveVideos(videoUrls),
                    };
                });

                results.push(profileData)
            }

        }

        await browser.close();

        return JSON.stringify(results);

    } catch (error) {
        return JSON.stringify({error: error.message})
    }
}

const urls = [
    'https://www.tiktok.com/search?q=latvie%C5%A1utiktok&t=1679913963503',
    /*'https://www.tiktok.com/search?q=latviesutiktok&t=1679914008172',
    'https://www.tiktok.com/search?q=%23r%C4%ABga&t=1679914077948',
    'https://www.tiktok.com/search?q=%23riga&t=1679914093241',
    'https://www.tiktok.com/search?q=%23latvija&t=1679914138954',
    'https://www.tiktok.com/search?q=%D0%BB%D0%B0%D1%82%D0%B2%D0%B8%D1%8F&t=1683100658756',
    'https://www.tiktok.com/search?q=%23tiktoklatvia&t=1683102332617',
    'https://www.tiktok.com/search?q=%23latviantiktok&t=1683102479276',
    'https://www.tiktok.com/search?q=%23latviatiktok&t=1683102521058',
    'https://www.tiktok.com/search?q=%23rekl%C4%81ma&t=1683102843919'*/
];

fetchTikTokData(urls).then(jsonResult => console.log(jsonResult));