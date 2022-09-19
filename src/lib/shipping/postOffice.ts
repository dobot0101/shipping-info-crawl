import axios from 'axios';
import cheerio from 'cheerio';

type PostOfficeDeliveryInfo = {
  url: string;
  finished: boolean;
};
export async function getPostOfficeDeliveryInfo(
  shippingNumber: string
): Promise<PostOfficeDeliveryInfo> {
  const url = `https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?displayHeader=N&sid1=${shippingNumber}`;

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html, { decodeEntities: false });

    let finished = false;
    if (
      $(`table.table_col:eq(0) > tbody > tr > td`).eq(4).text() === '배달완료'
    ) {
      finished = true;
    }

    return { url, finished };
  } catch (error) {
    console.error(error);
    return { url, finished: false };
  }
}
