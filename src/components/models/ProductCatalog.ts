
import {iProduct} from '../../types'; 


export class ProductCatalog {
  private ProductList: iProduct[] = [] ;
  private ProductCard: iProduct | null = null;

constructor() {
  }


setItems(items: iProduct[]): void {
  this.ProductList = items;
}

getItems(): iProduct[] {
  return  this.ProductList;
}

// получение одного товара по ID
getItemByID(ID: iProduct["id"]): iProduct | undefined{
  return this.ProductList.find(product => product.id === ID);
}

// сохранение товара для подробного отображения;
chooseProductCard(product: iProduct ): void {
  this.ProductCard = product;
}

// получение товара для подробноего отображения;
getProductCard(): iProduct | null {
 return this.ProductCard ;
}

}

  
