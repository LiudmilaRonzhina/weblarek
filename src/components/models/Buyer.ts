import { IBuyer, TPayment, TBuyerErrors } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    private payment: TPayment = null;   
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    constructor(protected events: IEvents) {    
    }

    // сохранение данных в модели (один общий метод для всех полей)
    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.email !== undefined) this.email = data.email;
        this.events.emit('buyer:changed', this.getAllData());   
    }

    // получение всех данных покупателя
    getAllData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
        };
    }

    // очистка данных покупателя
    clearData(): void {
        this.payment = null;       
        this.address = '';
        this.phone = '';
        this.email = '';
        this.events.emit('buyer:changed', this.getAllData());   
    }

    // валидация данных (возвращает объект с ошибками)
    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this.payment || this.payment.trim() === '') {
            errors.payment = 'Не выбран вид оплаты';
        }
        if (!this.address || this.address.trim() === '') {
            errors.address = 'Не указан адрес';
        }
        if (!this.phone || this.phone.trim() === '') {
            errors.phone = 'Не указан телефон';
        }
        if (!this.email || this.email.trim() === '') {
            errors.email = 'Не указан email';
        }

        return errors;
    }
}