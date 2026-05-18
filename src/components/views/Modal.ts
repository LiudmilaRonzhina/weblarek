import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Modal extends Component<{}> {
    protected closeButton: HTMLButtonElement;
    protected contentContainer: HTMLElement;
    protected escapeHandler: (e: KeyboardEvent) => void;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);
        
        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this.contentContainer.addEventListener('click', (event) => event.stopPropagation());
        
        this.escapeHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.close();
            }
        };
    }

    set content(value: HTMLElement | null) {
        this.contentContainer.innerHTML = '';
        if (value) {
            this.contentContainer.appendChild(value);
        }
    }

    open() {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this.escapeHandler);
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        document.removeEventListener('keydown', this.escapeHandler);
    }


}