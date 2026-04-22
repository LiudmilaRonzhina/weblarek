// src/components/models/AppApi.ts
import {  IOrder, IOrderResult, IProductsResponse } from '../../types';
import { Api } from '../base/Api';

export class AppApi {
    private api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    // GET запрос на /product/ - получаем объект с total и items
    async getProducts(): Promise<IProductsResponse> {
        const response = await this.api.get<IProductsResponse>('/product/');
        return response;
    }

    // POST запрос на /order - отправляем данные заказа
    async postOrder(order: IOrder): Promise<IOrderResult> {
        return await this.api.post<IOrderResult>('/order', order);
    }
}