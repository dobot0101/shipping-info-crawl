import axios from 'axios';
import cheerio from 'cheerio';

type LotteDeliveryInfo = {
  url: string;
  finished: boolean;
};
export async function getLotteDeliveryInfo(
  shippingNumber: string
): Promise<LotteDeliveryInfo> {
  const url = `https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo=${shippingNumber}`;

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html, { decodeEntities: false });

    let finished = false;
    if ($(`table.tblH.mt60 > tbody > tr > td`).eq(3).text() === '배달완료') {
      finished = true;
    }

    return { url, finished };
  } catch (error) {
    console.error(error);
    return { url, finished: false };
  }
}
