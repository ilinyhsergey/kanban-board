import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {KanbanColumn} from '../../model/kanban-column';
import {SortingMeta} from '../../model/sorting-meta';
import {KanbanBoardService} from '../../services/kanban-board.service';
import SortingMetaKey = SortingMeta.SortingMetaKey;

@Component({
  selector: 'app-sort-column',
  templateUrl: './sort-column.component.html',
  styleUrls: ['./sort-column.component.scss']
})
export class SortColumnComponent implements OnInit {

  @Input()
  column: KanbanColumn;

  directionAsc: boolean;

  sortingMetaKeys: SortingMetaKey[] = [];
  sortingMetaSelected: string;

  constructor(private ngbActiveModal: NgbActiveModal,
              private kanbanBoardService: KanbanBoardService) {
  }

  ngOnInit() {
    this.sortingMetaKeys = this.kanbanBoardService.getSortingMetaKeysForColumns(this.column);
  }

  formInvalid() {
    return this.sortingMetaSelected === undefined || this.directionAsc === undefined;
  }

  applySort() {
    const sortingMetaKey: string = SortingMetaKey[this.sortingMetaSelected];
    const result: KanbanColumn = this.kanbanBoardService.sortUnitsInColumn(this.column, sortingMetaKey, this.directionAsc);
    this.ngbActiveModal.close(result);
  }

  dismiss() {
    this.ngbActiveModal.dismiss();
  }

}
