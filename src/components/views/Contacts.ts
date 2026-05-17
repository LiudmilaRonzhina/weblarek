import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IContactsData, IContactsActions } from '../../types';

export class Contacts extends Form<IContactsData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected actions?: IContactsActions) {
        super(container);
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        
        this.emailInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.actions?.onInputChange?.('email', target.value);
        });
        
        this.phoneInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.actions?.onInputChange?.('phone', target.value);
        });
        
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.actions?.onSubmit?.();
        });
    }
    
    set email(value: string) {
        this.emailInput.value = value;
    }
    
    set phone(value: string) {
        this.phoneInput.value = value;
    }
}