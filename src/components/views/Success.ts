import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccessData {
    totalPrice: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccessData> {
    protected closeButton: HTMLButtonElement;
    protected descriptionElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        
        if (actions?.onClick) {
            this.closeButton.addEventListener('click', actions.onClick);
        }
    }

    set totalPrice(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}