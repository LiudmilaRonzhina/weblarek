import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Modal extends Component<{}> {
    protected closeButton: HTMLButtonElement;
    protected contentContainer: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);
        
        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        // Останавливаем всплытие клика по контейнеру с контентом
        this.contentContainer.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement | null) {
        this.contentContainer.innerHTML = '';
        if (value) {
            this.contentContainer.appendChild(value);
        }
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data?: {}): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}