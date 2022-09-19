import './dotConfig';
import axios from 'axios';
import cheerio from 'cheerio';
import { getPostOfficeDeliveryInfo } from './lib/shipping/postOffice';
import { getLotteDeliveryInfo } from './lib/shipping/lotte';
import { getHanjinDeliveryInfo } from './lib/shipping/hanjin';
import { getLogenDeliveryInfo } from './lib/shipping/logen';

type ShippingCompany =
  | 'CJ_DAEHAN'
  | 'LOGEN'
  | 'POST_OFFICE'
  | 'HANJIN'
  | 'LOTTE';

type ShippingInfo = {
  company: ShippingCompany;
  number: string;
};

async function main() {
  if (!process.env.TEST_SHIPPING_DATA4) {
    throw new Error(`테스트 데이터가 없습니다.`);
  }

  const { company, number }: ShippingInfo = JSON.parse(
    process.env.TEST_SHIPPING_DATA4!
  );

  let deliveryInfo: { url: string; finished: boolean };
  switch (company) {
    case 'POST_OFFICE':
      deliveryInfo = await getPostOfficeDeliveryInfo(number);
      break;
    case 'LOTTE':
      deliveryInfo = await getLotteDeliveryInfo(number);
      break;
    case 'HANJIN':
      deliveryInfo = await getHanjinDeliveryInfo(number);
      break;
    case 'LOGEN':
      deliveryInfo = await getLogenDeliveryInfo(number);
      break;
    default:
      throw new Error('처리할 수 없는 택배사입니다.');
  }

  console.log(deliveryInfo);
}

main()
  .catch(console.log)
  .finally(() => process.exit());
