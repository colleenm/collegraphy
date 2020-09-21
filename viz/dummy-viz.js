/* I apologize for all the code in this file.
 * Notes:
 *  - constants are defined immediately before teh function in which they are used
 *
 * - cmckenzie
 */

/*
 * TODO
 *  - none of this accounts for dates with no data
 */

const jsonFile = './all_metrics_clean.json'

const dates = ['2020-09-09', '2020-09-10', '2020-09-11',
  '2020-09-12', '2020-09-13', '2020-09-14', '2020-09-15',
  '2020-09-16', '2020-09-17', '2020-09-18']
const dateLabels = ['9/9', '9/10', '9/11', "9/12", '9/13', '9/14', '9/15',
  '9/16', '9/17', '9/18'];

window.addEventListener('load', (event) => {
  const req = new Request(jsonFile)
  fetch(req)
    .then(response => response.json())
    .then(data => {
      jsonData = data;
      main(data)
    })
    .catch(console.error)
});

function main(data) {
  let qString = window.location.search
  let email = qString.slice(qString.indexOf('=') + 1)
  console.log('Setting current user to ' + email)
  currentUser = email
  let userData = data[currentUser]
  console.log('data for this user:')
  console.log(userData)

  let startDateIndex = 0;

  if (userData['start_date'] && userData['start_date'] != '2020-09-9') {
    startDateIndex = dates.indexOf(userData['start_date'])
    if (startDateIndex == -1) {
      throw 'Unknown start date for user ' + currentUser + ' : ' + data['start_date']
    }
  }

  Chart.defaults.global.defaultFontSize = 13;

  let dateTableEl = document.getElementById('dateTable')
  createDateTable(dateTableEl, data, startDateIndex)

  let moodChartData = createMoodChartData(userData, startDateIndex);
  let moodChartCanv = document.getElementById('moodChart');
  createMoodChart(moodChartCanv, moodChartData);

  let confoundChartData = createConfoundChartData(userData, startDateIndex);
  createConfoundChart(confoundChartData);

  createConfoundTable(userData, startDateIndex);

  createJournalTable(userData, startDateIndex);
}

function createMoodChart(canv, chartData) {
  let chart = new Chart(canv, {
    type: 'line',
    data: chartData,
    options: {
      responsive: false,
      title: {
        display: false,
      },
      legend: {
        position: 'right'
      },
      defaultFontSize: 16,

      scales: {
        yAxes: [
          {
            id: 'likert',
            position: 'left',
            ticks: {
              min: 0,
              max: 4,
              callback: function (value) {
                let labels = ['Strongly disagree', 'Disagree', 'Neither', 'Agree', 'Strongly agree']
                return labels[value]
              }
            }
          },
          {
            id: 'sleep',
            position: 'right',
            ticks: {
              min: 1,
              max: 5,
              stepSize: 1,
            }
          }
        ]
      }
    }
  })
}

function createDateTable(tableEl, data, startDateIndex) {
  let datesRow = document.createElement('tr')
  for (dateLabel of dateLabels.slice(startDateIndex)) {
    let dateCell = document.createElement('td')
    if (dateLabel === '9/12' || dateLabel === '9/15' ||
      dateLabel === '9/16') {
      dateCell.classList.add('left-cell-border')
    }
    if (dateLabel === '9/12' || dateLabel === '9/13' || dateLabel === '9/14' ||
      dateLabel === '9/16' || dateLabel === '9/17' || dateLabel === '9/18') {
      dateCell.classList.add('color-cell')
    }
    dateCell.append(dateLabel)
    datesRow.append(dateCell)
  }

  let formulaRow = document.createElement('tr')

  let baseline = document.createElement('td')
  let baselineDays = 3 - startDateIndex
  baseline.setAttribute('colspan', baselineDays)
  baseline.append('Baseline')
  formulaRow.append(baseline)


  let formulaA = document.createElement('td')
  formulaA.setAttribute('colspan', 3)
  formulaA.classList.add('color-cell', 'left-cell-border')
  formulaA.append('Formula A')
  formulaRow.append(formulaA)

  let dayOff = document.createElement('td')
  dayOff.setAttribute('colspan', 1)
  dayOff.classList.add('left-cell-border')
  dayOff.append('Day off')
  formulaRow.append(dayOff)


  let formulaB = document.createElement('td')
  formulaB.setAttribute('colspan', 3)
  formulaB.classList.add('color-cell', 'left-cell-border')
  formulaB.append('Formula B')
  formulaRow.append(formulaB)


  tableEl.append(datesRow)
  tableEl.append(formulaRow)

}

