import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {KanbanBoardComponent} from './components/kanban-board/kanban-board.component';
import {DataReaderComponent} from './components/data-reader/data-reader.component';
import {CsvParserService} from './services/csv-parser.service';
import {KanbanBoardService} from './services/kanban-board.service';
import {UtilsService} from './services/utils.service';
import {UnitTasksComponent} from './components/unit-tasks/unit-tasks.component';
import {UnitCommentsComponent} from './components/unit-comments/unit-comments.component';
import {ModalDialogService} from './services/modal-dialog.service';
import {UnitComponent} from './components/unit/unit.component';
import {SortColumnComponent} from './components/sort-column/sort-column.component';
import {NgDragDropModule} from 'ng-drag-drop';


@NgModule({
  declarations: [
    AppComponent,
    KanbanBoardComponent,
    DataReaderComponent,
    UnitTasksComponent,
    UnitCommentsComponent,
    UnitComponent,
    SortColumnComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgDragDropModule.forRoot(),
    NgbModule.forRoot(),
    MultiselectDropdownModule,
  ],
  providers: [
    CsvParserService,
    KanbanBoardService,
    UtilsService,
    ModalDialogService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UnitCommentsComponent,
    SortColumnComponent,
  ]
})
export class AppModule {
}
