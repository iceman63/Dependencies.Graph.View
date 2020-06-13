import { Injectable } from '@angular/core';
import { AssemblyService } from '@app/assembly/services/assembly.service';
import { operationFailure } from '@app/core/store/actions/error.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { loadAssemblies, loadAssembliesSuccess } from './../actions';

@Injectable()
export class AssembliesEffects {

  constructor(private actions: Actions, private assemblyService: AssemblyService) {}

  loadAssemblies = createEffect(() => {
    return this.actions.pipe(
      ofType(loadAssemblies),
      switchMap(action => this.assemblyService.assemblyStatistics(1, 1).pipe(
        map(data => loadAssembliesSuccess({ data, origin: action })),
        catchError(error => of(operationFailure({ error: error.message, origin: action })))
        )),
    );
  });
}