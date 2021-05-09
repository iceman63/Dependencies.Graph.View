import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment';
import { KeycloakService } from 'keycloak-angular';
import { setCurrentUserAction } from '../store/actions';
import { RightMappingService } from './right-mapping.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityConfigurationService {

  constructor(
    private keycloak: KeycloakService,
    private store: Store,
    private rightsMapping: RightMappingService ) {}

  async configure(ssoRedirectUri: string) {
    if (!environment.security.enabled) {
      return;
    }

    await this.keycloak.init({
      config: {
        url: environment.security.server,
        realm: environment.security.realm,
        clientId: environment.security.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: ssoRedirectUri,
        enableLogging: true,
      },
      loadUserProfileAtStartUp: true
    });

    if (await this.keycloak.isLoggedIn()) {
      this.store.dispatch(setCurrentUserAction({
        name: this.keycloak.getUsername(),
        rights: this.keycloak.getUserRoles().map(x => this.rightsMapping.getApplicationRight(x))
      }));
    }
  }
}
