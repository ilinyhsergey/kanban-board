import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UnitCommentsComponent} from '../components/unit-comments/unit-comments.component';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

import {UnitComment} from '../model/unit-comment';
import {SortColumnComponent} from '../components/sort-column/sort-column.component';
import {KanbanColumn} from '../model/kanban-column';

@Injectable()
export class ModalDialogService {

  constructor(private ngbModal: NgbModal) {
  }

  openUnitComments(comments: UnitComment[]): Promise<UnitComment[]> {
    const ngbModalRef: NgbModalRef = this.ngbModal.open(UnitCommentsComponent);
    const componentInstance: UnitCommentsComponent = ngbModalRef.componentInstance;
    componentInstance.comments = comments;
    return ngbModalRef.result;
  }

  openSortColumn(column: KanbanColumn): Promise<KanbanColumn> {
    const ngbModalRef: NgbModalRef = this.ngbModal.open(SortColumnComponent);
    const componentInstance: SortColumnComponent = ngbModalRef.componentInstance;
    componentInstance.column = column;
    return ngbModalRef.result;
  }

}
