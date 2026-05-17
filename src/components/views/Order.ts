import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IOrderData, IOrderActions } from '../../types';

export class Order extends Form<IOrderData> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;
    
    protected _payment: 'card' | 'cash' | null = null;
    protected _address: string = '';

    constructor(container: HTMLFormElement, protected actions?: IOrderActions) {
        super(container);
        
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        
        this.cardButton.addEventListener('click', () => {
            this.payment = 'card';
        });
        
        this.cashButton.addEventListener('click', () => {
            this.payment = 'cash';
        });
        
        this.addressInput.addEventListener('input', () => {
            this.address = this.addressInput.value;
        });
        
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate() && actions?.onSubmit) {
                actions.onSubmit({
                    payment: this._payment,
                    address: this._address
                });
            }
        });
    }
    
    set payment(value: 'card' | 'cash' | null) {
        this._payment = value;
        
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
        
        this.validateAndUpdate();
    }
    
    set address(value: string) {
        this._address = value;
        this.addressInput.value = value;
        this.validateAndUpdate();
    }
    
    private validateAndUpdate(): void {
        const isValid = this.validate();
        this.isValid = isValid;
        
        const errors: string[] = [];
        if (this._payment === null) {
            errors.push('Выберите способ оплаты');
        }
        if (this._address.trim() === '') {
            errors.push('Введите адрес доставки');
        }
        this.errors = errors.join(', ');
    }
    
    validate(): boolean {
        return this._payment !== null && this._address.trim() !== '';
    }
}