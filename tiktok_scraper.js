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

            /*const profileUrls = await page.waitForSelector('a[data-e2e="search-card-user-link"]', { visible: true })
                .then(links => links.evaluate(links => links.map(link => `https://www.tiktok.com${link.getAttribute('href')}`)));*/
            const profileUrls = await page.$$eval('a[data-e2e="search-card-user-link"]', links => links.map(link => `https://www.tiktok.com${link.getAttribute('href')}`));

            for (const profileUrl of profileUrls) {
                await page.goto(profileUrl, { waitUntil: 'load' });
                await page.waitForSelector('[data-e2e="followers-count"]');

                const getFollowersCount = () => {
                    const followersCount = document.querySelector('[data-e2e="followers-count"]');
                    return followersCount ? parseInt(followersCount.textContent.trim()
                        .replace('K', '000')
                        .replace('M', '000000')) : null;
                };

                const getLikesCount = () => {
                    const likeCount = document.querySelector('.tiktok-n6wn07-StrongText.edu4zum2');
                    return likeCount ? parseInt(likeCount.textContent.trim()
                        .replace('K', '000')
                        .replace('M', '000000')) : null;
                };

                const getLikesOfLastFiveVideos = () => {
                    const like = document.querySelectorAll('.tiktok-dirst9-StrongVideoCount');
                    const likes = Array.from(like)
                        .slice(0, 5)
                        .map((element) => parseInt(element.textContent.trim()
                            .replace('K', '000')
                            .replace('M', '000000')))
                        .filter((value) => !isNaN(value));
                    return likes;
                };

                const getViewsSumOfLastFiveVideos = () => {
                    const view = document.querySelectorAll('.tiktok-dirst9-StrongVideoCount');
                    const views = Array.from(view)
                        .slice(0, 5)
                        .map((element) => parseInt(element.textContent.trim()
                            .replace('K', '000')
                            .replace('M', '000000')))
                        .filter((value) => !isNaN(value));
                    return views.reduce((sum, value) => sum + value, 0);
                };

                const result = {
                    profileUrl: window.location.href,
                    followers: getFollowersCount(),
                    likes: getLikesCount(),
                    likesOfLastFiveVideos: getLikesOfLastFiveVideos(),
                    viewsSumOfLasFiveVideos: getViewsSumOfLastFiveVideos(),
                };
                results.push(result)
            }

        }

        await browser.close();

        return JSON.stringify(results);

    } catch (error) {
        return JSON.stringify({ error: error.message })
    }
}

const urls = [
    'https://www.tiktok.com/search?q=latvie%C5%A1utiktok&t=1679913963503',
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

fetchTikTokData(urls).then(jsonResult => console.log(jsonResult));