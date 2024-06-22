import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChartDataService {
  rawData: { [key: string]: Array<any> } = {};
  macroModus: boolean | undefined;
  labels: Array<string> = [];
  datasets: Array<any> = [];
  aggregatedData: { [key: string]: any } = {};
  chartDataPreparedEvent: EventEmitter<any> = new EventEmitter();

  constructor(private route: Router) {}

  prepareRawData(name: string, response: any, timespan: number) {
    if (timespan > 12) {
      this.macroModus = true;
    } else {
      this.macroModus = false;
    }
    const now = new Date();
    let allsets: Array<any> = [];
    response.forEach((set: any) => {
      if (this.isInTimeSpan(timespan, set.data()['date'], now)) {
        allsets.push(set.data());
      }
    });
    this.rawData[name] = allsets;
    this.route.navigateByUrl('home/chart');
  }

  isInTimeSpan(timeSpan: number, date: string, now: any) {
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const itemDate = this.parseDate(date);
    const timeDiff = Math.abs(now.getTime() - itemDate.getTime());
    const weekDifference = Math.floor(timeDiff / oneWeek);
    return weekDifference < timeSpan;
  }

  parseDate(date: string) {
    const [day, month, year] = date.split('.').map(Number);
    return new Date(year, month - 1, day);
  }

  prepareDataForChart() {
    if (this.macroModus) {
      Object.keys(this.rawData).forEach((exercise) => {
        this.aggregateDataByMonth(exercise);
      });
    } else {
      Object.keys(this.rawData).forEach((exercise) => {
        this.aggregateDataByWeek(exercise);
      });
    }
  }

  aggregateDataByMonth(exercise: any) {
    const monthlyData: { [key: string]: any[] } = {};
    this.rawData[exercise].forEach((set) => {
      const month = this.getMonthFromDate(this.parseDate(set.date));
      if (!monthlyData[month]) {
        monthlyData[month] = [];
      }
      monthlyData[month].push(set);
    });
    Object.keys(monthlyData)
      .sort()
      .forEach((month) => {
        const monthData = monthlyData[month];
        const dailyData: { [key: string]: any[] } = {};
        monthData.forEach((item) => {
          const day = this.getDayFromDate(this.parseDate(item.date));
          if (!dailyData[day]) {
            dailyData[day] = [];
          }
          dailyData[day].push(item);
        });
        Object.keys(dailyData).forEach((day) => {
          const dayData = dailyData[day];
          const averageData = this.calculateAverage(dayData, exercise);
          this.labels.push(`Monat ${month} Tag ${day}`);
          if (!this.aggregatedData[month]) {
            this.aggregatedData[month] = [];
          }
          this.aggregatedData[month].push(averageData);
        });
        this.labels = this.labels.filter(
          (item, index) => this.labels.indexOf(item) === index
        );
      });
    this.chartDataPreparedEvent.emit(true);
  }

  aggregateDataByWeek(exercise: string) {
    let obj = this.rawData[exercise].sort((a, b) => {
      const timeA = new Date(this.parseDate(a.date)).getTime();
      const timeB = new Date(this.parseDate(b.date)).getTime();
      if (timeA === timeB) {
        if (a.setNumber < b.setNumber) return -1;
        if (a.setNumber > b.setNumber) return 1;
      }
      if (timeA < timeB) return -1;
      if (timeA > timeB) return 1;

      return 0;
    });
    obj.forEach((set) => {
      Object.keys(set.results).forEach((result) => {
        let compositeKey = `${exercise}-${result}`;
        if (!this.aggregatedData[compositeKey]) {
          this.aggregatedData[compositeKey] = [];
        }
        this.aggregatedData[compositeKey].push({
          value: set.results[result]._value,
          setNumber: set.setNumber,
          date: set.date,
        });
      });
    });
    this.labels = [];
    this.chartDataPreparedEvent.emit(true);
  }

  createDataSetsForMonth(): Array<any> {
    let obj = Object.keys(this.aggregatedData).flatMap((key) => {
      return this.aggregatedData[key];
    });
    let arr = obj.reduce((acc: any, obj: any) => {
      Object.keys(obj).forEach((key) => {
        const [exercise, type] = key.split('-');
        const compositeKey = `${exercise}-${type}`;
        let exerciseTypeObj = acc.find(
          (item: any) => item.label === compositeKey
        );
        if (!exerciseTypeObj) {
          exerciseTypeObj = { label: compositeKey };
          exerciseTypeObj['data'] = [];
          exerciseTypeObj['backgroundColor'] = `rgb(${Math.floor(
            Math.random() * 256
          )},${Math.floor(Math.random() * 256)},${Math.floor(
            Math.random() * 256
          )})`;
          (exerciseTypeObj['borderWidth'] = 2),
            (exerciseTypeObj['fill'] = false),
            (exerciseTypeObj['yAxisID'] = type),
            acc.push(exerciseTypeObj);
        }
        exerciseTypeObj.data.push(obj[key]);
      });
      return acc;
    }, []);
    console.log(arr);
    return arr;
  }

  createDataSetsForWeek(): Array<any> {
    let arr: { [key: string]: any }[] = [];
    let sortedArr = this.sortAllData();

    sortedArr.forEach((item) => {
      let preLabel = Object.keys(item)[0];
      const [exercise, type] = preLabel.split('-');
      const compositeKey = `${exercise}-${type}`;
      let exerciseTypeObj = arr.find(
        (item: any) => item.label === compositeKey
      );
      if (!exerciseTypeObj) {
        exerciseTypeObj = { label: compositeKey };
        exerciseTypeObj['data'] = [];
        exerciseTypeObj['backgroundColor'] = `rgb(${Math.floor(
          Math.random() * 256
        )},${Math.floor(Math.random() * 256)},${Math.floor(
          Math.random() * 256
        )})`;
        (exerciseTypeObj['borderWidth'] = 2),
          (exerciseTypeObj['fill'] = false),
          (exerciseTypeObj['yAxisID'] = type),
          arr.push(exerciseTypeObj);
        item[Object.keys(item)[0]].forEach((set: any) => {
          this.labels.push(`${set.date}-${set.setNumber}`)
          exerciseTypeObj!['data'].push(set.value);
        });
      }
    });
    return arr;
  }

  sortAllData() {
    let obj = Object.keys(this.aggregatedData).map((item) => {
      return { [item]: this.aggregatedData[item] };
    });
    return obj.sort((a, b) => {
      const timeA = new Date(a[Object.keys(a)[0]][0]['date']).getTime();
      const timeB = new Date(b[Object.keys(b)[0]][0]['date']).getTime();
      if (timeA < timeB) return -1;
      if (timeA > timeB) return 1;
      return 0;
    });
  }

  generateScales(): any {
    let obj = [];
    if (this.macroModus) {
      obj = Object.keys(this.aggregatedData).flatMap((key) => {
        return this.aggregatedData[key];
      });
    } else {
      obj = Object.keys(this.aggregatedData).flatMap((key) => {
        return { [key]: this.aggregatedData[key] };
      });
    }

    let scales: { [key: string]: any } = obj.reduce(
      (acc: { [key: string]: any }, obj: any) => {
        Object.keys(obj).forEach((key) => {
          let measurement = key.split('-')[1];

          if (!acc[measurement]) {
            acc[measurement] = {
              display: true,
              scaleLabel: {
                display: true,
                labelString: measurement,
              },
              position: 'right',
              ticks: {
                beginAtZero: true,
              },
            };
          }
        });
        return acc;
      },
      {} as { [key: string]: any }
    );

    scales['x'] = {
      display: true,
      type: 'category',
      autoSkip: true,
      maxTicksLimit: 12,
      title: {
        display: true,
        text: this.macroModus ? 'month' : 'week',
      },
      font: {
        size: 12,
      },
      angle: -90,
      grid: {
        display: !this.macroModus ? false : true,
      },
      ticks: {
        display: !this.macroModus ? false : true,
      },
    };
    return scales;
  }

  getWeekFromDate(date: Date): string {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return `W${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}`;
  }

  getMonthFromDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
  }

  getDayFromDate(date: Date): string {
    return date.getDate().toString().padStart(2, '0');
  }

  calculateAverage(data: any, exercise: string) {
    const summedData = data.reduce((acc: any, item: any) => {
      Object.keys(item.results).forEach((key) => {
        if (!acc[exercise + '-' + key]) {
          acc[exercise + '-' + key] = 0;
        }

        acc[exercise + '-' + key] += item.results[key]._value;
      });
      return acc;
    }, {});

    const averageData: any = {};

    Object.keys(summedData).forEach((key) => {
      averageData[key] = summedData[key] / data.length;
    });
    return averageData;
  }
}
