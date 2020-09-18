sampleBlob = {"intention": "Productivity", "mental_states": [1, 1, 1, 0, 0, 0, 0], "alcohol_last_night": 1,
    "cannabis_last_night": 0, "sleep": 2, "morning_supplements": "1", "morning_activity": [1, 0, 0, 0, ""],
    "todays_activities": "1", "eat_anything": 0, "stimulants": [0, 1, 0, 0, 0], "anything_else": "", "email":
    "luke@mysourcewellness.com", "date": "2020-09-14 17:15:30"}

const jsonFile = './prepare_all.json'

window.addEventListener('load', (event) => {
  const req = new Request(jsonFile)
  fetch(req)
    .then(response => response.json())
    .then(data => {
      jsonData = data;
      console.log(jsonData)
      main(data)
    })
    .catch(console.error)
});

function main(data) {
  filteredData = filterByEmail(data, 'mnicolebrennan@gmail.com')
  console.log(filteredData)
  console.log(filteredData.sort((first, second) => {
    return first.date < second.date
  }))


  var canv = document.getElementById('myChart');
  var chart = new Chart(canv, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  })
}

/* Takes a user's email and returns all responses in the set that match
 * that email
 * */
function filterByEmail(data, email) {
  console.log('email: ' + email)
  return data.filter((entry) => {
    return entry.email == email
  });
}