const firstChartMoods = ['easy', 'focused', 'switching', 'productive'];
const firstChartMoodLabels = ['Ease', 'Focus', 'Ease of task switching', 'Productivity'];
const secondChartMoods = ['relaxed', 'confident', 'emotional-others', 'emotional-self'];
const secondChartMoodLabels = ['Relaxed', 'Confident', 'Emotional awareness (others)', 'Emotional awareness (self)'];

function createMoodChartData(data, startDateIndex, chartNumber) {
  let moods = chartNumber == 1 ? firstChartMoods : secondChartMoods
  let moodLabels = chartNumber == 1 ? firstChartMoodLabels : secondChartMoodLabels
  let lineWidth = 3;
  let opacity = .6;

  return {
    labels: dateLabels.slice(startDateIndex),
    datasets: [
      {
        data: data[moods[0]],
        yAxisID: 'likert',
        label: firstChartMoodLabels[0],
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(243,93,147,' + opacity + ')',
        borderWidth: lineWidth
      },

      {
        data: padValues(data[moods[1]], 0.05),
        //data: data[moods[1]],
        yAxisID: 'likert',
        label: firstChartMoodLabels[1],
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(255,153,0,' + opacity + ')',
        borderWidth: lineWidth
      },

      {
        data: padValues(data[moods[2]], 0.1),
        //data: data[moods[2]],
        yAxisID: 'likert',
        label: firstChartMoodLabels[2],
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(44,232,0,' + opacity + ')',
        borderWidth: lineWidth
      },

      {
        data: padValues(data[moods[3]], .15),
        //data: data[moods[3]],
        label: firstChartMoodLabels[3],
        yAxisID: 'likert',
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(11,113,0,' + opacity + ')',
        borderWidth: lineWidth
      },

      /* TEST OF ALL LINES ON SAME GRAPH *************************/

      {
        data: padValues(data[secondChartMoods[1]], 0.2),
        //data: data[secondChartMoods[0]],
        yAxisID: 'likert',
        label: secondChartMoodLabels[0],
        backgroundColor: 'rgba(0,0,0,0)', //'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(73,212,200,' + opacity + ')',
        borderWidth: lineWidth
      },

      {
        data: padValues(data[secondChartMoods[1]], 0.25),
        //data: data[moods[1]],
        yAxisID: 'likert',
        label: secondChartMoodLabels[1],
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(66,157,255,' + opacity + ')',
        borderWidth: lineWidth
      },

      {
        data: padValues(data[secondChartMoods[2]], 0.3),
        //data: data[moods[2]],
        yAxisID: 'likert',
        label: secondChartMoodLabels[2],
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(100,61,28,' + opacity + ')',
        borderWidth: lineWidth
      },

      {
        data: padValues(data[secondChartMoods[3]], .35),
        //data: data[moods[3]],
        label: secondChartMoodLabels[3],
        yAxisID: 'likert',
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(100,100,100,' + opacity + ')',
        borderWidth: lineWidth
      },







      // invisible bars to change alignment of sleep bar
      {
        type: 'bar',
        data: data['sleep'],
        yAxisID: 'sleep',
        label: '',
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 1,
        barThickness: 12,
      },

      {
        type: 'bar',
        data: data['sleep'],
        yAxisID: 'sleep',
        label: '',
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 1,
        barThickness: 24
      },

      {
        type: 'bar',
        data: data['sleep'],
        yAxisID: 'sleep',
        label: 'Sleep quality',
        backgroundColor: 'rgba(68,63,181,0.3)',
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        barThickness: 24,
      },


      {
        type: 'bar',
        data: data['sleep'],
        yAxisID: 'sleep',
        label: '',
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,0,255,0)',
        borderWidth: 1,
        barThickness: 12
      }
    ]
  }
}


