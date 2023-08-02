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
log("proxys",proxys);
class Commom{
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
}
export default Commom;