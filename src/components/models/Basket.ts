import { iProduct } from '../../types';


export class Basket {
    private items: iProduct[] = [];

    constructor() {
    }

    // получение массива товаров, которые находятся в корзине
    getItems(): iProduct[] {
        return this.items;
    }

    // добавление товара в корзину
    addItem(product: iProduct): void {
        this.items.push(product);
    }

    // удаление товара из корзины
    removeItem(id: iProduct["id"]): void {
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
    containsItem(id: iProduct["id"]): boolean {
        return this.items.some(item => item.id === id);
    }
}