import debug from "debug";
const log = debug("app:log");
import fs from "fs";
const proxys = fs.readFileSync("./proxy.txt", "utf-8").split("\n").map((item) => {
    const items = item.split(":");
    return {
        type: "http",
        host: items[0].replace(/\r/g, ''),
        port: items[1].replace(/\r/g, ''),
        username: items[2].replace(/\r/g, ''),
        password: items[3].replace(/\r/g, ''),
    }
});
class Commom{
    async  delay (milliseconds=500) {
        return new Promise(resolve => {
          setTimeout(resolve, milliseconds);
        });
    };
    // Hàm lấy kích thước của cửa sổ trình duyệt
    async getWindowSize(page) {
        const dimensions = await page.evaluate(() => {
            return {
                width: window.innerWidth,
                height: window.innerHeight,
            };
        });
        return dimensions;
    }
    // Hàm tạo số ngẫu nhiên trong khoảng từ min đến max (bao gồm cả max)
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    proxyData(){
        return proxys[Math.floor(Math.random() * proxys.length)];
    }
    userAgent=()=>{
        let osNames = ["Macintosh", "Windows", "Linux"];
        let osName = osNames[Math.floor(Math.random() * osNames.length)];
        let userAgents = [];
        for (let i = 0; i < 99; i++) {
            const version = Math.floor(Math.random() * 60) + 30;
            const profileAgent = `Mozilla/5.0 (${osName}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}.0.2183.${Math.floor(Math.random() * 100)} Safari/537.${version} Edg/${version}.0.960.0`;
            userAgents.push(profileAgent);
        }
        let result =  userAgents[Math.floor(Math.random() * userAgents.length)];
        return result;
     }
    /**
     * Scroll to Top
     * @param args : selector
     */
    async scrollToTop(page,selector="body") {
        try {
            const bodyHandle = await page.$(selector);
            const { height } = await bodyHandle.boundingBox();
            await bodyHandle.dispose();
            for (let y = height; y > 0; y -= 50) {
                await page.mouse.wheel({ deltaY: -50 });
                await page.waitForTimeout(100);
            }
        } catch (e) {
            return false;
        }
    }
    /**
     * Scroll to Bottom
     * @param args : selector
     */
    async scrollToBottom(page,selector="body") {
        try {
            const bodyHandle = await page.$(selector);
            const { height } = await bodyHandle.boundingBox();
            await bodyHandle.dispose();
            for (let y = 0; y < height; y += 50) {
                await page.mouse.wheel({ deltaY: 50 });
                await page.waitForTimeout(100);
            }
        } catch (e) {
            return false;
        }
    }
    async scrollToBottomToTop(page,ms=5000){
        log("scrollToBottom")
        await page.waitForTimeout(ms);
        await this.scrollToBottom(page);
        log("scrollToTop")
        await page.waitForTimeout(ms);
        await this.scrollToTop(page);
    }
    async clickRandom(page,selector=""){
        try{
            await page.waitForSelector(selector);
            const randomItems = await page.$$(selector);
            log("item random",randomItems.length);
            /**
             * click vào 1 bài viết bất kỳ random rồi chờ 10s
             */
            if (randomItems.length > 0) {
                log("Click vào 1 bài viết bất kỳ random rồi chờ 10s");
                let item = randomItems[Math.floor(Math.random() * randomItems.length)];
                await item.click();
                await this.scrollToBottomToTop(page)
            }
        }catch(e){
            log('clickRandom :' +selector, e.message);
        }
    }
    async clickRandomIframe(page,selectorIframe,selector){
        try {
            await page.waitForSelector(selectorIframe);
            const iframeElements = await page.$$(selectorIframe);
            if (iframeElements.length > 0) {
                let iframe = iframeElements[Math.floor(Math.random() * iframeElements.length)];
                const iframeElement = await iframe.contentFrame();
                await iframeElement.click(selector);
            }
        }catch(e){
            log('clickRandomIframe :' +selector, e.message);
        }
    }
}
export default Commom;