google.charts.load('current', {'packages':['gantt']});
    google.charts.setOnLoadCallback(drawChart);

    let projects = [];

    function daysToMilliseconds(days) {
      return days * 24 * 60 * 60 * 1000;
    }

    function addProject() {
      const name = document.getElementById('projectName').value.trim();
      const start = document.getElementById('startDate').value;
      const end = document.getElementById('endDate').value;

      if (!name || !start || !end) {
        alert('Please fill all fields.');
        return;
      }

      const startDate = new Date(start);
      const endDate = new Date(end);

      if (endDate < startDate) {
        alert('End date must be after start date.');
        return;
      }

      // Add project with dummy values for ID and dependencies
      projects.push({
        id: 'p' + projects.length,
        name: name,
        start: startDate,
        end: endDate,
        duration: null,
        percentComplete: 0,
        dependencies: null
      });

      updateProjectList();
      drawChart();

      // Clear inputs
      document.getElementById('projectName').value = '';
      document.getElementById('startDate').value = '';
      document.getElementById('endDate').value = '';
    }

    function updateProjectList() {
      const list = document.getElementById('projectList');
      list.innerHTML = '';
      projects.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.name} — ${p.start.toISOString().slice(0,10)} to ${p.end.toISOString().slice(0,10)}`;
        list.appendChild(li);
      });
    }

    function drawChart() {
      const data = new google.visualization.DataTable();
      data.addColumn('string', 'Task ID');
      data.addColumn('string', 'Task Name');
      data.addColumn('date', 'Start Date');
      data.addColumn('date', 'End Date');
      data.addColumn('number', 'Duration');
      data.addColumn('number', 'Percent Complete');
      data.addColumn('string', 'Dependencies');

      const rows = projects.map(p => [
        p.id,
        p.name,
        p.start,
        p.end,
        p.duration,
        p.percentComplete,
        p.dependencies
      ]);

      data.addRows(rows);

      const options = {
        height: 50 + projects.length * 40,
        gantt: {
          trackHeight: 30
        }
      };

      const chart = new google.visualization.Gantt(document.getElementById('chart_div'));
      chart.draw(data, options);
        }
