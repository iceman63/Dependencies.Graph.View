import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ConfigurationService } from './core/services/configuration.service';

import { VersionService } from './core/services/version.service';
import { errorStateSelector } from './core/store/core.selectors';
import { CoreState } from './core/store/models';
import { HeaderLink } from './shared/components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'DependenciesGraph';
  #storeSubscription?: Subscription;

  canLogon: boolean;

  links: Array<HeaderLink> = [
    { path : 'software', label: 'Software', roles: [ ] },
    { path : 'assembly', label: 'Assembly', roles: [ ] },
    { path : 'test', label: 'Test', roles: [ 'test' ] },
  ];

  get version(): string {
    return this.versionService.version;
  }

  constructor(
    private readonly store: Store<CoreState>,
    private readonly snackBar: MatSnackBar,
    private readonly versionService: VersionService,
    readonly configService: ConfigurationService
    ) {
    this.canLogon = configService.configuration.security.enabled;
  }

  ngOnInit(): void {
    this.#storeSubscription = this.store.pipe(
      select(errorStateSelector),
      filter(x => x.lastError),
      map(x => x.lastError)
    ).subscribe(x => this.snackBar.open(x, 'Close'));
  }

  ngOnDestroy(): void {
    this.#storeSubscription?.unsubscribe();
  }
}
