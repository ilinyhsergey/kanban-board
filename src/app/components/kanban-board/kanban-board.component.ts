import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';

import {FileHolder} from '../../model/file-holder';
import {CsvParserService} from '../../services/csv-parser.service';
import {Unit} from '../../model/unit';
import {KanbanColumn} from '../../model/kanban-column';
import {KanbanBoardService} from '../../services/kanban-board.service';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import UnitProps = Unit.UnitProps;
import {UnitTask} from '../../model/unit-task';
import {UtilsService} from '../../services/utils.service';
import {Collection} from '../../model/collection';
import KanbanColumnNames = KanbanColumn.KanbanColumnNames;
import {UnitSystemTask} from '../../model/unit-system-task';
import {ModalDialogService} from '../../services/modal-dialog.service';
import {DropEvent} from 'ng-drag-drop/src/shared/drop-event.model';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit {

  @ViewChild('board')
  private board: ElementRef;

  private units: Unit[] = [];
  columns: KanbanColumn[] = [];

  unitKeysForDescription: IMultiSelectOption[] = [];
  descriptionKeysSettings: IMultiSelectSettings;
  descriptionKeysTexts: IMultiSelectTexts;

  pending: boolean;

  columnName2SystemTasks: Collection<UnitTask[]> = {};

  columnFromDrag: KanbanColumn;

  private targetClone;

  constructor(private csvParserService: CsvParserService,
              private kanbanBoardService: KanbanBoardService,
              private modalDialogService: ModalDialogService,
              private utilsService: UtilsService) {
  }

  ngOnInit() {
    this.initUnitKeysForDescription();
  }

  onColumnDragStart(event: DragEvent) {
    const target: Node = event.target as Node;
    const crt: HTMLElement = target.cloneNode(true) as HTMLElement;
    document.body.appendChild(crt);
    crt.style.position = 'absolute'; crt.style.top = '-1000px'; crt.style.left = '-1000px';
    crt.style.width = '270px';
    event.dataTransfer.setDragImage(crt, event.offsetX, event.offsetY);
    this.targetClone = crt;
  }

  onUnitDragStart(column: KanbanColumn, event: DragEvent) {
    this.columnFromDrag = column;


    const target: Node = event.target as Node;
    const crt: HTMLElement = target.cloneNode(true) as HTMLElement;
    document.body.appendChild(crt);
    crt.style.position = 'absolute'; crt.style.top = '-1000px'; crt.style.left = '-1000px';
    crt.style.width = '258px';
    event.dataTransfer.setDragImage(crt, event.offsetX, event.offsetY);
    this.targetClone = crt;
  }

  onDragEnd(event: DropEvent) {
    document.body.removeChild(this.targetClone);
    this.targetClone = undefined;
  }

  onDrop(event: DropEvent, columnToDrop?: KanbanColumn, unitToDrop?: Unit) {
    if (event.dragData['isUnit']) {
      this.onUnitDrop(event, columnToDrop, unitToDrop);
    } else if (event.dragData['isColumn']) {
      this.onColumnDrop(event, columnToDrop);
    }
  }

  onUnitDrop(event: DropEvent, columnToDrop: KanbanColumn, unitToDrop?: Unit) {
    if (!this.columnFromDrag || !event.dragData['isUnit']) {
      return;
    }

    const idKey: string = UnitProps[UnitProps.unitNumber];
    const unitToDrag: Unit = event.dragData;

    if (this.columnFromDrag.name === columnToDrop.name) {
      // sort
      if (!unitToDrop || unitToDrag.unitNumber !== unitToDrop.unitNumber) {
        this.kanbanBoardService.changeItemPositionInArray(idKey, columnToDrop.units, unitToDrag, unitToDrop);
      }
    } else {
      if (this.kanbanBoardService.isColumnEvictionStartOrTransfer(columnToDrop)) {
        if (this.kanbanBoardService.isColumnEvictionStartOrTransfer(this.columnFromDrag)) {
          // move
          this.kanbanBoardService.insertItemIntoArray(idKey, unitToDrag, columnToDrop.units, unitToDrop);
          this.kanbanBoardService.removeItemFromArray(idKey, unitToDrag, this.columnFromDrag.units);
        } else {
          // copy
          this.kanbanBoardService.insertItemIntoArray(idKey, _.cloneDeep(unitToDrag), columnToDrop.units, unitToDrop);
        }
        this.updateColumnUnitsDescription(columnToDrop);
      } else {
        if (this.kanbanBoardService.isColumnEvictionStartOrTransfer(this.columnFromDrag)) {
          // remove from sourceColumn
          this.kanbanBoardService.removeItemFromArray(idKey, unitToDrag, this.columnFromDrag.units);
        } else {
          // ignore
        }
      }
    }

    this.columnFromDrag = undefined;
  }

  onColumnDrop(event: DropEvent, columnToDrop?: KanbanColumn) {
    if (!event.dragData['isColumn']) {
      return;
    }

    // sort
    const idKey = 'name';
    const column: KanbanColumn = event.dragData;
    if (!columnToDrop || column.name !== columnToDrop.name) {
      this.kanbanBoardService.changeItemPositionInArray(idKey, this.columns, column, columnToDrop);
    }
  }

  private initUnitKeysForDescription() {
    this.unitKeysForDescription = Unit.allUnitProps.map((unitProp: string): IMultiSelectOption => {
      return {
        id: UnitProps[unitProp],
        name: unitProp,
      };
    });

    this.descriptionKeysSettings = {
      enableSearch: true,
      checkedStyle: 'checkboxes',
      buttonClasses: 'btn btn-outline-dark btn-sm',
      dynamicTitleMaxItems: 3,
      displayAllSelectedText: true
    };

    this.descriptionKeysTexts = {
      checkAll: 'Select all',
      uncheckAll: 'Unselect all',
      checked: 'item selected',
      checkedPlural: 'items selected',
      searchPlaceholder: 'Find',
      searchEmptyResult: 'Nothing found...',
      searchNoRenderText: 'Type in search box to see results...',
      defaultTitle: 'Select',
      allSelected: 'All selected',
    };
  }

  onDescriptionKeysSelected(column: KanbanColumn) {
    this.updateColumnUnitsDescription(column);
  }

  onUnitsFileRead(fileHolder: FileHolder) {
    this.units = this.csvParserService.parseUnitsFromCsvData(fileHolder);
    this.columns = this.kanbanBoardService.makeKanbanColumns(this.units);

    this.columns.forEach((column: KanbanColumn) => {
      this.updateColumnUnitsDescription(column);
    });

  }

  private updateColumnUnitsDescription(column: KanbanColumn) {
    column.units.forEach((unit: Unit) => {
      unit.description = this.kanbanBoardService.getUnitDescription(unit, column);
    });
  }

  onSystemTasksFileRead(fileHolder: FileHolder) {
    const unitSystemTasks: UnitSystemTask[] = JSON.parse(fileHolder.src) as UnitSystemTask[];

    this.columnName2SystemTasks = _.groupBy(unitSystemTasks,
      (unitSystemTask: UnitSystemTask): string => KanbanColumnNames[unitSystemTask.columnKey]);
  }

  exportForDownload() {
    const content = JSON.stringify(this.units);
    this.utilsService.downloadTextFile('backup.json', content);
  }

  sortUnits(column: KanbanColumn) {
    this.modalDialogService.openSortColumn(column).then((result: KanbanColumn) => {
      column.units = result.units;
    }, () => {
    });

  }
}
