import { Component, ElementRef, Input, AfterViewChecked, ChangeDetectionStrategy, AfterViewInit, NgZone, OnDestroy } from '@angular/core';

import { drag, forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, select, Simulation, zoom } from 'd3';

import { Graph, GraphNode, GraphLink } from '@app/shared/models';

export type GraphUpdateMode = 'Update' | 'ClearAndAdd';

@Component({
  selector: 'dgv-force-graph',
  templateUrl: './force-graph.component.html',
  styleUrls: ['./force-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForceGraphComponent implements AfterViewInit, AfterViewChecked, OnDestroy {

  #isInitialized = false;
  #simulation?: Simulation<{}, undefined>;

  #graph?: Graph;
  #linkedByIndex: { [char: string]: boolean } = {};

  #nodes?: any = null;
  #links?: any;

  #svg?: any;
  #svgGroup?: any;

  #height?: number;
  #width?: number;

  @Input() public disableOpacity = 0.3;
  @Input() public markerSize = 12;
  @Input() public linkStroke = 1.5;
  @Input() public circleSize = 6;
  @Input() public updateMode: GraphUpdateMode = 'Update';

  @Input() set graph(value: Graph | undefined) {
    if (value === this.#graph) {
      return;
    }
    this.#graph = value;

    this.zone.runOutsideAngular(() => {
      this.updateGraphData();
    });
  }

  private get nodeSelector(): any {
    return this.#svgGroup.select('.nodes').selectAll('g');
  }

  private get linkSelector(): any {
    return this.#svgGroup.select('.links').selectAll('line');
  }

  constructor(private readonly container: ElementRef, private readonly zone: NgZone) { }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.initializeGraph();
    });
  }

  ngAfterViewChecked(): void {
    this.onResize();
  }

  ngOnDestroy(): void {
    this.clearData();
    this.#simulation?.stop();

    this.#svg.selectAll('*').remove();
  }

  private initializeGraph(): void {

    if (this.#isInitialized) {
      return;
    }

    this.#isInitialized = true;

    this.#svg = select('.graph-svg');
    const size = this.getControlSize();

    this.#height = size.height;
    this.#width = size.width;

    this.#svg.attr('width', this.#width);
    this.#svg.attr('height', this.#height);

    this.#simulation = forceSimulation()
      .force('link', forceLink().id((d: any) => d.id).distance(150))
      .force('collide', forceCollide(this.circleSize * 1.5).iterations(20))
      .force('charge', forceManyBody().strength(-30).distanceMin(10))
      .force('center', forceCenter(this.#width / 2, this.#height / 2));

    this.#svgGroup = this.#svg.append('g');

    this.#svg.append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', this.markerSize)
      .attr('markerHeight', this.markerSize)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('stroke', 'none')
      .attr('fill', 'DimGray');

    this.#svg.call(zoom().on('zoom', ({ transform }: any) => this.#svgGroup.attr('transform', transform)));

    this.#svgGroup.append('g').attr('class', 'links');
    this.#svgGroup.append('g').attr('class', 'nodes');

  }

  private updateGraphData(): void {
    if (!this.#isInitialized) {
      this.initializeGraph();
    }

    if (!this.#simulation) {
      return;
    }

    if (!this.#graph || this.updateMode === 'ClearAndAdd') {
      this.clearData();
    }

    if (!this.#graph) {
      this.#simulation.restart();
      return;
    }

    this.#linkedByIndex = {};

    this.#graph.links.forEach(d => {
      this.#linkedByIndex[`${d.source.id},${d.target.id}`] = true;
    });

    const linkData = this.linkSelector.data(this.#graph.links, (x: GraphLink) => `${x.source.id}|${x.target.id}`);

    linkData.exit().remove();

    this.#links = linkData.enter().append('line');

    this.#links.attr('marker-end', 'url(#arrowhead)')
      .style('stroke-width', this.linkStroke)
      .style('stroke', 'DimGray');

    let nodes = this.nodeSelector.data(this.#graph.nodes, (x: GraphNode) => x.id);

    nodes.exit().remove();

    nodes = nodes.enter().append('g');

    nodes.append('circle')
      .attr('stroke', (d: GraphNode) => d.color)
      .attr('stroke-width', this.circleSize / 2.0)
      .attr('fill', (d: GraphNode) => d.color)
      .attr('r', this.circleSize)
      .style('cursor', 'pointer');

    nodes.append('text')
      .text((d: GraphNode) => d.label)
      .attr('font-size', 15)
      .attr('fill', 'white')
      .attr('dx', 15)
      .attr('dy', 4)
      .style('cursor', 'pointer');

    this.#nodes = this.nodeSelector;

    // Here we need the real item
    this.#nodes.on('mouseover', this.fade(this.disableOpacity))
      .on('mouseout', this.fade(1));

    this.#simulation.nodes(this.#graph.nodes).on('tick', () => this.ticked());

    this.#nodes.call(drag().on('start', (event, d) => this.dragStarted(event, d, this.#simulation))
      .on('drag', this.dragged)
      .on('end', (event, d) => this.dragEnded(event, d, this.#simulation)));

    this.#simulation.force<d3.ForceLink<any, any>>('link')?.links(this.#graph.links);
    this.#simulation.alpha(0).alphaTarget(0.3).restart();

    this.#nodes = this.nodeSelector;
  }

  private clearData(): void {
    if (this.nodeSelector != null) {
      this.nodeSelector.data({}).exit().remove();
      this.linkSelector.data({}).exit().remove();
    }
  }

  private ticked(): void {
    this.#links
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y);

    this.#nodes.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
  }

  private isConnected(a: GraphNode, b: GraphNode): boolean {
    return this.#linkedByIndex[`${a.id},${b.id}`] || a.id === b.id;
  }

  private fade(opacity: number): (_: any, d: any) => void {
    return (_: any, d: any) => {
      this.#nodes.style('opacity', (o: any) => this.isConnected(d, o) ? 1 : opacity);
      this.#links.style('opacity', (o: any) => (o.source === d ? 1 : opacity));
    };
  }

  private dragStarted(event: any, d: any, simulation: any): void {
    if (!event?.active) {
      simulation.alphaTarget(0.3).restart();
    }

    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(event: any, d: any): void {
    d.fx = event.x;
    d.fy = event.y;
  }

  private dragEnded(event: any, d: any, simulation: any): void {
    if (!event?.active) {
      simulation.alphaTarget(0);
    }

    d.fx = null;
    d.fy = null;
  }

  onResize(): void {
    if (!this.#isInitialized) {
      return;
    }

    const size = this.getControlSize();

    if (this.#height === size.height && this.#width === size.width) {
      return;
    }

    this.#height = size.height;
    this.#width = size.width;

    this.#svg.attr('width', this.#width);
    this.#svg.attr('height', this.#height);

    this.#simulation = this.#simulation?.force('center', forceCenter(this.#width / 2, this.#height / 2));
    this.#simulation?.restart();
  }

  private getControlSize(): { width: number, height: number } {
    const width = (+this.container.nativeElement.offsetWidth);
    const height = (+this.container.nativeElement.offsetHeight);

    return { width, height };
  }
}
