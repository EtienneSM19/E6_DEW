const employeeList = document.getElementById('employeeList');

async function loadEmployees() {
  try {
    const response = await fetch('http://localhost:3000/api/employee');
    if(!response.ok){
      throw new Error('Error al cargar los empleados ' + response.status);
    }
    let employees = await response.json();
    localStorage.users = [];
    [...employees].forEach(employee => {
      let li = document.createElement('li');
      li.id = employee.id;
      console.log(li.id);
      li.textContent = employee.name + ' | ' + employee.role + ' | ' + employee.hourCost + '€/hora';
      li.addEventListener('click', () => {
        if(li.className!='marked') {
          li.className='marked';
        } else {
          li.className='';
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