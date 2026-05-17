import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IOrderData, IOrderActions } from '../../types';

export class Order extends Form<IOrderData> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected actions?: IOrderActions) {
        super(container);
        
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        
        this.cardButton.addEventListener('click', () => {
            this.actions?.onInputChange?.('payment', 'card');
        });
        this.cashButton.addEventListener('click', () => {
            this.actions?.onInputChange?.('payment', 'cash');
        });
        this.addressInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.actions?.onInputChange?.('address', target.value);
        });
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.actions?.onSubmit?.();
        });
    }

    set payment(value: 'card' | 'cash' | null) {
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}