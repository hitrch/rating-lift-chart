import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import Chart from 'chart.js/auto';

const label = (tooltipItem) => {
  const str = [tooltipItem.dataset.label];
  str.push('Left Rating: ' + (tooltipItem.dataIndex + 1));
  str.push('Lift: ' + tooltipItem.dataset.data[tooltipItem.dataIndex] + '%');
  return str;
};

@Component({
  selector: 'app-rating-lift-chart',
  templateUrl: './rating-lift-chart.component.html',
  styleUrls: ['./rating-lift-chart.component.css']
})
export class RatingLiftChartComponent implements AfterViewInit {
  @ViewChild('lineCanvas') lineCanvas: ElementRef;
  @ViewChild('fileInput') fileInput;
  lineChart: any;
  fillStatus = true;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.lineChartMethod();
  }

  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label,
              title() {
                return '';
              }
            }
          }
        }
      },
      data: {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [
          {
            label: '1 Previous Order',
            fill: this.fillStatus,
            backgroundColor: 'rgba(26, 10, 255, 0.3)',
            borderColor: 'blue',
            pointBorderColor: 'blue',
            data: []
          },
          {
            label: '2 Previous Order',
            fill: this.fillStatus,
            backgroundColor: 'rgba(255, 10, 10, 0.3)',
            borderColor: 'red',
            pointBorderColor: 'red',
            data: []
          },
          {
            label: '3 Previous Order',
            fill: this.fillStatus,
            backgroundColor: 'rgba(255, 242, 0, 0.3)',
            borderColor: 'yellow',
            pointBorderColor: 'yellow',
            data: []
          },
          {
            label: '4+ Previous Order',
            fill: this.fillStatus,
            backgroundColor: 'rgba(60, 255, 0, 0.3)',
            borderColor: 'green',
            pointBorderColor: 'green',
            data: []
          }
        ]
      }
    });
  }

  onFileChanged(event: Event) {
    if ((event.target as HTMLInputElement).files[0] && (event.target as HTMLInputElement).files[0].type === 'application/json') {
      const fileReader = new FileReader();
      fileReader.readAsText((event.target as HTMLInputElement).files[0], 'UTF-8');
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          this.updateData(JSON.parse(fileReader.result));
        }
      };
    }
  }

  updateData(data) {
    const organizedData = [[], [], [], []];
    data.forEach(row => {
      switch (row.prevOrders) {
        case '1':
          organizedData[0].push(row);
          break;
        case '2':
          organizedData[1].push(row);
          break;
        case '3':
          organizedData[2].push(row);
          break;
        default:
          organizedData[3].push(row);
          break;
      }
    });

    this.updateChartData(organizedData[0]);
    this.updateChartData(organizedData[1]);
    this.updateChartData(organizedData[2]);
    this.updateChartData(organizedData[3]);
  }

  updateChartData(data) {
    switch (data[0].prevOrders) {
      case '1':
        this.lineChart.data.datasets[0].data = data.reduce((array, item) => {
          array.push(item.ltvLift);
          return array;
        }, []);
        break;
      case '2':
        this.lineChart.data.datasets[1].data = data.reduce((array, item) => {
          array.push(item.ltvLift);
          return array;
        }, []);
        break;
      case '3':
        this.lineChart.data.datasets[2].data = data.reduce((array, item) => {
          array.push(item.ltvLift);
          return array;
        }, []);
        break;
      default:
        this.lineChart.data.datasets[3].data = data.reduce((array, item) => {
          array.push(item.ltvLift);
          return array;
        }, []);
        break;
    }

    this.lineChart.update();
  }

  onFillStatusChange() {
    this.lineChart.data.datasets.forEach(set => {
      set.fill = this.fillStatus;
    });
    this.lineChart.update();
  }

  deleteChartInfo() {
    this.lineChart.data.datasets.forEach(set => {
      set.data = [];
    });
    this.fileInput.nativeElement.value = '';
    this.lineChart.update();
  }

}
