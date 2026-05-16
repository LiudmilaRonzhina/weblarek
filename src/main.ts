import './scss/styles.scss';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket as BasketModel } from './components/models/Basket'; // ← переименовали модель
import { Buyer } from './components/models/Buyer';
import { AppApi } from './components/models/AppApi';     
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/Events';

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



// Создаём экземпляр каталога
const productsModel = new ProductCatalog();

// Загружаем тестовые данные
productsModel.setItems(apiProducts.items);

// Проверяем результат
console.log('Массив товаров из каталога:', productsModel.getItems());

// Получаем первый товар по ID
const firstProduct = productsModel.getItemByID(apiProducts.items[0].id);
console.log('Получение товара по ID:', firstProduct);

// Сохраняем товар для подробного отображения (с проверкой)
if (firstProduct) {
    productsModel.chooseProductCard(firstProduct);
}

// Получаем сохранённый товар из карточки
console.log('Товар для подробного отображения (карточка):', productsModel.getProductCard());

/*
// ========== ПРОВЕРКА КОРЗИНЫ ==========
const basket = new Basket();

// Добавляем товары
basket.addItem(productsModel.getItems()[0]);
basket.addItem(productsModel.getItems()[1]);

console.log('Корзина - товары:', basket.getItems());
console.log('Корзина - количество:', basket.getTotalCount());
console.log('Корзина - стоимость:', basket.getTotalPrice());
console.log('Корзина - есть ли товар?', basket.containsItem(productsModel.getItems()[0].id));

// Удаляем товар
basket.removeItem(productsModel.getItems()[0].id);
console.log('Корзина - после удаления:', basket.getItems());

// Очищаем
basket.clearBasket();
console.log('Корзина - после очистки:', basket.getItems());
*/
// ========== ПРОВЕРКА ПОКУПАТЕЛЯ ==========
const buyer = new Buyer();

// Сохраняем данные по частям (другие поля не теряются)
buyer.setData({ payment: 'card' });
buyer.setData({ address: 'ул. Пушкина, д. 10' });
buyer.setData({ phone: '+7-999-123-45-67' });
buyer.setData({ email: 'user@example.com' });

console.log('1. Все данные покупателя:', buyer.getAllData());

// Проверка валидации (все поля заполнены)
console.log('2. Валидация (все поля заполнены):', buyer.validate());

// Обновляем только телефон
buyer.setData({ phone: '+7-888-555-33-22' });
console.log('3. Все данные после обновления телефона:', buyer.getAllData());

// Очищаем email
buyer.setData({ email: '' });
console.log('4. После очистки email:', buyer.getAllData());

// Проверка валидации (email пустой)
console.log('5. Валидация (email пустой):', buyer.validate());

// Очищаем все данные
buyer.clearData();
console.log('6. После полной очистки:', buyer.getAllData());

// Проверка валидации (все поля пустые)
console.log('7. Валидация (все поля пустые):', buyer.validate());


// ========== ЗАПРОС К СЕРВЕРУ ==========
console.log('\n========== ЗАПРОС К СЕРВЕРУ ==========');


// Создаём экземпляр Api (базовый URL из Postman)
const baseApi = new Api(API_URL);

// Создаём экземпляр AppApi
const appApi = new AppApi(baseApi);

