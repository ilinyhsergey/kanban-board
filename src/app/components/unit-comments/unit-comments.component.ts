import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {UnitComment} from '../../model/unit-comment';
import {UtilsService} from '../../services/utils.service';

@Component({
  selector: 'app-unit-comments',
  templateUrl: './unit-comments.component.html',
  styleUrls: ['./unit-comments.component.scss']
})
export class UnitCommentsComponent implements OnInit {

  @Input()
  comments: UnitComment[];

  newComment: string;

  constructor(private ngbActiveModal: NgbActiveModal,
              public utilsService: UtilsService) {
  }

  ngOnInit() {
  }

  onKeypress(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.addComment();
    }
  }

  addComment() {
    if (this.newComment) {
      const dateTime: string = this.utilsService.getFormatStrByDate(new Date());
      const unitComment: UnitComment = {
        comment: this.newComment,
        dateTime: dateTime,
      };
      this.comments = [unitComment].concat(this.comments);
      this.newComment = '';
    }
  }

  removeComment(unitComment: UnitComment) {
    const comment: string = unitComment.comment;
    this.comments = this.comments.filter((c: UnitComment) => c.comment !== comment);
  }

  close(result) {
    this.ngbActiveModal.close(result);
  }

  dismiss() {
    this.ngbActiveModal.dismiss();
  }

}
