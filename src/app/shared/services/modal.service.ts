import {EventEmitter, Injectable, InjectionToken, Injector} from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import {ComponentPortal, ComponentType, PortalInjector} from '@angular/cdk/portal';
import {ModalOverlayRef, IModal, DEFAULT_CONFIG, MODAL_OPTIONS} from '@app/shared/models';
import {ModalComponent} from '@app/shared/components/modal/modal.component';


@Injectable()
export class ModalService {

  constructor(private injector: Injector, private overlay: Overlay) { }

  open(modalOptions: IModal, config: OverlayConfig = {}) {
    // Override default configuration
    const configuration = { ...DEFAULT_CONFIG, ...config };

    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.createOverlay(configuration);

    // Instantiate remote control - This is used to close the modal backdrop when the user closes the modal
    const dialogRef = new ModalOverlayRef(overlayRef);

    if (modalOptions.closeOnOutsideClick) {
      overlayRef.backdropClick().subscribe(() => dialogRef.close());
    }

    // TODO: Close on router events

    // Inject our modalOptions into our component
    const injector = this.createInjector(modalOptions, config, dialogRef);

    const portal = new ComponentPortal(ModalComponent, null, injector);

    // Attach ComponentPortal to PortalHost
    overlayRef.attach(portal);

    return dialogRef;
  }

  private createOverlay(config: OverlayConfig) {
    // Returns an OverlayConfig
    const overlayConfig = this.getOverlayConfig(config);

    // Returns an OverlayRef
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: OverlayConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    console.log(positionStrategy);

    config.scrollStrategy = this.overlay.scrollStrategies.block();
    config.positionStrategy = positionStrategy;

    return config;
  }

  private createInjector(modalOptions: IModal, config: OverlayConfig, dialogRef: ModalOverlayRef): PortalInjector {
    // Instantiate new WeakMap for our custom injection tokens
    const injectionTokens = new WeakMap();

    // Set custom injection tokens
    injectionTokens.set(ModalOverlayRef, dialogRef);
    injectionTokens.set(MODAL_OPTIONS, modalOptions);

    // Instantiate new PortalInjector
    return new PortalInjector(this.injector, injectionTokens);
  }
}
