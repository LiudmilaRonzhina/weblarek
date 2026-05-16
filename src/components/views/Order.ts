import { Form } from './Form';
import { ensureElement } from '../../utils/utils';

interface IOrderData {
    payment: 'card' | 'cash' | null;
    address: string;
}

interface IOrderActions {
    onSubmit: (data: IOrderData) => void;
    onInputChange?: (field: keyof IOrderData, value: string) => void;
}

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
        
        // Устанавливаем слушатели на кнопки оплаты
        this.cardButton.addEventListener('click', () => {
            this.payment = 'card';
        });
        
        this.cashButton.addEventListener('click', () => {
            this.payment = 'cash';
        });
        
        // Слушатель на поле адреса
        this.addressInput.addEventListener('input', () => {
            this.address = this.addressInput.value;
        });
        
        // Сабмит формы
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
        
        // Активная кнопка
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
        
        this.updateState();
    }
    
    set address(value: string) {
        this._address = value;
        this.addressInput.value = value;
        this.updateState();
    }
    
    validate(): boolean {
        return this._payment !== null && this._address.trim() !== '';
    }
}