const puppeteer = require("puppeteer");

const DELAY = 500;
const coordinate = async (coor) => {
  try {
    console.log("좌표 검색을 실행합니다.");

    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    await page.goto("http://ongab.ru/login");

    await page.type('input[name="email"]', process.env.ID);
    await page.type('input[name="pwd"]', process.env.PW);
    await page.keyboard.press("Enter");

    await page.waitForTimeout(DELAY);
    await page.goto(
      "http://ongab.ru/archeage/map/12/-1.0988410221718x1.2247068421054?m=88009,88017,88095&i=88095"
    );
    await page.click(".dismissButton");

    await page.waitForTimeout(DELAY);

    await page.click('li.mym input[type="checkbox"]');
    await page.click('li.mym input[type="checkbox"]');

    await page.mouse.click(300, 300, { button: "right" });
    await page.waitForTimeout(DELAY);
    await page.select("select#dlngk", coor[0]);
    await page.$eval("#dlngd", (el) => (el.value = ""));
    await page.type("#dlngd", coor[1]);
    await page.$eval("#dlngm", (el) => (el.value = ""));
    await page.type("#dlngm", coor[2]);
    await page.$eval("#dlngs", (el) => (el.value = ""));
    await page.type("#dlngs", coor[3]);
    await page.select("select#dlatk", coor[4]);
    await page.$eval("#dlatd", (el) => (el.value = ""));
    await page.type("#dlatd", coor[5]);
    await page.$eval("#dlatm", (el) => (el.value = ""));
    await page.type("#dlatm", coor[6]);
    await page.$eval("#dlats", (el) => (el.value = ""));
    await page.type("#dlats", coor[7]);

    await page.type('input[name="title"]', "A");
    await page.evaluate(() => {
      const button = document.querySelector("a.btn-success");
      button.click();
    });
    await page.waitForTimeout(DELAY * 5);

    const element = await page.$('div[title][role="button"][tabindex="0"]');
    const location = await element.boundingBox();

    // 요소를 화면 중앙으로 이동시키기 위해 드래그 앤 드롭 수행
    const centerX = page.viewport().width / 2;
    const centerY = page.viewport().height / 2;
    await page.mouse.move(
      location.x + location.width / 2,
      location.y + location.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(centerX, centerY, { steps: 20 });
    await page.mouse.up();

    await page.waitForTimeout(DELAY * 5);

    const button = await page.$("button.gm-fullscreen-control");
    await button.click();

    await page.screenshot({ path: "coordinate.png" });

    await browser.close();
  } catch (e) {
    console.log(e);
  }
};

// coordinate();

module.exports = coordinate;
