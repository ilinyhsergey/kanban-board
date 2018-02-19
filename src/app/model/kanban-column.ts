import {Unit} from './unit';

export class KanbanColumn {
  isColumn: boolean;
  name: string;
  descriptionUnitKeys: string[];
  units: Unit[];
  color?: string;
}

export namespace KanbanColumn {
  export enum KanbanColumnNames {
    undecided = <any> 'Undecided',
    renewed = <any> 'Renewed',
    vacantAvailableMadeReady = <any> 'Vacant Available - Made Ready',
    vacantAvailableNotReady = <any> 'Vacant Available - Not Ready',
    vacantLeased = <any> 'Vacant Leased',
    noticeAvailable = <any> 'Notice Available',
    noticeLeased = <any> 'Notice Leased',
    evictionStart = <any> 'Eviction Start',
    transfer = <any> 'Transfer',
  }

  export const allKanbanColumnNames: any[] = [
    KanbanColumnNames.undecided,
    KanbanColumnNames.renewed,
    KanbanColumnNames.vacantAvailableMadeReady,
    KanbanColumnNames.vacantAvailableNotReady,
    KanbanColumnNames.vacantLeased,
    KanbanColumnNames.noticeAvailable,
    KanbanColumnNames.noticeLeased,
    KanbanColumnNames.evictionStart,
    KanbanColumnNames.transfer,
  ];
}
