import { iProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductCatalog {
  private productList: iProduct[] = [];
  private productCard: iProduct | null = null;

  constructor(protected events: IEvents) {    
  }

  setItems(items: iProduct[]): void {
    this.productList = items;
    this.events.emit('catalog:changed');   
  }

  getItems(): iProduct[] {
    return this.productList;
  }

  getItemByID(ID: iProduct["id"]): iProduct | undefined {
    return this.productList.find(product => product.id === ID);
  }

  chooseProductCard(product: iProduct): void {
    this.productCard = product;
    this.events.emit('catalog:selected');   
  }

  getProductCard(): iProduct | null {
    return this.productCard;
  }
}