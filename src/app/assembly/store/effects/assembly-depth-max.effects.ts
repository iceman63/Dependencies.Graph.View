import { Injectable } from '@angular/core';
import { AssemblyService } from '@app/assembly/services/assembly.service';
import { empty } from '@app/core/store/actions/empty.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { loadAssemblyDepthMax, loadAssemblyDepthMaxSuccess } from './../actions/assembly-depth-max.actions';


@Injectable()
export class AssemblyDepthMaxEffects {

  constructor(
    private readonly actions: Actions,
    private readonly assemblyService: AssemblyService) {}

  loadAssemblyDepthMax = createEffect(() => {
    return this.actions.pipe(
      ofType(loadAssemblyDepthMax),
      switchMap(action => this.assemblyService.assemblyDepthMax(action.assemblyId).pipe(
        map(data => loadAssemblyDepthMaxSuccess( { assemblyId: data.id, depthMax: data.value,  origin: action} )),
        catchError(() => of(empty({origin: action }))),
      )),
    );
  });
}
