import { IProduct } from '../../types';

export class Basket {
    private items: IProduct[] = [];

    constructor() {
        this.items = [];
    }

    // получение массива товаров, которые находятся в корзине
    getItems(): IProduct[] {
        return this.items;
    }

    // добавление товара в корзину
    addItem(product: IProduct): void {
        this.items.push(product);
    }

    // удаление товара из корзины
    removeItem(id: IProduct["id"]): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    // очистка корзины
    clearBasket(): void {
        this.items = [];
    }

    // получение стоимости всех товаров
    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    // получение количества товаров
    getTotalCount(): number {
        return this.items.length;
    }

    // проверка наличия товара по id
    containsItem(id: IProduct["id"]): boolean {
        return this.items.some(item => item.id === id);
    }
}