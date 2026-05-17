import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { iProduct, ICardCatalogActions } from '../../types';
import { categoryMap } from '../../utils/constants';

type CategoryKey = keyof typeof categoryMap;
type TCardCatalog = Pick<iProduct, 'image' | 'category'>;

export class CardCatalog extends Card<TCardCatalog> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardCatalogActions) {
        super(container);
        
        this.categoryElement = ensureElement<HTMLElement>(
            '.card__category',
            this.container
        );
        this.imageElement = ensureElement<HTMLImageElement>(
            '.card__image',
            this.container
        );
        
        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
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
        this.setImage(this.imageElement, value, this.title);
    }
}