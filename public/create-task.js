const projectSelector = document.getElementById('project');
const defaultOption = document.createElement('option');
const inputConcept = document.getElementById('concept');
const inputDuration = document.getElementById('duration');
const divMessage = document.getElementById('message');

defaultOption.value = '';
defaultOption.textContent = "Selecciona un proyecto";
defaultOption.selected = true;
defaultOption.setAttribute('disabled', true);

projectSelector.append(defaultOption);

fetch('/api/project')
.then(response => response.json())
.then(projects => {
  projects.forEach(project => {
    let option = document.createElement('option');
    option.value = project.id;
    option.textContent = project.name;
    projectSelector.append(option);
  })
});

document.getElementById('taskForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const concept= inputConcept.value
  const duration= inputDuration.value
  const project_id= projectSelector.value

  fetch('/api/task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ concept, duration, project_id })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error en la petición');
    }
  })
  .then(data => {
    divMessage.textContent = 'Tarea creada con éxito';
    divMessage.classList.remove('error');
    document.getElementById('taskForm').reset();
})
  .catch(error => {
    divMessage.textContent = error;
    divMessage.classList.add('error');  
  })
})