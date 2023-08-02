import debug from "debug";
const log = debug("index");
import puppeteer from "puppeteer";
import Common from "./common/common.js";
const auto  = async ()=>{
    const common = new Common();
    let config = {
        headless: false,
        defaultViewport:false,
    }
    const proxyData = common.proxyData();
    log("proxyData",proxyData);
    if (proxyData !== undefined && proxyData["host"] !== undefined && proxyData["port"] !== undefined) {
        let profileServer = `${proxyData["type"]}://${proxyData["host"]}:${proxyData["port"]}`;
        config['args'] = [`--proxy-server=${profileServer}`, `--no-sandbox`];
    }
    log("config",config);
    const browser = await puppeteer.launch({
        ...config,
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'accept': '*/*',
        'User-Agent': common.userAgent(),
    });
    if (proxyData !== undefined && proxyData["username"] !== undefined && proxyData["username"] !== "" && proxyData["password"] !== undefined && proxyData["password"] !== "") {
        await page.authenticate({username: proxyData["username"], password: proxyData["password"]});
    }
    /**
     * Search Google
     */
    log("Search Google");
    await page.goto("https://www.taoanhpro.com/", {
        timeout: 60000,
    });
    /**
     * Search Google Keyword tạo ảnh
     */
    await page.waitForSelector("input[name='q']");
    const searchKeywords = ["tạo anh","tao anh pro","Bàn thờ troll"];
    const searchKeywor = searchKeywords[Math.floor(Math.random() * searchKeywords.length)];
    log("Search Google Keyword : ", searchKeywor);
    await page.type("input[name='q']",searchKeywor,{delay: 250});
    await page.keyboard.press("Enter");
    await page.waitForNavigation({timeout: 3000,waitUntil:"networkidle0"});
    /**
     * Click vào link taoanhpro.com
     */
    await page.waitForTimeout(3000);
    const listA = await page.$$("a[href*='taoanhpro.com']");
    if (listA.length > 0) {
        log("Click vào link taoanhpro.com");
        await listA[0].click();
    }
    /**
     * scroll to bottom by step 100px
     */
    await page.waitForTimeout(3000);
    log("Scroll to bottom");
    await common.scrollToBottom(page);
    await page.waitForTimeout(3000);
    log("Scroll to top");
    await common.scrollToTop(page);
    const postItems = await page.$$(".post-home-item a");
    console.log("postItems",postItems.length);
    /**
     * click vào 1 bài viết bất kỳ random rồi chờ 10s
     */
    if (postItems.length > 0) {
        log("Click vào 1 bài viết bất kỳ random rồi chờ 10s");
        let item = postItems[Math.floor(Math.random() * postItems.length)];
        await item.click();
        await page.waitForTimeout(3000);
        await common.scrollToBottom(page);
        await page.waitForTimeout(3000);
        await common.scrollToTop(page);
        await page.goBack();
    }
    await browser.close();
    log("Done");
    await auto();
}
(async () => {
    let listPromise = [];
    for (let i = 0; i <1; i++) {
        listPromise.push(auto());
    }
    await Promise.all(listPromise);
})();