import { iProduct } from '../../types';
import { IEvents } from '../base/Events';

export class ProductCatalog {
  private ProductList: iProduct[] = [];
  private ProductCard: iProduct | null = null;

  constructor(protected events: IEvents) {    
  }

  setItems(items: iProduct[]): void {
    this.ProductList = items;
    this.events.emit('catalog:changed', this.ProductList);   
  }

  getItems(): iProduct[] {
    return this.ProductList;
  }

  getItemByID(ID: iProduct["id"]): iProduct | undefined {
    return this.ProductList.find(product => product.id === ID);
  }

  chooseProductCard(product: iProduct): void {
    this.ProductCard = product;
    this.events.emit('catalog:selected', this.ProductCard);   
  }

  getProductCard(): iProduct | null {
    return this.ProductCard;
  }
}