import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IFormData } from '../../types';

export abstract class Form<T> extends Component<IFormData> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(protected container: HTMLFormElement) {
        super(container);
        
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    // Абстрактный метод для валидации (реализуется в наследниках)
    abstract validate(): boolean;

    // Защищенный метод для обновления состояния кнопки и ошибок
    protected updateState() {
        this.submitButton.disabled = !this.validate();
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

   // испльзуется в  Order.ts и Contacts.ts 
    set isValid(value: boolean) {
        this.submitButton.disabled = !value;
    }
}