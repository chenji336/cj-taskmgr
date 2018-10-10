import { GB2260 } from './identity.data';

// 通过id号码获取地址和生日
export const extractInfo = (idNo: string) => {
  const addrPart = idNo.substring(0, 6);
  const birthPart = idNo.substring(6, 14);
  return {
    addrCode: addrPart,
    dateOfBirth: birthPart
  };
};

// 前六位可以知道是否是有效地址，如果不在identity.data中则无效
export const isValidAddr = (addr: string) => {
  return GB2260[addr] !== undefined;
};

export const getAddrByCode = (code: string) => {
  const province = GB2260[code.substring(0, 2) + '0000'];
  const city = GB2260[code.substring(0, 4) + '00'].replace(province, ''); // 自治区：比如北京省市就是一体的
  const district = GB2260[code].replace(province + city, '');
  return {
    province: province,
    city: city,
    district: district
  };
}