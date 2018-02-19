import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {FileHolder} from '../../model/file-holder';

@Component({
  selector: 'app-data-reader',
  templateUrl: './data-reader.component.html',
  styleUrls: ['./data-reader.component.css']
})
export class DataReaderComponent implements OnInit {

  @Input()
  buttonTitle: string;

  @Output()
  pending: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  fileRead: EventEmitter<FileHolder> = new EventEmitter<FileHolder>();

  isPending = false;

  constructor() {
  }

  ngOnInit() {
  }

  onFileChange(files: FileList) {

    if (files.length !== 0) {
      this.isPending = true;
      this.pending.emit(true);
    }


    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];

      const img = document.createElement('img');
      img.src = window.URL.createObjectURL(file);

      const reader: FileReader = new FileReader();
      reader.addEventListener('load', (event: Event) => {
        const target: FileReader = event.target as FileReader;
        const fileHolder: FileHolder = new FileHolder(target.result, file);
        this.isPending = false;
        this.pending.emit(false);
        this.fileRead.emit(fileHolder);
      }, false);

      reader.readAsText(file);
    }

  }
}
