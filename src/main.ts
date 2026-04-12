import './scss/styles.scss';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { AppApi } from './components/models/AppApi';     
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';

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
const baseApi = new Api('http://localhost:3000/api/weblarek');

// Создаём экземпляр AppApi
const appApi = new AppApi(baseApi);

// Выполняем запрос к серверу
appApi.getProducts()
    .then(products => {
        console.log('1. Товары получены с сервера:', products);
        
        // Сохраняем массив в модель каталога
        productsModel.setItems(products);
        
        // Выводим сохранённый каталог в консоль
        console.log('2. Каталог сохранён в модели:', productsModel.getItems());
        console.log('3. Количество товаров в каталоге:', productsModel.getItems().length);
    })
    .catch(error => {
        console.error('Ошибка при получении товаров с сервера:', error);
    });