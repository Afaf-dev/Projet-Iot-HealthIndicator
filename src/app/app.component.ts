import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map } from "rxjs"
import { History } from './models/models'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'iot_project';

  private historyRef: AngularFireList<History>;
  public historyData: History[] = [];

  constructor(private db: AngularFireDatabase) {
    this.historyRef = db.list<History>('/HealthData');
  }

  ngOnInit(): void {
    this.historyRef.snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c =>
          ({
            key: c.payload.key,
            ...c.payload.val()
          } as History)
          )
        )
      )
      .subscribe(data => {
        this.historyData = data;
      });
  }
}
