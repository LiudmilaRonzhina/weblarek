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

// View компоненты (статические)
const header = new Header(events, document.querySelector('.header') as HTMLElement);
const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);
const modal = new Modal(events, document.querySelector('#modal-container') as HTMLElement);

// Экземпляры форм и корзины (один раз)
const basketView = new Basket(cloneTemplate<HTMLElement>('#basket'), {
    onCheckout: () => events.emit('basket:checkout')
});

// Форма Order – только уведомления
const orderForm = new Order(cloneTemplate<HTMLFormElement>('#order'), {
    onInputChange: (field, value) => {
        events.emit('order:input', { field, value });
    },
    onSubmit: () => events.emit('order:submit')
});

// Форма Contacts – только уведомления
const contactsForm = new Contacts(cloneTemplate<HTMLFormElement>('#contacts'), {
    onInputChange: (field, value) => {
        events.emit('contacts:input', { field, value });
    },
    onSubmit: () => events.emit('contacts:submit')
});

// Превью карточки – только уведомление о клике
const cardPreview = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), {
    onClick: () => {
        events.emit('preview:buttonClick');
    }
});

// Success – создаём один раз
const successView = new Success(cloneTemplate<HTMLElement>('#success'), {
    onClick: () => modal.close()
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
    basketView.render({
    items: cards,
    totalPrice: basketModel.getTotalPrice(),
    buttonState: basketItems.length === 0
});
}

// ========== СОБЫТИЯ ОТ VIEW (презентер обрабатывает) ==========

// Каталог: клик по карточке -> передаём item в событии
events.on('catalog:changed', () => {
    const items = productsModel.getItems();
    const cards = items.map(item => {
        const cardContainer = cloneTemplate<HTMLElement>('#card-catalog');
        const card = new CardCatalog(cardContainer, {
            onClick: () => {
                events.emit('card:select', item); // передаём товар
            }
        });
        return card.render(item);
    });
    gallery.render({catalog: cards});
});

// Сохраняем выбранный товар в модель
events.on('card:select', (item: iProduct) => {
    productsModel.chooseProductCard(item);
    // модель сама сгенерирует 'catalog:selected'
});

// Рендерим превью по событию от модели
events.on('catalog:selected', () => {
    const product = productsModel.getProductCard();
    if (!product) return;
   const inBasket = basketModel.containsItem(product.id);

cardPreview.render({
    title: product.title,
    category: product.category,
    description: product.description,
    image: product.image,
    price: product.price,

    buttonState: product.price === null,

    buttonText:
        product.price === null ? 'Недоступно' : inBasket ? 'Удалить из корзины'  : 'Купить'
});
    modal.content = cardPreview.element;
    modal.open();
});

// Клик по кнопке в превью -> добавляем/удаляем товар
events.on('preview:buttonClick', () => {
    const product = productsModel.getProductCard();
    if (!product) return;
    if (basketModel.containsItem(product.id)) {
        basketModel.removeItem(product.id);
    } else {
        basketModel.addItem(product);
    }
    modal.close();
});

// Обработчики изменения полей форм
events.on('order:input', ({ field, value }: { field: string; value: string }) => {
    if (field === 'payment') buyerModel.setData({ payment: value as 'card' | 'cash' });
    else if (field === 'address') buyerModel.setData({ address: value });
});

events.on('contacts:input', ({ field, value }: { field: string; value: string }) => {
    if (field === 'email') buyerModel.setData({ email: value });
    else if (field === 'phone') buyerModel.setData({ phone: value });
});

// Обновление форм при изменении модели
events.on('buyer:changed',(data: { field: 'payment' | 'address' | 'email' | 'phone' }) => {

        const buyerData = buyerModel.getAllData();
        const errors = buyerModel.validate();

        // Обновление формы заказа
        if (data.field === 'payment' || data.field === 'address') {

            const orderErrors = [
                errors.payment,
                errors.address
            ]
                .filter(Boolean)
                .join(', ');

            orderForm.render({
                payment: buyerData.payment,
                address: buyerData.address,
                errors: orderErrors,
                isValid: !errors.payment && !errors.address
            });
        }

        // Обновление формы контактов
        if (data.field === 'email' || data.field === 'phone') {

            const contactsErrors = [
                errors.email,
                errors.phone
            ]
                .filter(Boolean)
                .join(', ');

            contactsForm.render({
                email: buyerData.email,
                phone: buyerData.phone,
                errors: contactsErrors,
                isValid: !errors.email && !errors.phone
            });
        }
    }
);

// Корзина
events.on('basket:changed', () => {
    updateHeaderCounter();
    renderBasket();
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
    const errors = buyerModel.validate();

    orderForm.render({
        payment: buyerData.payment,
        address: buyerData.address,
        errors: [errors.payment, errors.address]
            .filter(Boolean)
            .join(', '),

        isValid: !errors.payment && !errors.address
    });

    modal.content = orderForm.element;
    modal.open();
});


events.on('order:submit', () => {

    const buyerData = buyerModel.getAllData();
    const errors = buyerModel.validate();

    contactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        errors: [errors.email, errors.phone]
            .filter(Boolean)
            .join(', '),

        isValid: !errors.email && !errors.phone
    });

    modal.content = contactsForm.element;
});

// Отправка заказа
events.on('contacts:submit', async () => {
    const orderData = buyerModel.getAllData();
    const items = basketModel.getItems().map(item => item.id);
    const total = basketModel.getTotalPrice();

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
        successView.render({ totalPrice: result.total });
        modal.content = successView.element;
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        contactsForm.errors = 'Ошибка сервера. Попробуйте позже.';
    }
});

// ========== ЗАГРУЗКА ТОВАРОВ ==========
appApi.getProducts()
    .then(data => productsModel.setItems(data.items))
    .catch(err => console.error('Ошибка загрузки товаров:', err));