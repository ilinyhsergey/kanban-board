import {Component, Input, OnInit, Output} from '@angular/core';
import {UnitTask} from '../../model/unit-task';
import {Collection} from '../../model/collection';

@Component({
  selector: 'app-unit-tasks',
  templateUrl: './unit-tasks.component.html',
  styleUrls: ['./unit-tasks.component.scss']
})
export class UnitTasksComponent implements OnInit {

  @Input()
  tasks: UnitTask[];

  @Input()
  @Output()
  taskId2Status: Collection<boolean>;

  @Input()
  editable = false;

  newTaskName: string;

  constructor() {
  }

  ngOnInit() {
  }

  addTask(event: KeyboardEvent) {
    if (event.keyCode === 13 && this.editable && this.newTaskName) {
      const task: UnitTask = {id: null, name: this.newTaskName};
      this.tasks = this.tasks.concat(task);
      this.newTaskName = '';
    }
  }

  removeTask(task: UnitTask) {
    if (this.editable) {
      const taskId: number = task.id;
      this.tasks = this.tasks.filter((t: UnitTask) => t.id !== taskId);
    }
  }
}
