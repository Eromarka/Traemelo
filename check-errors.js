const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:5173/profile';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    } else {
      console.log(`Log: ${msg.text()}`);
    }
  });

  page.on('pageerror', exception => {
    errors.push(`Uncaught exception: ${exception}`);
  });

  try {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 15000 });
    console.log('Page loaded successfully');
  } catch(e) {
    console.log('Error loading page:', e.message);
  }

  console.log('--- CAPTURED ERRORS ---');
  if(errors.length === 0) {
    console.log('No errors captured');
  } else {
    for (const err of errors) {
      console.log(err);
    }
  }

  await browser.close();
})();
