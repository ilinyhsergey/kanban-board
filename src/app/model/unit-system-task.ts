import {KanbanColumn} from './kanban-column';
import KanbanColumnNames = KanbanColumn.KanbanColumnNames;

export class UnitSystemTask {
  id: number;
  name: string;
  columnKey: string; // keyof KanbanColumnNames;
}
