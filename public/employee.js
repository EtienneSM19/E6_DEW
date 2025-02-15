const employeeList = document.getElementById('employeeList');

async function loadEmployees() {
  try {
    const response = await fetch('http://localhost:3000/api/employee');
    if(!response.ok){
      throw new Error('Error al cargar los empleados ' + response.status);
    }
    if(!sessionStorage.users) {
      sessionStorage.users = [];
    }
    let employees = await response.json();
    [...employees].forEach(employee => {
      let li = document.createElement('li');
      if(sessionStorage.users.includes(employee.id)) {
        li.className='marked';
      }
      li.id = employee.id;
      console.log(li.id);
      li.textContent = employee.name + ' | ' + employee.role + ' | ' + employee.hourCost + '€/hora';
      li.addEventListener('click', () => {
        if(li.className!='marked') {
            li.className='marked';
            sessionStorage.users = JSON.stringify([...JSON.parse(sessionStorage.users || '[]'), employee.id]);
        } else {
          li.className='';
          sessionStorage.users = JSON.stringify(JSON.parse(sessionStorage.users || '[]').filter(id => id != employee.id));
        }
      })
      employeeList.append(li);
    })
  } 
  catch (e) {
    console.error('Error al cargar los empleados ' + e);
  }
}

loadEmployees();