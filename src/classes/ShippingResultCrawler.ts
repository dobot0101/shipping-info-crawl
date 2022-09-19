export type ShippingCompany =
  | 'CJ_DAEHAN'
  | 'LOGEN'
  | 'POST_OFFICE'
  | 'HANJIN'
  | 'LOTTE';

export class ShippingResultCrawler {
  /**
   * 배송 완료 여부 학인
   */
  checkShippingComplete(
    $: cheerio.Root,
    company: ShippingCompany,
    shippingCompleteWord: string
  ) {
    let isShippingComplete = false;
    if (company === 'LOGEN') {
      if (
        $(`ul.tkStep li.on`)
          .contents()
          .filter((idx: number, el: cheerio.Element) => el.type === 'text')
          .text() === shippingCompleteWord
      ) {
        isShippingComplete = true;
      }
    } else if (company === 'LOTTE') {
      if (
        $(`table.tblH.mt60 > tbody > tr > td`).eq(3).text() ===
        shippingCompleteWord
      ) {
        isShippingComplete = true;
      }
    } else if (company === 'HANJIN') {
      if (
        $('div.delivery-time > p.comm-sec > strong').text() ===
        shippingCompleteWord
      ) {
        isShippingComplete = true;
      }
    }
    return isShippingComplete;
  }

  /**
   * 택배사 별 배송 완료를 뜻하는 단어
   * @param company 택배사 이름
   * @returns
   */
  getShippingCompleteWordByCompany(company: ShippingCompany) {
    if (company === 'HANJIN' || company === 'LOGEN') {
      return '배송완료';
    } else {
      return '배달완료';
    }
  }

  /**
   * 택배사별 배송 완료 확인 url 구하기
   * @param company 택배사 명
   * @param number 송장 번호
   * @returns
   */
  getCrawlUrlByCompanyAndNumber(company: ShippingCompany, number: string) {
    let url = '';
    switch (company) {
      case 'CJ_DAEHAN':
        url = 'http://nexs.cjgls.com/web/info.jsp?slipno=';
        break;
      case 'LOGEN':
        url = 'https://www.ilogen.com/web/personal/trace/';
        break;
      case 'POST_OFFICE':
        url =
          'https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?displayHeader=N&sid1=';
        break;
      case 'HANJIN':
        url =
          'https://www.hanjin.co.kr/kor/CMS/DeliveryMgr/WaybillResult.do?mCode=MN038&schLang=KR&wblnumText2=';
        break;
      case 'LOTTE':
        url =
          'https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo=';
        break;
    }

    if (!url) {
      throw new Error('배송 확인 url이 존재하지 않습니다.');
    }

    url = url + number;
    return url;
  }
}
