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

// Временные переменные для компонентов, которые создаются динамически
let currentPreviewCard: CardPreview | null = null;
let currentBasket: Basket | null = null;
let currentOrder: Order | null = null;
let currentContacts: Contacts | null = null;

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

// Обновление счетчика в шапке
function updateHeaderCounter() {
    header.counter = basketModel.getTotalCount();
}

// Обновление корзины (рендер)
function renderBasket() {
    const basketContainer = cloneTemplate<HTMLElement>('#basket');
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
    
    const basket = new Basket(basketContainer, {
        onCheckout: () => events.emit('basket:checkout')
    });
    
    basket.items = cards;
    basket.totalPrice = basketModel.getTotalPrice();
    basket.buttonState = basketItems.length === 0;
    
    currentBasket = basket;
    modal.content = basketContainer;
}

// ========== СОБЫТИЯ МОДЕЛЕЙ ==========

// Каталог изменён → отображаем галерею
events.on('catalog:changed', (items: iProduct[]) => {
    const cards = items.map(item => {
        const cardContainer = cloneTemplate<HTMLElement>('#card-catalog');
        const card = new CardCatalog(cardContainer, {
            onClick: () => events.emit('card:select', item)
        });
        return card.render(item);
    });
    gallery.catalog = cards;
});

// Корзина изменена → обновляем счетчик и перерисовываем корзину (если открыта)
events.on('basket:changed', () => {
    updateHeaderCounter();
    if (currentBasket) {
        renderBasket();
    }
});


// Выбран товар для просмотра → открываем модалку с подробной карточкой
events.on('card:select', (item: iProduct) => {
    const previewContainer = cloneTemplate<HTMLElement>('#card-preview');
    const preview = new CardPreview(previewContainer, {
        onClick: () => {
            const isInBasket = basketModel.containsItem(item.id);
            if (isInBasket) {
                basketModel.removeItem(item.id);
                preview.buttonText = 'В корзину';
            } else {
                basketModel.addItem(item);
                preview.buttonText = 'Удалить из корзины';
            }
            preview.buttonState = false;
            updateHeaderCounter();
            if (currentBasket) renderBasket();
        }
    });

    // Рендерим без поля price
    preview.render({
        title: item.title,
        category: item.category,
        description: item.description,
        image: item.image
    });

    // Устанавливаем цену отдельно (сеттер price сам заблокирует кнопку если null)
    preview.price = item.price;

    const isInBasket = basketModel.containsItem(item.id);
    if (item.price !== null) {
        preview.buttonText = isInBasket ? 'Удалить из корзины' : 'В корзину';
        preview.buttonState = false;
    }

    currentPreviewCard = preview;
    modal.content = previewContainer;
    modal.open();
});

// Удаление товара из корзины
events.on('basket:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

// Открытие корзины
events.on('basket:open', () => {
    renderBasket();
    modal.open();
});

// Оформление заказа (переход к форме Order)
events.on('basket:checkout', () => {
    const orderContainer = cloneTemplate<HTMLFormElement>('#order');
    const order = new Order(orderContainer, {
        onSubmit: (data) => {
            buyerModel.setData({ payment: data.payment, address: data.address });
            events.emit('order:submit', data);
        }
    });
    
    currentOrder = order;
    modal.content = orderContainer;
});

// Переход к форме Contacts
events.on('order:submit', () => {
    const contactsContainer = cloneTemplate<HTMLFormElement>('#contacts');
    const contacts = new Contacts(contactsContainer, {
        onSubmit: (data) => {
            buyerModel.setData({ email: data.email, phone: data.phone });
            events.emit('contacts:submit', data);
        }
    });
    
    currentContacts = contacts;
    modal.content = contactsContainer;
});

// Отправка заказа на сервер
events.on('contacts:submit', async () => {
    const orderData = buyerModel.getAllData();
    const items = basketModel.getItems().map(item => item.id);
    const total = basketModel.getTotalPrice();
    
    try {
        const result = await appApi.postOrder({
            ...orderData,
            payment: orderData.payment || 'card',
            email: orderData.email || '',
            phone: orderData.phone || '',
            address: orderData.address || '',
            total,
            items
        });
        
        basketModel.clearBasket();
        buyerModel.clearData();
        
        const successContainer = cloneTemplate<HTMLElement>('#success');
        const success = new Success(successContainer, {
            onClick: () => {
                modal.close();
            }
        });
        success.render({ totalPrice: result.total });
        
        modal.content = successContainer;
        
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        alert('Произошла ошибка при оформлении заказа');
    }
});

// Закрытие модалки по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.close();
    }
});

// ========== ЗАГРУЗКА ТОВАРОВ С СЕРВЕРА ==========
appApi.getProducts()
    .then(data => {
        productsModel.setItems(data.items);
    })
    .catch(err => console.error('Ошибка загрузки товаров:', err));

;