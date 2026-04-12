
import {IProduct} from '../../types'; 
import {apiProducts} from '../../utils/data';

export class ProductCatalog {
  private ProductList: IProduct[] = [] ;
  private ProductCard: IProduct | null = null;

constructor() {
    this.ProductList = []; 
    this.ProductCard = null;
  }


setItems(items: IProduct[]): void {
  this.ProductList = items;
}

getItems(): IProduct[] {
  return  this.ProductList;
}

// получение одного товара по ID
getItemByID(ID: IProduct["id"]): IProduct | undefined{
  return this.ProductList.find(product => product.id === ID);
}

// сохранение товара для подробного отображения;
chooseProductCard(product: IProduct ): void {
  this.ProductCard = product;
}

// получение товара для подробноего отображения;
getProductCard(): IProduct | null {
 return this.ProductCard ;
}

}

  
