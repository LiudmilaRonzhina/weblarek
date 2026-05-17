import { iProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Basket {
    private items: iProduct[] = [];

    constructor(protected events: IEvents) {    
    }

    getItems(): iProduct[] {
        return this.items;
    }

    addItem(product: iProduct): void {
        this.items.push(product);
        this.events.emit('basket:changed', this.items);   
    }

    removeItem(id: iProduct["id"]): void {
        this.items = this.items.filter(item => item.id !== id);
        this.events.emit('basket:changed', this.items);   
    }

    clearBasket(): void {
        this.items = [];
        this.events.emit('basket:changed', this.items);   
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getTotalCount(): number {
        return this.items.length;
    }

    containsItem(id: iProduct["id"]): boolean {
        return this.items.some(item => item.id === id);
    }
}