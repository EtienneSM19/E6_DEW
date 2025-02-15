const projectList = document.getElementById('projectList');
const detailProject = document.getElementById('detailProject');
const taskName = document.querySelector('h3');
const description = document.querySelector('p');
const taskCountSpan = document.getElementById('taskCount');
const totalHoursSpan = document.getElementById('totalHours');
let showTasksButton = document.getElementById('showTasks');
const tasksList = document.getElementById('tasksList');
let deleteProjectButton = document.getElementById('deleteProject');

let projectById = null;

function loadAllProjects() {
  try {
    fetch('/api/project')
      .then(response => response.json())
      .then(projects => {
        projectList.innerHTML = '';
        [...projects].forEach(project => {
          let li = document.createElement('li');
          li.textContent = project.name;
          li.dataset.id = project.id;
          projectList.append(li);
          li.addEventListener('click', () => loadProjectDetails(project));
        })
      })
  } catch (e) {
    console.error('Error al cargar todos los proyectos ' + e);
  }
}


async function loadProjectDetails(project) {
  const response = await fetch('/api/project/' + project.id);
  if (!response.ok) {
    throw new Error('Error al mostrar detalles del proyecto' + response.status);
  }
  projectById = await response.json();
  taskName.textContent = projectById.name;
  description.textContent = projectById.description;
  taskCountSpan.textContent = projectById.taskCount;
  totalHoursSpan.textContent = projectById.totalHours;
  detailProject.className = '';

  const newShowTasksButton = showTasksButton.cloneNode(true);
  showTasksButton.parentNode.replaceChild(newShowTasksButton, showTasksButton);
  showTasksButton = newShowTasksButton;

  const newDeleteProjectButton = deleteProjectButton.cloneNode(true);
  deleteProjectButton.parentNode.replaceChild(newDeleteProjectButton, deleteProjectButton);
  deleteProjectButton = newDeleteProjectButton;

  showTasksButton.addEventListener('click', async () => {

    const response = await fetch('/api/project/' + projectById.id + '/task');
    if (!response.ok) {
      throw new Error('Error al mostrar las tareas ' + response.status);
    }
    console.log(projectById.id);
    const tasks = await response.json();
    tasksList.innerHTML = ''
    tasks.forEach(task => {
      let li = document.createElement('li');
      li.textContent = task.concept + ' | ' + task.duration;
      tasksList.append(li);
    })
  })

  deleteProjectButton.addEventListener('click', async () => {
    await fetch('/api/project/' + projectById.id, {method: 'DELETE'})
    .then(response => {
      if (!response.ok) {
        alert('El proyecto con id ' + projectById.id + ' tiene tareas asociadas');
      } else {
        detailProject.className = 'hidden';
        projectList.querySelector(`li[data-id="${projectById.id}"]`).remove();
        loadAllProjects();
      }
    })
  });

}
loadAllProjects();