// Выполняем запрос к серверу
appApi.getProducts()
    .then(Response => {
        console.log('1. Товары получены с сервера:', Response);
        
        // Сохраняем массив в модель каталога
        productsModel.setItems(Response.items);
        
        // Выводим сохранённый каталог в консоль
        console.log('2. Каталог сохранён в модели:', productsModel.getItems());
        console.log('3. Количество товаров в каталоге:', productsModel.getItems().length);
    })
    .catch(error => {
        console.error('Ошибка при получении товаров с сервера:', error);
    });

    /* ТЕСТ SUCCESS ()
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
if (successTemplate) {
    const successContainer = cloneTemplate<HTMLElement>('#success');
    const success = new Success(successContainer, {
        onClick: () => console.log('Закрыть')
    });
    success.render({ totalPrice: 1000 });
    document.body.appendChild(successContainer);
}
ТЕСТ HEADER

const events = new EventEmitter();

events.on('basket:open', () => {
    console.log('Корзина открыта');
});

const headerContainer = document.querySelector('.header') as HTMLElement;
if (headerContainer) {
    const header = new Header(events, headerContainer);
    header.counter = 5; // Должно появиться 5
}



import { Gallery } from './components/views/Gallery';
import { CardCatalog } from './components/views/CardCatalog';
import { cloneTemplate } from './utils/utils';
import { apiProducts } from './utils/data';

const galleryContainer = document.querySelector('.gallery') as HTMLElement;
console.log('Товаров в apiProducts:', apiProducts.items.length); // Сколько товаров?

if (galleryContainer) {
    const gallery = new Gallery(galleryContainer);
    
    const cards = apiProducts.items.map((item, index) => {
        console.log(`Создаю карточку ${index + 1}:`, item.title);
        const cardContainer = cloneTemplate<HTMLElement>('#card-catalog');
        const card = new CardCatalog(cardContainer, {
            onClick: () => console.log(`Выбран товар: ${item.title}`)
        });
        return card.render(item);
    });
    
    console.log('Создано карточек:', cards.length);
    gallery.catalog = cards;
    
    // Проверка: сколько карточек в DOM после добавления
    console.log('Карточек в DOM:', document.querySelectorAll('.gallery .card').length);
}



const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const previewContainer = cloneTemplate<HTMLElement>('#card-preview');

const preview = new CardPreview(previewContainer, {
    onClick: () => console.log('Добавить в корзину')
});

preview.render({
    title: 'Бэкенд-антистресс',
    price: 1000,
    category: 'другое',
    description: 'Если планируете решать задачи в тренажёре, берите два.',
    image: './src/images/Subtract.svg'
});

document.body.appendChild(previewContainer);





const events = new EventEmitter();

events.on('modal:open', () => console.log('Модалка открыта'));
events.on('modal:close', () => console.log('Модалка закрыта'));

const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(events, modalContainer);

// Создаем карточку для модалки
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const previewContainer = cloneTemplate<HTMLElement>('#card-preview');
const preview = new CardPreview(previewContainer, {
    onClick: () => console.log('Добавить в корзину')
});

preview.render({
    title: 'Бэкенд-антистресс',
    price: 1000,
    category: 'другое',
    description: 'Если планируете решать задачи в тренажёре, берите два.',
    image: './src/images/Subtract.svg'
});

// Открываем модалку с карточкой
modal.content = previewContainer;
modal.open();

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.close();
    }
});

 
  // Тест корзины
const events = new EventEmitter();
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(events, modalContainer);

// Создаем карточку корзины
const basketCardContainer = cloneTemplate<HTMLElement>('#card-basket');
const basketCard = new CardBasket(basketCardContainer, {
    onDelete: () => console.log('Удалить товар')
});
basketCard.render({
    title: 'Фреймворк куки судьбы',
    price: 2500,
    index: 1
});

// Помещаем в модалку и открываем
modal.content = basketCardContainer;
modal.open();


// ========== НОВЫЙ ТЕСТ BASKET (VIEW) ==========
const events = new EventEmitter();

events.on('basket:checkout', () => {
    console.log('Оформление заказа');
});

const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(events, modalContainer);

const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketContainer = cloneTemplate<HTMLElement>('#basket');
const basketComponent = new Basket(basketContainer, {
    onCheckout: () => events.emit('basket:checkout')
});

// Создаем тестовые карточки
const card1 = cloneTemplate<HTMLElement>('#card-basket');
card1.querySelector('.card__title')!.textContent = 'Товар 1';
card1.querySelector('.card__price')!.textContent = '750 синапсов';
card1.querySelector('.basket__item-index')!.textContent = '1';

const card2 = cloneTemplate<HTMLElement>('#card-basket');
card2.querySelector('.card__title')!.textContent = 'Товар 2';
card2.querySelector('.card__price')!.textContent = '1450 синапсов';
card2.querySelector('.basket__item-index')!.textContent = '2';

basketComponent.items = [card1, card2];
basketComponent.totalPrice = 2200;
basketComponent.buttonState = false;

modal.content = basketContainer;
modal.open();

// ========== ТЕСТ ORDER ЧЕРЕЗ MODAL ==========
const events = new EventEmitter();

events.on('order:submit', (data) => {
    console.log('Order submit:', data);
});

const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(events, modalContainer);

const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const orderContainer = cloneTemplate<HTMLFormElement>('#order');
const orderForm = new Order(orderContainer, {
    onSubmit: (data) => events.emit('order:submit', data)
});

modal.content = orderContainer;
modal.open();
*/
// ========== ТЕСТ CONTACTS ==========
const contactsEvents = new EventEmitter();

contactsEvents.on('contacts:submit', (data: { email: string; phone: string }) => {
    console.log('Contacts submit:', data);
});

const contactsModalContainer = document.querySelector('#modal-container') as HTMLElement;
const contactsModal = new Modal(contactsEvents, contactsModalContainer);

const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const contactsContainer = cloneTemplate<HTMLFormElement>('#contacts');
const contactsForm = new Contacts(contactsContainer, {
    onSubmit: (data: { email: string; phone: string }) => contactsEvents.emit('contacts:submit', data)
});

contactsModal.content = contactsContainer;
contactsModal.open();