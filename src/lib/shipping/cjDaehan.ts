import axios from 'axios';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';

type CJDaehanDeliveryInfo = {
  url: string;
  finished: boolean;
};
export async function getCJDaehanDeliveryInfo(
  shippingNumber: string
): Promise<CJDaehanDeliveryInfo> {
  const url = `http://nexs.cjgls.com/web/info.jsp?slipno=${shippingNumber}`;

  try {
    const { data } = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    const html = iconv.decode(data, 'EUC-KR').toString();
    const $ = cheerio.load(html);

    let finished = false;
    const text = $('table').eq(0).find('td').eq(0).text();
    const splittedText = text.split('(')[1];
    const slicedText = splittedText.slice(0, splittedText.indexOf(')'));

    if (slicedText === '배달완료') {
      finished = true;
    }

    return { url, finished };
  } catch (error) {
    console.error(error);
    return { url, finished: false };
  }
}
