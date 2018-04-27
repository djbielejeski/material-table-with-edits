import {InjectionToken} from '@angular/core';
import {OverlayConfig} from '@angular/cdk/overlay';

export interface IModal {
 title: string;
 body: string;
 hasCloseButton: boolean;
 closeOnOutsideClick?: boolean;
 buttons: IModalButton[];
}

export interface IModalButton {
  text: string;
  cssClasses: string;
  click(): void;
}

export const MODAL_OPTIONS = new InjectionToken<IModal>('MODAL_OPTIONS');

export const DEFAULT_CONFIG: OverlayConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  maxHeight: 310,
  minHeight: 270,
  maxWidth: 500,
  minWidth: 250,
};
