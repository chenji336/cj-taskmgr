import { city_data } from './area.data';

export const getProvinces = () => {
    const provinces = [];
    for(const province in city_data) {
        provinces.push(province);
    }
    return provinces;
}

export const getCitiesByProvince = (province: string) => {

    if (!province || !city_data[province]) {
        return [];
    }
    const cities = [];
    const val = city_data[province];
    for(const city in val) {
        cities.push(city);
    }
    return cities;
}

export const getAreaByCity = (province: string, city: string) => {
    if (!province || !city || !city_data[province][city]) {
        return [];
    }
    return city_data[province][city];
}