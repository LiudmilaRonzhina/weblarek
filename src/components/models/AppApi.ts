
import { IProduct, IOrder, IOrderResult, IProductsResponse, IApi } from '../../types';

export class AppApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    // GET запрос на /product/ - получаем объект с total и items
    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<IProductsResponse>('/product/');
        return response.items;
    }

    // POST запрос на /order - отправляем данные заказа
    async postOrder(order: IOrder): Promise<IOrderResult> {
        return await this.api.post<IOrderResult>('/order', order);
    }
}