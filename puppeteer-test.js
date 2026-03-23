const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`PAGE LOG ERROR:`, msg.text());
        }
    });

    page.on('pageerror', error => {
        console.log(`PAGE ERROR:`, error.message);
    });

    try {
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
        console.log('Page loaded successfully without crashing the script entirely.');
    } catch (e) {
        console.error('Navigation failed', e);
    }
    await browser.close();
})();
