import { TestBed, inject } from '@angular/core/testing';

import { KanbanBoardService } from './kanban-board.service';

describe('KanbanBoardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KanbanBoardService]
    });
  });

  it('should be created', inject([KanbanBoardService], (service: KanbanBoardService) => {
    expect(service).toBeTruthy();
  }));
});
