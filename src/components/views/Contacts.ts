import { Form } from './Form';
import { ensureElement } from '../../utils/utils';

interface IContactsData {
    email: string;
    phone: string;
}

interface IContactsActions {
    onSubmit: (data: IContactsData) => void;
    onInputChange?: (field: keyof IContactsData, value: string) => void;
}

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
        this.updateState();
    }
    
    set phone(value: string) {
        this._phone = value;
        this.phoneInput.value = value;
        this.updateState();
    }
    
    validate(): boolean {
        const emailValid = this._email.includes('@') && this._email.length > 0;
        const phoneValid = this._phone.length >= 10;
        return emailValid && phoneValid;
    }
}