function createConfoundChart(chartData) {
  let canv = document.getElementById('confoundChart');
  let chart = new Chart(canv, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: false,
      title: {
        display: false,
      },
      legend: {
        position: 'right'
      },
      scales: {
        yAxes: [
          {
            id: 'alcohol',
            position: 'left',
            ticks: {
              min: 0,
              max: 3,
              callback: function (value) {
                let labels = ['0', '1', '2-3', '4+']
                return labels[value]
              }
            }
          },
          {
            id: 'food',
            position: 'right',
            ticks: {
              min: 0,
              max: 3,
              callback: function (value) {
                let labels = ['None', 'Light', 'Medium', 'Heavy']
                return labels[value]
              }
            }
          }
        ]
      }
    }
  })
}


function padValues(data, padding) {
  return data.map((value) => Math.min(4, value + padding))
}

function createConfoundChartData(data, startDateIndex) {
  let barThickness = 28
  let barPercentage = .6
  let categoryPercentage = .8

  return {
    labels: dateLabels.slice(startDateIndex),
    datasets: [
      {
        data: data['alcohol'],
        yAxisID: 'alcohol',
        label: 'Drinks last night',
        //backgroundColor: 'rgba(255, 206, 86, 0.2)',
        backgroundColor: 'rgba(68,63,181,0.5)',
        //borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        barPercentage: barPercentage,
        categoryPercentage: categoryPercentage,
        //barThickness: barThickness
      },

      {
        data: data['food'],
        yAxisID: 'food',
        label: 'This morning\'s meal',
        //backgroundColor: 'rgba(75, 192, 192, 0.2)',
        backgroundColor: 'rgba(66,157,255,.5)',
        borderColor: 'rgba(0,0,0,0)',
        //borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barPercentage: barPercentage,
        categoryPercentage: categoryPercentage,
        //barThickness: barThickness
      }
    ]
  };
}


const confounds = ['canna', 'supps', 'caffeine', 'nicotine', 'adhd', 'other-stim', 'run', 'yoga', 'resist-train', 'other-exer', 'meditate']
const confoundLabels = {
  'canna': 'Non-Source Cannabis',
  'supps':'Supplements',
  'caffeine': 'Caffeine',
  'nicotine': 'Nicotine',
  'adhd': 'ADHD meds',
  'other-stim': 'Other stimulants',
  'run': 'Running',
  'yoga': 'Yoga',
  'resist-train': 'Resistance training',
  'other-exer': 'Other exercise',
  'meditate': 'Meditation'
}

const booleanCellClass = 'boolCell'

function createConfoundTable(data, startDateIndex) {
  let tableEl = document.getElementById('confoundTable');
  let tBody = document.createElement('tbody');

  for (item of confounds) {
    // TODO make sure Eugene didn't include all-null entries
    if (data[item]) {
      let row = document.createElement('tr')
      let titleCell = document.createElement('td')
      titleCell.appendChild(document.createTextNode(confoundLabels[item]));
      row.appendChild(titleCell)
      for (day of data[item]) {
        let cell = document.createElement('td');
        cell.classList.add(booleanCellClass);
        let text = day ? '•' : ''
        let textEl = document.createTextNode(text)
        cell.appendChild(textEl)
        row.appendChild(cell)
      }
      tBody.appendChild(row)
    }
  }

  let dateRow = document.createElement('tr')
  let labelCell = document.createElement('td')
  labelCell.appendChild(document.createTextNode('Day'))
  dateRow.appendChild(labelCell)
  for (let i = startDateIndex; i < dateLabels.length; i++) {
    let cell = document.createElement('td')
    cell.appendChild(document.createTextNode(dateLabels[i]));
    dateRow.appendChild(cell);
  }

  tBody.appendChild(dateRow)

  tableEl.appendChild(tBody)
}

