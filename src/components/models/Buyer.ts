import { IProduct } from '../../types';

export class Buyer {
    private payment: string = '';
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    constructor() {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    // сохранение данных в модели (один общий метод для всех полей)
    setData(data: Partial<{ payment: string; address: string; phone: string; email: string }>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.email !== undefined) this.email = data.email;
    }

    // получение всех данных покупателя
    getAllData(): { payment: string; address: string; phone: string; email: string } {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
        };
    }

    // очистка данных покупателя
    clearData(): void {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    // валидация данных (возвращает объект с ошибками)
    validate(): { payment?: string; address?: string; phone?: string; email?: string } {
        const errors: { payment?: string; address?: string; phone?: string; email?: string } = {};

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