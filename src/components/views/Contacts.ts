import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IContactsData, IContactsActions } from '../../types';

export class Contacts extends Form<IContactsData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    
    protected _email: string = '';
    protected _phone: string = '';

    constructor(container: HTMLFormElement, protected actions?: IContactsActions) {
        super(container);
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        
        this.emailInput.addEventListener('input', () => {
            this.email = this.emailInput.value;
        });
        
        this.phoneInput.addEventListener('input', () => {
            this.phone = this.phoneInput.value;
        });
        
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate() && actions?.onSubmit) {
                actions.onSubmit({
                    email: this._email,
                    phone: this._phone
                });
            }
        });
    }
    
    set email(value: string) {
        this._email = value;
        this.emailInput.value = value;
        this.validateAndUpdate();
    }
    
    set phone(value: string) {
        this._phone = value;
        this.phoneInput.value = value;
        this.validateAndUpdate();
    }
    
    private validateAndUpdate(): void {
        const isValid = this.validate();
        this.isValid = isValid;
        
        const errors: string[] = [];
        if (this._email.trim() === '') {
            errors.push('Введите email');
        } else if (!this._email.includes('@')) {
            errors.push('Введите корректный email (должен содержать @)');
        }
        if (this._phone.trim() === '') {
            errors.push('Введите номер телефона');
        } else if (this._phone.length < 10) {
            errors.push('Введите корректный номер телефона (минимум 10 символов)');
        }
        this.errors = errors.join(', ');
    }
    
    validate(): boolean {
        return this._email.includes('@') && 
               this._email.trim() !== '' && 
               this._phone.trim() !== '' && 
               this._phone.length >= 10;
    }
}