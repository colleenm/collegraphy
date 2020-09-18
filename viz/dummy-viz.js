/* I apologize for all the code in this file.
 * Notes:
 *  - constants are defined immediately before teh function in which they are used
 *
 * - cmckenzie
 */

/*
 * TODO
 *  - none of this accounts for dates with no data
 *  - programmatic screenshots...?
 */

const jsonFile = './all_metrics_clean.json'

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
  // TODO get rid of first part of if statement, this field must exist
  if (data['start_date'] && data['start_date'] != '2020-09-9') {
    startDateIndex = dates.indexOf(data['start_date'])
    if (startDateIndex == -1) {
      throw 'Unknown start date for user ' + currentUser + ' : ' + data['start_date']
    }
  }

  let moodChartData1 = createMoodChartData(userData, startDateIndex, 1);
  let moodChartCanv1 = document.getElementById('moodChart1');
  createMoodChart(moodChartCanv1, moodChartData1);

  let moodChartData2 = createMoodChartData(userData, startDateIndex, 2);
  let moodChartCanv2 = document.getElementById('moodChart2');
  createMoodChart(moodChartCanv2, moodChartData2);

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
        display: true,
        text: 'TITLE GOES HERE'
      },
      legend: {
        position: 'bottom'
      },
      scales: {
        yAxes: [
          {
            id: 'likert',
            position: 'left',
            ticks: {
              min: 0,
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

const dates = ['2020-09-9', '2020-09-10', '2020-09-11',
  '2020-09-12', '2020-09-13', '2020-09-14', '2020-09-15',
  '2020-09-16', '2020-09-17', '2020-09-18']
const dateLabels = ['9/9', '9/10', '9/11', '9/12', '9/13', '9/14', '9/15', '9/16', '9/17', '9/18'];

const firstChartMoods = ['easy', 'focused', 'switching', 'productive'];
const firstChartMoodLabels = ['Ease', 'Focus', 'Ease of task switching', 'Productivity'];
const secondChartMoods = ['relaxed', 'confident', 'emotional-others', 'emotional-self'];
const secondChartMoodLabels = ['Relaxed', 'Confident', 'Emotional awareness (others)', 'Emotional awareness (self)'];

function createMoodChartData(data, startDateIndex, chartNumber) {
  let moods = chartNumber == 1 ? firstChartMoods : secondChartMoods
  let moodLabels = chartNumber == 1 ? firstChartMoodLabels : secondChartMoodLabels

  return {
    labels: dateLabels.slice(startDateIndex),
    datasets: [
      {
        data: data[moods[0]],
        yAxisID: 'likert',
        label: moodLabels[0],
        backgroundColor: 'rgba(0,0,0,0)', //'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },

      {
        data: data[moods[1]],
        yAxisID: 'likert',
        label: moodLabels[1],
        //backgroundColor: 'rgba(54, 162, 235, 0.2)',
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },

      {
        data: data[moods[2]],
        yAxisID: 'likert',
        label: moodLabels[2],
        //backgroundColor: 'rgba(255, 206, 86, 0.2)',
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      },

      {
        data: data[moods[3]],
        label: moodLabels[3],
        yAxisID: 'likert',
        //backgroundColor: 'rgba(75, 192, 192, 0.2)',
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },

      // invisible bars to change alignment of sleep bar
      {
        type: 'bar',
        data: data['sleep'],
        yAxisID: 'sleep',
        label: '',
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(255,0,0,0)',
        borderWidth: 1,
        barThickness: 12,
      },

      {
        type: 'bar',
        data: data['sleep'],
        yAxisID: 'sleep',
        label: '',
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,255,0,0)',
        borderWidth: 1,
        barThickness: 24
      },

      {
        type: 'bar',
        data: data['sleep'],
        yAxisID: 'sleep',
        label: 'Sleep quality',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderColor: 'rgba(0,0,0,0.6)',
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
        display: true,
        text: 'TITLE GOES HERE'
      },
      legend: {
        position: 'bottom'
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
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
        barPercentage: barPercentage,
        categoryPercentage: categoryPercentage,
        //barThickness: barThickness
      },

      {
        data: data['food'],
        yAxisID: 'food',
        label: 'This morning\'s meal',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
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


function createJournalTable(data, startDateIndex) {
  let tableEl = document.getElementById('journalTable');
  let tBody = document.createElement('tbody');

  let titleRow = document.createElement('tr')
  let title = document.createElement('th')
  title.setAttribute('colspan', 2)
  title.appendChild(document.createTextNode('Intentions & notes'))
  titleRow.appendChild(title)
  tBody.appendChild(titleRow)

  // TODO how to deal with blank days?
  for (item in dates.slice(startDateIndex)) {
    let row = document.createElement('tr')
    let dateCell = document.createElement('td')
    dateCell.classList.add('journal-date')
    dateCell.appendChild(document.createTextNode(dateLabels[item]));
    row.appendChild(dateCell)

    let infoCell = document.createElement('td')
    infoCell.classList.add('journal-info')

    // Your intention
    let intentionHeader = document.createElement('div')
    intentionHeader.classList.add('intention-heading')
    intentionHeader.append(document.createTextNode('Your intention'))

    let intention = document.createElement('div')
    intention.classList.add('intention-content')
    if (data['intention'][item] != null) {
      intention.append(document.createTextNode(data['intention'][item]))
    } else {
      let noneToday = document.createElement('em')
      noneToday.append(document.createTextNode('No intention set'))
      intention.append(noneToday)
    }

    // How'd that go?
    let intentionSuccessHeader = document.createElement('div')
    intentionSuccessHeader.classList.add('intention-heading')
    intentionSuccessHeader.append(document.createTextNode('How\'d that go?'))

    let intentionSuccess = document.createElement('div')
    intentionSuccess.classList.add('intention-content')

    if (data['intention-success'][item] != null) {
      intentionSuccess.append(document.createTextNode(data['intention-success'][item]))
    } else {
      let noneToday = document.createElement('em')
      noneToday.append(document.createTextNode('No response'))
      intentionSuccess.append(noneToday)
    }

    // Morning notes
    let prepareNotesHeader = document.createElement('div')
    prepareNotesHeader.classList.add('intention-heading')
    prepareNotesHeader.append(document.createTextNode('Your morning notes'))

    let prepareNotes = document.createElement('div')
    prepareNotes.classList.add('intention-content')

    if (data['prepare-notes'][item] != null) {
      prepareNotes.append(document.createTextNode(data['prepare-notes'][item]))
    } else {
      let noneToday = document.createElement('em')
      noneToday.append(document.createTextNode('No morning notes'))
      prepareNotes.append(noneToday)
    }

    // Reflections
    let reflectNotesHeader = document.createElement('div')
    reflectNotesHeader.classList.add('intention-heading')
    reflectNotesHeader.append(document.createTextNode('Your reflections'))

    let reflectNotes = document.createElement('div')
    reflectNotes.classList.add('intention-content')

    if (data['reflect-notes'][item] != null) {
      reflectNotes.append(document.createTextNode(data['reflect-notes'][item]))
    } else {
      let noneToday = document.createElement('em')
      noneToday.append(document.createTextNode('No other reflections'))
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

