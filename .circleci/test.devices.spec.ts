mport 'babel-polyfill'

import {assert} from 'chai'

import Promise from 'bluebird'

import parallel from 'mocha.parallel'

import {Builder, By, Key, until} from 'selenium-webdriver'

const kobitonServerUrl = 'https://api.kobiton.com/wd/hub'

const username = 'your Kobiton username'

const apiKey = 'your Kobiton api key'

let desiredCapabilities = [{

      sessionName:        'Automation test session on first device',

      sessionDescription: 'This is an example for Android web',

      deviceOrientation:  'portrait',

      captureScreenshots: true,

      browserName:        'chrome',

      deviceGroup:        'KOBITON',

      deviceName:         'Galaxy S5',

      platformName:       'Android'

      
}, {

      sessionName:        'Automation test session on second device',

      sessionDescription: 'This is an example for iOS web',

      deviceOrientation:  'portrait',

      captureScreenshots: true,

      browserName:        'safari',

      deviceGroup:        'KOBITON',

      deviceName:         'iPhone X',

      platformName:       'iOS'


}]

let driver

const buildDriver = (_caps) => {

      const caps = Object.assign({}, _caps)

      caps.username = username

      caps.accessKey = apiKey

      return new Builder()

        .usingServer(kobitonServerUrl)

        .withCapabilities(caps)

        .build()


}

parallel('Parallel Tests',() => {

    it('should return the title that contains Kobiton on first device', async () => {

            const driver = buildDriver(desiredCapabilities[0])

            await run(driver)

          
    })

    it('should return the title that contains Kobiton on second device', async () => {

            const driver = buildDriver(desiredCapabilities[1])

            await run(driver)

          
    })

    async function run(driver) {

        try {

                  await driver.get('http://www.google.com')

                  await driver.findElement(By.name('q')).sendKeys('Kobiton', Key.RETURN)

                  await driver.wait(until.titleContains('Kobiton'), 2000)

                  let msg = await driver.getTitle()

                  assert.include(msg, 'Kobiton')

                
        }

        finally {

            if (driver != null) {

                        await driver.quit()

                      
            }

                
        }

          
    }


})
