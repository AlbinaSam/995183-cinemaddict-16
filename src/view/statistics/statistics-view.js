import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from '../smart-view';
import {createStaticticsTemplate} from './statistics.tpl';
import {PeriodsNames} from '../../consts';
import {statPeriods, createGenresMap} from '../../utils/statistics';

const renderWatchedFilmsChart = (chartCtx, films, period) => {

  const currentPeriodFilms = statPeriods[period](films);
  const genresMap = createGenresMap(currentPeriodFilms);

  const labels = Object.keys(genresMap);
  const data = Object.values(genresMap);

  const BAR_HEIGHT = 50;

  chartCtx.height = BAR_HEIGHT * labels.length;

  return new Chart(chartCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export default class StatisticsView extends SmartView {
  #films = null;
  #watchedFilmsChart = null;
  #currentPeriod = PeriodsNames.ALL_TIME;

  constructor(films) {
    super();

    this.#films = films.filter((film) => film.userDetails.alreadyWatched);

    this._filmData = {
      films: this.#films,
      currentPeriod: this.#currentPeriod
    };

    this.#setChart();
    this.#setPeriodChangeHandler();
  }

  get films() {
    return statPeriods[this.#currentPeriod](this.#films);
  }

  get template() {
    return createStaticticsTemplate(this.films);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#watchedFilmsChart) {
      this.#watchedFilmsChart.destroy();
      this.#watchedFilmsChart = null;
    }
  }

  restoreHandlers = () => {
    this.#setChart();
    this.#setPeriodChangeHandler();
  }

  #periodChangeHandler = (evt) => {
    evt.preventDefault();
    this.#currentPeriod = evt.target.value;

    this.updateData({
      films: this.films,
      currentPeriod: this.#currentPeriod});

    const currentActive = this.element.querySelector(`[value=${evt.target.value}]`);

    currentActive.checked = true;
  }

  #setPeriodChangeHandler = () => {
    this.element.querySelector('.statistic__filters').addEventListener('change', this.#periodChangeHandler);
  }

  #setChart = () => {
    const {films, currentPeriod} = this._filmData;
    const chartCtx = this.element.querySelector('.statistic__chart');

    this.#watchedFilmsChart = renderWatchedFilmsChart(chartCtx, films, currentPeriod);
  }
}
