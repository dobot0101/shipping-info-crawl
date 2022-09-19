import axios from 'axios';
import cheerio from 'cheerio';

type LogenDeliveryInfo = {
  url: string;
  finished: boolean;
};
export async function getLogenDeliveryInfo(
  shippingNumber: string
): Promise<LogenDeliveryInfo> {
  const url = `https://www.ilogen.com/web/personal/trace/${shippingNumber}`;

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html, { decodeEntities: false });

    let finished = false;
    if (
      $(`ul.tkStep li.on`)
        .contents()
        .filter((idx, el) => el.type === 'text')
        .text() === '배송완료'
    ) {
      finished = true;
    }

    return { url, finished };
  } catch (error) {
    console.error(error);
    return { url, finished: false };
  }
}
