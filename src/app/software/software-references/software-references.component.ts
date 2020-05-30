import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { Assembly, AssemblyBase } from '@app/core/models/assembly';
import { Graph, Link, Node } from '@app/shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SoftwareState } from '../store/models';
import { softwareAssembliesStateSelector } from '../store/software.selectors';

@Component({
  selector: 'app-software-references',
  templateUrl: './software-references.component.html',
  styleUrls: ['./software-references.component.scss']
})
export class SoftwareReferencesComponent implements OnInit {
  private _softwareName: AssemblyBase;

  graph: Observable<Graph>;

  constructor(private store: Store<SoftwareState>) {
  }

  ngOnInit() {
    this.graph = this.store.pipe(
      select(softwareAssembliesStateSelector),
      map(x => this.generateGraphData(x.software)),
    );
  }

  generateGraphData(assembly: Assembly): any {

    if (assembly == null) {
      return null;
    }

    console.log(`strange loding ${assembly.id}`);

    const item = new Graph();
    item.nodes = assembly.referencedAssemblies.map(x => new Node({
      id: x.id,
      label: `${x.name} (${x.version})`,
      color: x.isNative ? 'lightGreen' : 'lightBlue'
    }));

    item.nodes.push(new Node({ id: assembly.id, label: `${assembly.name} (${assembly.version})`, color: 'red' }));

    item.links = assembly.links.map(x => new Link({ source: x.sourceId, target: x.targetId }));

    return item;
  }
}
