import { Component, ViewChild, OnInit } from '@angular/core';
import { jqxChartComponent } from 'jqwidgets-ng/jqxchart';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map } from "rxjs";
import { History } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('myChart', { static: false }) myChart: jqxChartComponent;

  title = 'iot_project';

  private historyRef: AngularFireList<History>;
  public historyData: History[] = [];
  public chartData: any[] = [];
  public seriesGroups: any[] = [
    {
      type: 'line',
      series: [
        { dataField: 'Pulsation', displayText: 'Pulsation' }
      ],
      xAxis: {
        dataField: 'Date',
        type: 'date',
        baseUnit: 'minute',  // ou 'hour', 'minute' en fonction de la précision souhaitée
        formatFunction: (value: any) => {
          return value.toLocaleDateString();  // formatte la date
        }
      },
      valueAxis: {
        title: { text: 'Pulsation' },
        minValue: 0  // selon vos besoins
      }
    }
  ];
  public temperatureChartData: any[] = [];
  public temperatureSeriesGroups: any[] = [
    {
      type: 'line',
      series: [
        { dataField: 'Temperature', displayText: 'Temperature' }
      ],
      xAxis: {
        dataField: 'Date',
        type: 'date',
        baseUnit: 'day',
        formatFunction: (value: any) => {
          return value.toLocaleDateString();
        }
      },
      valueAxis: {
        title: { text: 'Temperature' },
        minValue: 0
      }
    }
  ];

  constructor(private db: AngularFireDatabase) {
    this.historyRef = db.list<History>('/HealthData');
    this.historyData.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
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
        console.log("Data from Firebase:", data);
        this.historyData = data;
        this.historyData.sort((a, b) => {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        });
        this.updatePulsationChartData();
        this.updateTemperatureChartData();
      });



  }
  getLastValue(type: 'temperature' | 'pulsation'): number {
    const latestData = this.historyData[this.historyData.length - 1]?.data;
    if (!latestData) return 0;
    return type === 'temperature' ? latestData.temperature : latestData.pulsation;
  }
  updatePulsationChartData(): void {
    this.chartData = this.historyData.map(h => ({
      Date: new Date(h.timestamp),
      Pulsation: h.data.pulsation
    }));
  }

  updateTemperatureChartData(): void {
    this.temperatureChartData = this.historyData.map(h => ({
      Date: new Date(h.timestamp),
      Temperature: h.data.temperature
    }));
  }

}