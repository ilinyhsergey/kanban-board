import {Component, Input, OnInit} from '@angular/core';

import {Unit} from '../../model/unit';
import {KanbanColumn} from '../../model/kanban-column';
import {Collection} from '../../model/collection';
import {UnitTask} from '../../model/unit-task';
import {UnitComment} from '../../model/unit-comment';
import {ModalDialogService} from '../../services/modal-dialog.service';
import {UtilsService} from '../../services/utils.service';
import {KanbanBoardService} from '../../services/kanban-board.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

  @Input()
  unit: Unit;

  @Input()
  column: KanbanColumn;

  @Input()
  columnName2SystemTasks: Collection<UnitTask[]>;

  @Input()
  unitIdx: number;

  canBeRemoved: boolean;

  constructor(private modalDialogService: ModalDialogService,
              private kanbanBoardService: KanbanBoardService,
              private utilsService: UtilsService) {
  }

  ngOnInit() {
    this.canBeRemoved = this.kanbanBoardService.isColumnEvictionStartOrTransfer(this.column);
  }

  openComments(unit: Unit) {
    const unitComments: UnitComment[] = unit.comments
      .map((comment: UnitComment): [number, UnitComment] => {
        const date: Date = this.utilsService.getDateByFormatStr(comment.dateTime, UtilsService.dateTimeFormat);
        return [date && date.getTime() || 0, comment];
      })
      .sort((pairA: [number, UnitComment], pairB: [number, UnitComment]): number => pairB[0] - pairA[0]) // sort by date DESC
      .map((pair: [number, UnitComment]): UnitComment => pair[1]);

    this.modalDialogService.openUnitComments(unitComments).then((comments: UnitComment[]) => {
      unit.comments = comments;
    }, () => {
    });
  }

  removeUnit(unit: Unit) {
    if (this.canBeRemoved) {
      this.column.units = this.column.units.filter((u: Unit) => u !== unit);
    }
  }

}
