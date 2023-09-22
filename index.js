import debug from "debug";
const log = debug("index");
import puppeteer from "puppeteer";
import Common from "./common/common.js";
const common = new Common();
const listBrowser = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
]
const auto  = async (executablePath)=>{
    try{
        let config = {
            headless: false,
            defaultViewport:null,
            executablePath:executablePath 
        }
        const browser = await puppeteer.launch({
            ...config,
        });
        const proxyData = common.proxyData();
        // log("proxyData",proxyData);
        if (proxyData !== undefined && proxyData["host"] !== undefined && proxyData["port"] !== undefined) {
            let profileServer = `${proxyData["type"]}://${proxyData["host"]}:${proxyData["port"]}`;
            config['args'] = [`--proxy-server=${profileServer}`];
        }
        log("config",config);
        let page = null;
        const pages = await browser.pages()
        if(pages.length>0){
            page =  pages[0]
        }else{
            page = await browser.newPage();
        }

        await page.setExtraHTTPHeaders({
            'accept': '*/*',
            'User-Agent': common.userAgent(),
        });
        if (proxyData !== undefined && proxyData["username"] !== undefined && proxyData["username"] !== "" && proxyData["password"] !== undefined && proxyData["password"] !== "") {
            await page.authenticate({username: proxyData["username"], password: proxyData["password"]});
        }
        await page.goto("https://www.taoanhpro.com/", {
            timeout: 60000,
        });
        await common.scrollToBottomToTop(page);
        await common.clickRandom(page,".post-home-item a")
        await page.goBack();
        await common.clickRandomIframe(page,"iframe","[href*='googleadservices.com']")
        await common.clickRandom(page,"a[href]");
        await common.delay(30000);
        await browser.close();
        log("Done");
        await auto( listBrowser[Math.floor(Math.random() * listBrowser.length)]);
    }catch(e){
        console.error('Lỗi xảy ra:', e.message);
        await common.delay(10000);
        await auto( listBrowser[Math.floor(Math.random() * listBrowser.length)]);
    }
}
(async () => {
    let listPromise = [];
    for (let i = 0;i<2; i++) {
        listPromise.push(auto( listBrowser[Math.floor(Math.random() * listBrowser.length)]));
    }
    await Promise.all(listPromise);
})();