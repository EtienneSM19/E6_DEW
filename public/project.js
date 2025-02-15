const projectList = document.getElementById('projectList');
const detailProject = document.getElementById('detailProject');
const taskName = document.querySelector('h3');
const description = document.querySelector('p');
const taskCountSpan = document.getElementById('taskCount');
const totalHoursSpan = document.getElementById('totalHours');
const showTasksButton = document.getElementById('showTasks');
const tasksList = document.getElementById('tasksList');
const deleteProjectButton = document.getElementById('deleteProject');

async function loadAllProjects(){
  try {
    const response = await fetch('/api/project');
    if(!response.ok) {
      throw new Error('Error al cargar los proyectos ' + response.status);
    }

    let projects = await response.json();

    [...projects].forEach(project => {
      let li = document.createElement('li');
      li.textContent = project.name;
      li.addEventListener('click', () => loadProjectDetails(project));
      li.id = project.id;
      projectList.append(li);
    })
    
  } catch(e) {
    console.error('Error al cargar todos los proyectos ' + e);
  }
}


async function loadProjectDetails(project) {
  try {
    const response = await fetch('/api/project/'+ project.id);
    if(!response.ok){
      throw new Error('Error al mostrar detalles del proyecto' + response.status);
    }
    const projectById = await response.json();
    taskName.textContent = projectById.name;
    description.textContent = projectById.description;
    taskCountSpan.textContent = projectById.taskCount;
    totalHoursSpan.textContent = projectById.totalHours;
    detailProject.className = '';
    showTasksButton.addEventListener('click', () => showTasks(project.id))
    deleteProjectButton.addEventListener('click', () => deleteProject(project.id));
  } catch(e) {
    console.error('Error al mostrar detalles del proyecto '+ e);
  }
}

async function showTasks(projectId) {
  try {
    const response = await fetch('/api/project/'+projectId+'/task');
    if(!response.ok){
      throw new Error('Error al mostrar las tareas ' + response.status);
    }
    const tasks = await response.json();
    tasksList.innerHTML = ''
    tasks.forEach(task => {
      let li = document.createElement('li');
      li.textContent = task.concept + ' | ' + task.duration;
      tasksList.append(li);
    })
  }
  catch(e){
    console.error('Error al mostrar las tareas ' + e);
  }
}

async function deleteProject(projectId) {
  try {
    const response = await fetch('/api/project/'+projectId)
    if(!response.ok){
      throw new Error('Error al borrar el proyecto ' + response.status);
    }
    
    const deleter = await response.json();
    console.log(deleter);
  } catch(e) {
    console.error('Error al borrar el proyecto ' + e);
  }
}

loadAllProjects();