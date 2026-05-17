import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { iProduct, ICardPreviewActions } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

type CategoryKey = keyof typeof categoryMap;
type TCardPreview = Pick<iProduct, 'image' | 'category' | 'description' | 'title'>;

export class CardPreview extends Card<TCardPreview> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardPreviewActions) {
        super(container);
        
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        
        if (actions?.onClick) {
            this.buttonElement.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            );
        }
    }

    set image(value: string) {
        const fullPath = `${CDN_URL}${value}`;
        this.setImage(this.imageElement, fullPath, this.title);
    }

    set description(value: string) {
        this.textElement.textContent = value;
    }

    set price(value: number | null) {
        super.price = value;   
        if (value === null) {
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
        }
    }

    set buttonState(disabled: boolean) {
        this.buttonElement.disabled = disabled;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }
}