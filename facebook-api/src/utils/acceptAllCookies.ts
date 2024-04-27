import { Page } from 'puppeteer';
import { cookiesButtonValue } from './constants';

const findCookieAcceptButton = async (page: Page): Promise<void> => {
  const buttons = await page.$$('button');
  for (const button of buttons) {
    const buttonText = await (
      await button.getProperty('textContent')
    ).jsonValue();

    if (buttonText && cookiesButtonValue.includes(buttonText.trim())) {
      await button.evaluate((b) => b.scrollIntoView());

      // Use JavaScript click as a fallback
      await page.evaluate((b) => b.click(), button);
      break; // Break the loop once the button is clicked
    }
  }
};

export default findCookieAcceptButton;
