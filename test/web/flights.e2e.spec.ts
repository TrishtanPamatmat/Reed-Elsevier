// test/web/flights.e2e.spec.ts
import { expect } from 'chai';

describe('CUJ: Cheapflights Navigation Header Verification', () => {

    before(async () => {
        await browser.setWindowSize(1920, 1080);
        await browser.url('https://www.cheapflights.com.au/');
    });

    it('Positive: Should display logo and login button with correct positioning', async () => {
    // Exact selectors derived from your DOM snippets
    const logo = $('a[aria-label="Go to the cheapflights homepage"]');
    const loginBtn = $('div[role="button"][aria-label="Sign in"]');

    // Explicit waits to ensure layout rendering finishes before assertions
    await logo.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Logo failed to display' });
    await loginBtn.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Sign in button failed to display' });

    // Display assertions
    expect(await logo.isDisplayed()).to.be.true;
    expect(await logo.isExisting()).to.be.true;
    expect(await logo.isEnabled()).to.be.true;
    expect(await loginBtn.isDisplayed()).to.be.true;
    expect(await loginBtn.isExisting()).to.be.true;
    expect(await loginBtn.isEnabled()).to.be.true;

    const logoLoc = await logo.getLocation();
    const loginLoc = await loginBtn.getLocation();

    // Logo coordinates check (72, 30)
    expect(logoLoc.x).to.be.closeTo(72, 5, 'Logo X position should be near 72');
    expect(logoLoc.y).to.be.closeTo(30, 5, 'Logo Y position should be near 30');

    // Login button coordinates check (1829, 18)
    expect(loginLoc.x).to.be.closeTo(1829, 5, 'Sign-in button X position should be near 1829');
    expect(loginLoc.y).to.be.closeTo(18, 5, 'Sign-in button Y position should be near 18');

    // Relative layout check
    expect(logoLoc.x).to.be.below(loginLoc.x, 'Logo should be to the left of Sign-in button')
});

it('Positive: Should execute flight search and verify results', async () => {
    // 1. Check for and clear pre-populated origin chip (e.g., Manila)
    const clearOriginChip = $('div[aria-label="Remove value"]');
    if (await clearOriginChip.isDisplayed()) {
        await clearOriginChip.click();
    }

    // 2. Set new Origin value
    const originInput = $('input[aria-label="Origin location"]');
    await originInput.waitForDisplayed({ timeout: 10000 });
    await originInput.click();
    await originInput.setValue('SYD');

    const originInputLoc = await originInput.getLocation();

    // Origin input coordinates check (330, 456)
    expect(originInputLoc.x).to.be.closeTo(330, 5, 'Origin input X position should be near 330');
    expect(originInputLoc.y).to.be.closeTo(456, 5, 'Origin input Y position should be near 456');

    // 3. Wait for autocomplete list item to appear and select it explicitly
    const sydneyOption = $('[role="option"]*=Sydney');
    await sydneyOption.waitForDisplayed({ timeout: 10000 });
    await sydneyOption.click();

    // 4. Target and interact with Destination input
    const destInput = $('input[aria-label="Destination location"]');
    await destInput.waitForDisplayed({ timeout: 10000 });
    await destInput.click();
    await destInput.setValue('MNL');

    const destInputLoc = await destInput.getLocation();

    // Destination input coordinates check (578, 456)
    expect(destInputLoc.x).to.be.closeTo(578, 5, 'Destination input X position should be near 578');
    expect(destInputLoc.y).to.be.closeTo(456, 5, 'Destination input Y position should be near 456');

    // 5. Wait for the dropdown option to populate and click the Manila result
    const mnlOption = $('[role="option"]*=MNL');
    await mnlOption.waitForDisplayed({ timeout: 10000 });
    await mnlOption.click();

    // 6. Target and click the Departure date picker
    const departureDateBtn = $('div[aria-label="Departure date"]');
    await departureDateBtn.waitForClickable({ timeout: 10000 });
    await departureDateBtn.click();

    const departureDateLoc = await departureDateBtn.getLocation();

    // Departure date picker coordinates check (797, 440)
    expect(departureDateLoc.x).to.be.closeTo(797, 5, 'Departure date picker X position should be near 797');
    expect(departureDateLoc.y).to.be.closeTo(440, 5, 'Departure date picker Y position should be near 440');

    // 7. Click 'Next month' button to advance calendar view
    const nextMonthBtn = $('div[aria-label="Next month"]');
    await nextMonthBtn.waitForClickable({ timeout: 10000 });
    await nextMonthBtn.click();

    // 8. Select September 1, 2026
    const sept1Date = $('div[aria-label*="September 1 2026"]');
    await sept1Date.waitForClickable({ timeout: 10000 });
    await sept1Date.click();

    // 9. Target and click the Return date picker
    const returnDateBtn = $('div[aria-label="Return date"]');
    await returnDateBtn.waitForClickable({ timeout: 10000 });
    await returnDateBtn.click();

    const returnDateLoc = await returnDateBtn.getLocation();

    // Return date picker coordinates check (905, 440)
    expect(returnDateLoc.x).to.be.closeTo(905, 5, 'Return date picker X position should be near 905');
    expect(returnDateLoc.y).to.be.closeTo(440, 5, 'Return date picker Y position should be near 440');

    // 10. Select September 30, 2026
    const sept30Date = $('div[aria-label*="September 30 2026"]');
    await sept30Date.waitForClickable({ timeout: 10000 });
    await sept30Date.click();

    // 11. Target and open the traveler selection modal/dropdown
    const travelerTypeBtn = $('#ffd-traveler-type-handle');
    await travelerTypeBtn.waitForDisplayed({ timeout: 10000 });
    const actualText = await travelerTypeBtn.getText();
    expect(actualText.trim()).to.equal('1 adult, Economy');

    await travelerTypeBtn.waitForClickable({ timeout: 10000 });
    await travelerTypeBtn.click();

    // Target the Adult increment button
    const adultIncrementBtn = $('button[aria-label="Increment"]');
    await adultIncrementBtn.waitForClickable({ timeout: 10000 });

    // Click 4 times to increase passenger count from 1 to 5
    for (let i = 0; i < 4; i++) {
    await adultIncrementBtn.click();}

    // Target and click the First class option label/text
    const firstClassOption = $('label[aria-label="First"]');
    await firstClassOption.waitForClickable({ timeout: 10000 });
    await firstClassOption.click();
    await travelerTypeBtn.click(); // Close the traveler modal/dropdown

    const newTravelerText = await travelerTypeBtn.getText();
    
    // Re-fetch fresh text and assert
    expect(newTravelerText.trim()).to.equal('5 travellers, First');
    
    const travelerLoc = await travelerTypeBtn.getLocation();

    // Traveler type button coordinates check (997, 440)
    expect(travelerLoc.x).to.be.closeTo(997, 5, 'Traveler type button X position should be near 997');
    expect(travelerLoc.y).to.be.closeTo(440, 5, 'Traveler type button Y position should be near 440');

    // 12. Target the Search button via aria-label
    const searchBtn = await $('button[aria-label="Search"]');
    await searchBtn.waitForClickable({ timeout: 10000 });
    await searchBtn.click();

    // 13. Wait for page to navigate to the exact search results URL
    const expectedUrlPath = 'flight-search/SYD-MNL/2026-09-01/2026-09-30/first/5adults';

    await browser.waitUntil(
        async () => (await browser.getUrl()).includes(expectedUrlPath),
        {
            timeout: 15000,
            timeoutMsg: `Expected URL to contain "${expectedUrlPath}"`
        }
);

    // Assert current URL with Chai
    const currentUrl = await browser.getUrl();
    expect(currentUrl).to.include(expectedUrlPath);

    // Pause briefly for visual confirmation
    await browser.pause(5000);

});

});