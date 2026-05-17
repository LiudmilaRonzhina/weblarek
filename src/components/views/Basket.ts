import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IBasketData, IBasketActions } from '../../types';


export class Basket extends Component<IBasketData> {
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IBasketActions) {
        super(container);
        
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        
        if (actions?.onCheckout) {
            this.orderButton.addEventListener('click', actions.onCheckout);
        }
    }

    set items(items: HTMLElement[]) {
        this.listElement.innerHTML = '';
        items.forEach(item => {
            this.listElement.appendChild(item);
        });
    }

    set totalPrice(value: number) {
        this.priceElement.textContent = `${value} синапсов`;
    }

    set buttonState(disabled: boolean) {
        this.orderButton.disabled = disabled;
    }
}