function newlineToBr(string) {
  let chunks = string.split('\n\n')
  let nodeList = [];
  for (chunk of chunks) {
    nodeList.push(chunk.replace(/\n/g, ''))
    if (chunks.indexOf(chunk) != (chunks.length - 1) &&
      chunks.length != 1) {
      nodeList.push(document.createElement('br'))
      nodeList.push(document.createElement('br'))
    }
  }
  return nodeList
}

function createJournalTable(data, startDateIndex) {
  let tableEl = document.getElementById('journalTable');
  let tBody = document.createElement('tbody');

  let slicedDateLabels = dateLabels.slice(startDateIndex)
  for (item in dates.slice(startDateIndex)) {
    let row = document.createElement('tr')
    let dateCell = document.createElement('td')
    dateCell.classList.add('journal-date')
    dateCell.append(slicedDateLabels[item])
    row.appendChild(dateCell)

    let infoCell = document.createElement('td')
    infoCell.classList.add('journal-info')

    // Your intention
    let intentionHeader = document.createElement('div')
    intentionHeader.classList.add('intention-heading')
    intentionHeader.append('Your intention')

    let intention = document.createElement('div')
    intention.classList.add('intention-content')
    if (data['intention'] && data['intention'][item] != null) {
      intention.append(...newlineToBr(data['intention'][item]))
    } else {
      let noneToday = document.createElement('em')
      noneToday.append('No intention set')
      intention.append(noneToday)
    }

    // How'd that go?
    let intentionSuccessHeader = document.createElement('div')
    intentionSuccessHeader.classList.add('intention-heading')
    intentionSuccessHeader.append('How\'d that go?')

    let intentionSuccess = document.createElement('div')
    intentionSuccess.classList.add('intention-content')

    if (data['intentino-success'] && data['intention-success'][item] != null) {
      intentionSuccess.append(...newlineToBr(data['intention-success'][item]))
    } else {
      let noneToday = document.createElement('em')
      noneToday.append('No response')
      intentionSuccess.append(noneToday)
    }

    // Morning notes
    let prepareNotesHeader = document.createElement('div')
    prepareNotesHeader.classList.add('intention-heading')
    prepareNotesHeader.append('Your morning notes')

    let prepareNotes = document.createElement('div')
    prepareNotes.classList.add('intention-content')

    if (data['prepare-notes'] && data['prepare-notes'][item] != null) {
      prepareNotes.append(...newlineToBr(data['prepare-notes'][item]))
    } else {
      let noneToday = document.createElement('em')
      noneToday.append('No morning notes')
      prepareNotes.append(noneToday)
    }

    // Reflections
    let reflectNotesHeader = document.createElement('div')
    reflectNotesHeader.classList.add('intention-heading')
    reflectNotesHeader.append('Your reflections')

    let reflectNotes = document.createElement('div')
    reflectNotes.classList.add('intention-content')

    if (data['reflect-notes'] && data['reflect-notes'][item] != null) {
      reflectNotes.append(...newlineToBr(data['reflect-notes'][item]))
    } else {
      let noneToday = document.createElement('em')
      noneToday.append('No other reflections')
      reflectNotes.append(noneToday)
    }

    let leftDiv = document.createElement('div')
    leftDiv.classList.add('intention-section')
    leftDiv.appendChild(intentionHeader)
    leftDiv.appendChild(intention)
    leftDiv.appendChild(intentionSuccessHeader)
    leftDiv.appendChild(intentionSuccess)

    let rightDiv = document.createElement('div')
    rightDiv.classList.add('intention-section')
    rightDiv.appendChild(prepareNotesHeader)
    rightDiv.appendChild(prepareNotes)
    rightDiv.appendChild(reflectNotesHeader)
    rightDiv.appendChild(reflectNotes)

    infoCell.appendChild(leftDiv)
    infoCell.appendChild(rightDiv)
    row.appendChild(infoCell)
    tBody.appendChild(row)
  }

  tableEl.appendChild(tBody)
}

