
const puppeteer = require('puppeteer');

// Generate a random number between 12 and 8 (up to 1 decimal place)
function getRandomWalkValue() {
    return (Math.random() * (12 - 8) + 8).toFixed(1);
}

// Manual wait function
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    for (let i = 0; i < 176; i++) {
        console.log(`Iteration ${i + 1}:`);

        // Go to the survey page
        await page.goto('https://app.arconline.io/app/project/8000032729/survey?key=QuAru1jUW6AUxmruRZlOsTfL&language=en', { waitUntil: 'networkidle2' });
        console.log("Page loaded");


       

        // Wait for the dropdown button and click it
        await page.waitForSelector('.btn-survey');
        await page.click('.btn-survey');
        console.log("Dropdown opened");

        // Wait for the Walk input field and type a value
        await page.waitForSelector('.bus_input');
        
        const randomWalkValue = getRandomWalkValue();
        
        // Simulate typing the value into the input field and ensure it's saved
        await page.evaluate((value) => {
            const input = document.querySelector('.bus_input');
            input.focus();  // Focus on the input field
            input.value = value; // Set the input value directly
            input.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
            input.blur();   // Trigger blur event to register the value
        }, randomWalkValue);
        console.log("Typed value into Walk input:", randomWalkValue);

        // Wait for 1 second to ensure the blur event completes and the value is registered
        // await wait(1000);

        // Wait for the Next button to appear and be clickable
        // await page.waitForSelector('[arc-btn="goToStepHE"]', { visible: true });

        // Wait for the SAVE button inside the dropdown and click it
        await page.waitForSelector('[arc-btn="updateRoute"]', { visible: true });
        await page.click('[arc-btn="updateRoute"]');
        console.log("Save button clicked");

        // Add a custom wait for user action to click the Next button
        await page.waitForFunction(
            () => document.querySelector('[arc-btn="goToStepHE"]').matches(':hover'),
            { timeout: 300000 } // Adjust timeout if needed
        );

        // Click the Next button programmatically after manual click
        // await page.click('[arc-btn="goToStepHE"]');
        // console.log("Next button clicked");


        // Simulate a user clicking the Next button by dispatching events
        await page.evaluate(() => {
        const nextButton = document.querySelector('[arc-btn="goToStepHE"]');
    
        if (nextButton) {
        nextButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        nextButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        nextButton.click(); // Trigger click event
            }
        });
        console.log("Next button clicked with events");


        // Wait for the Next button and click it
        // await page.waitForSelector('[arc-btn="goToStepHE"]', { visible: true });
        // await page.click('[arc-btn="goToStepHE"]');
        // console.log("Next button clicked");

        // Move the slider to "Extremely Satisfied"
        await page.waitForSelector('.rangeslider__handle', { visible: true });
        
        await page.evaluate(() => {
            const slider = document.querySelector('.rangeslider__handle');
            const sliderWidth = slider.parentElement.offsetWidth; // Get the slider's container width
            const sliderHandleWidth = slider.offsetWidth; // Get the handle width
            const targetPosition = sliderWidth - sliderHandleWidth; // Calculate the position for "Extremely Satisfied"
            
            // Move slider to target position
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: slider.getBoundingClientRect().left + targetPosition,
                clientY: slider.getBoundingClientRect().top,
            });
            const mouseMoveEvent = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: slider.getBoundingClientRect().left + targetPosition,
                clientY: slider.getBoundingClientRect().top,
            });
            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            
            slider.dispatchEvent(mouseDownEvent);
            slider.dispatchEvent(mouseMoveEvent);
            slider.dispatchEvent(mouseUpEvent);
        });
        console.log("Slider moved to Extremely Satisfied");

        // Wait for the Submit button and click it
        await page.waitForSelector('[arc-btn="submitSurvey"]', { visible: true });
        await page.click('[arc-btn="submitSurvey"]');
        console.log("Submit button clicked");

        // // Wait for 5 seconds before refreshing the page
        // await wait(5000);

        // // Refresh the page for the next iteration
        // await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
        // console.log("Page refreshed");



        // Wait for the submission to complete
        await wait(1000);

        // Refresh the page for the next iteration
        await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
        console.log("Page refreshed for the next survey");

        // Optionally: Manually refresh CSRF token after page load
        // const newToken = await page.evaluate(() => {
        //     return document.querySelector('input[name="csrf_token"]').value;  // Example of CSRF token
        // });
        // console.log("New token retrieved:", newToken);
    }

    // Close the browser after 5 iterations
    await browser.close();
    console.log("Browser closed after 5 iterations.");
})().catch(error => {
    console.error("Error during automation:", error);
});



