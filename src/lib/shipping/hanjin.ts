import axios from 'axios';
import cheerio from 'cheerio';

type HanjinDeliveryInfo = {
  url: string;
  finished: boolean;
};
export async function getHanjinDeliveryInfo(
  shippingNumber: string
): Promise<HanjinDeliveryInfo> {
  const url = `https://www.hanjin.co.kr/kor/CMS/DeliveryMgr/WaybillResult.do?mCode=MN038&schLang=KR&wblnumText2=${shippingNumber}`;

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html, { decodeEntities: false });

    let finished = false;
    if ($('div.delivery-time > p.comm-sec > strong').text() === '배송완료') {
      finished = true;
    }

    return { url, finished };
  } catch (error) {
    console.error(error);
    return { url, finished: false };
  }
}
