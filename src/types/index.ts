export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface iProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
 
export type TPayment = 'card' | 'cash' | null;

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
 
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

// ========== ДЛЯ РАБОТЫ С СЕРВЕРОМ ==========

export interface IProductsResponse {
    total: number;
    items: iProduct[];
}

export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IOrderError {
    error: string;
}

// ========== VIEW КОМПОНЕНТЫ (ДАННЫЕ ДЛЯ РЕНДЕРА) ==========

export interface IGallery {
    catalog: HTMLElement[];
}

export interface IHeaderData {
    counter: number;
}

export interface IModalData {
    content: HTMLElement | null;
}

export interface ISuccessData {
    totalPrice: number;
}

export interface ICardCatalogData {
    title: string;
    price: number;
    category: string;
    image: string;
}

export interface ICardPreviewData {
    title: string;
    price: number;
    category: string;
    description: string;
    image: string;
}

export interface ICardBasketData {
    title: string;
    price: number;
    index: number;
}

export interface IBasketData {
    items: HTMLElement[];
    totalPrice: number;
}

export interface IOrderData {
    payment: TPayment;
    address: string;
}



export interface IContactsData {
    email: string;
    phone: string;
}

export interface IFormData {
    isValid: boolean;
    errors: string;
}

// ========== ACTIONS ДЛЯ КОМПОНЕНТОВ ==========

export interface ICardCatalogActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICardPreviewActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICardBasketActions {
    onDelete: (event: MouseEvent) => void;
}

export interface IBasketActions {
    onCheckout: () => void;
}

export interface IOrderActions {
    onSubmit: (data: IOrderData) => void;
}

export interface IContactsActions {
    onSubmit: (data: IContactsData) => void;
}

export interface ISuccessActions {
    onClick: () => void;
}

export interface IHeaderActions {
    onBasketOpen: () => void;
}