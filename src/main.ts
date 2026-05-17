import './scss/styles.scss';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket as BasketModel } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { AppApi } from './components/models/AppApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate } from './utils/utils';
import { iProduct } from './types';

// View компоненты
import { Success } from './components/views/Success';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { Modal } from './components/views/Modal';
import { CardBasket } from './components/views/CardBasket';
import { Basket } from './components/views/Basket';
import { Order } from './components/views/Order';
import { Contacts } from './components/views/Contacts';

// ========== ИНИЦИАЛИЗАЦИЯ ==========
const events = new EventEmitter();

// API
const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

// Модели
const productsModel = new ProductCatalog(events);
const basketModel = new BasketModel(events);
const buyerModel = new Buyer(events);

// View компоненты (статические) – создаём один раз
const header = new Header(events, document.querySelector('.header') as HTMLElement);
const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);
const modal = new Modal(events, document.querySelector('#modal-container') as HTMLElement);

// Экземпляры форм и корзины (один раз)
const basketView = new Basket(cloneTemplate<HTMLElement>('#basket'), {
    onCheckout: () => events.emit('basket:checkout')
});

const orderForm = new Order(cloneTemplate<HTMLFormElement>('#order'), {
    onInputChange: (field, value) => {
        if (field === 'payment') buyerModel.setData({ payment: value as 'card' | 'cash' });
        else if (field === 'address') buyerModel.setData({ address: value });
    },
    onSubmit: () => events.emit('order:submit')
});

const contactsForm = new Contacts(cloneTemplate<HTMLFormElement>('#contacts'), {
    onInputChange: (field, value) => {
        if (field === 'email') buyerModel.setData({ email: value });
        else if (field === 'phone') buyerModel.setData({ phone: value });
    },
    onSubmit: () => events.emit('contacts:submit')
});

const cardPreview = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), {
    onClick: () => {
        const selectedProduct = productsModel.getProductCard();
        if (selectedProduct) {
            if (basketModel.containsItem(selectedProduct.id)) {
                events.emit('preview:remove', selectedProduct);
            } else {
                events.emit('preview:add', selectedProduct);
            }
        }
    }
});

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function updateHeaderCounter() {
    header.counter = basketModel.getTotalCount();
}

function renderBasket() {
    const basketItems = basketModel.getItems();
    const cards = basketItems.map((item, index) => {
        const cardContainer = cloneTemplate<HTMLElement>('#card-basket');
        const card = new CardBasket(cardContainer, {
            onDelete: () => events.emit('basket:remove', { id: item.id })
        });
        card.render({
            title: item.title,
            price: item.price ?? 0,
            index: index + 1
        });
        return cardContainer;
    });
    basketView.items = cards;
    basketView.totalPrice = basketModel.getTotalPrice();
    basketView.buttonState = basketItems.length === 0;
}

// ========== СОБЫТИЯ МОДЕЛЕЙ ==========
events.on('catalog:changed', () => {
    const items = productsModel.getItems();
    const cards = items.map(item => {
        const cardContainer = cloneTemplate<HTMLElement>('#card-catalog');
        const card = new CardCatalog(cardContainer, {
            onClick: () => {
                productsModel.chooseProductCard(item);
                events.emit('card:select');
            }
        });
        return card.render(item);
    });
    gallery.catalog = cards;
});

events.on('basket:changed', () => {
    updateHeaderCounter();
    renderBasket();  
});

events.on('buyer:changed', () => {
    const buyerData = buyerModel.getAllData();
    const errors = buyerModel.validate();

    // Обновляем форму Order
    orderForm.payment = buyerData.payment;
    orderForm.address = buyerData.address;
    const orderErrorMessages = [errors.payment, errors.address].filter(Boolean).join(', ');
    orderForm.errors = orderErrorMessages;
    orderForm.isValid = !errors.payment && !errors.address;

    // Обновляем форму Contacts
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    const contactsErrorMessages = [errors.email, errors.phone].filter(Boolean).join(', ');
    contactsForm.errors = contactsErrorMessages;
    contactsForm.isValid = !errors.email && !errors.phone;
});

// ========== СОБЫТИЯ ОТ VIEW ==========
events.on('card:select', () => {
    const product = productsModel.getProductCard();
    if (!product) return;
    cardPreview.render({
        title: product.title,
        category: product.category,
        description: product.description,
        image: product.image
    });
    cardPreview.price = product.price;
    const inBasket = basketModel.containsItem(product.id);
    if (product.price === null) {
        cardPreview.buttonState = true;
        cardPreview.buttonText = 'Недоступно';
    } else {
        cardPreview.buttonState = false;
        cardPreview.buttonText = inBasket ? 'Удалить из корзины' : 'Купить';
    }
    modal.content = cardPreview.element;
    modal.open();
});

events.on('preview:add', (product: iProduct) => {
    basketModel.addItem(product);
    modal.close(); // закрываем модалку после добавления
});

events.on('preview:remove', (product: iProduct) => {
    basketModel.removeItem(product.id);
    modal.close(); // закрываем модалку после удаления
});

events.on('basket:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

events.on('basket:open', () => {
    modal.content = basketView.element;
    modal.open();
});

events.on('basket:checkout', () => {
    const buyerData = buyerModel.getAllData();
    orderForm.payment = buyerData.payment;
    orderForm.address = buyerData.address;
    orderForm.isValid = false; 
    modal.content = orderForm.element;
    modal.open();
});

events.on('order:submit', () => {
    const buyerData = buyerModel.getAllData();
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    contactsForm.isValid = false;
    modal.content = contactsForm.element;
});

events.on('contacts:submit', async () => {
    const orderData = buyerModel.getAllData();
    const items = basketModel.getItems().map(item => item.id);
    const total = basketModel.getTotalPrice();
    const errors = buyerModel.validate();
    if (Object.keys(errors).length > 0) {
        contactsForm.errors = Object.values(errors).join(', ');
        return;
    }
    try {
        const result = await appApi.postOrder({
            payment: orderData.payment!,
            address: orderData.address,
            email: orderData.email,
            phone: orderData.phone,
            total,
            items
        });
        basketModel.clearBasket();
        buyerModel.clearData();
        const successContainer = cloneTemplate<HTMLElement>('#success');
        const success = new Success(successContainer, {
            onClick: () => modal.close()
        });
        success.render({ totalPrice: result.total });
        modal.content = successContainer;
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        contactsForm.errors = 'Ошибка сервера. Попробуйте позже.';
    }
});

// ========== ЗАГРУЗКА ТОВАРОВ ==========
appApi.getProducts()
    .then(data => productsModel.setItems(data.items))
    .catch(err => console.error('Ошибка загрузки товаров:', err));