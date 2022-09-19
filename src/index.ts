import './dotConfig';
import axios from 'axios';
import cheerio from 'cheerio';
import {
  ShippingCompany,
  ShippingResultCrawler,
} from './classes/ShippingResultCrawler';

async function main() {
  // const testShippingDatas = JSON.parse(process.env.TEST_SHIPPING_DATAS);
  // for (const testShippingData of testShippingDatas) {
  if (!process.env.TEST_SHIPPING_DATA1) {
    throw new Error(`테스트 데이터가 없습니다.`);
  }

  const { company, number } = JSON.parse(process.env.TEST_SHIPPING_DATA1!);

  console.log(company, number);

  const shippingResultCrawler = new ShippingResultCrawler();

  const url = shippingResultCrawler.getCrawlUrlByCompanyAndNumber(
    company,
    number
  );

  const shippingCompleteWord =
    shippingResultCrawler.getShippingCompleteWordByCompany(company);

  try {
    const { data: html } = await axios.get(url);

    const $ = cheerio.load(html, { decodeEntities: false });

    const isShippingComplete = shippingResultCrawler.checkShippingComplete(
      $,
      company,
      shippingCompleteWord
    );

    console.log({ isShippingComplete });
  } catch (error: any) {
    throw new Error(error.message);
  }
  // }
}

main()
  .catch(console.log)
  .finally(() => process.exit());
