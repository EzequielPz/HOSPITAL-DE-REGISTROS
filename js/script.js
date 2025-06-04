// Variables globales
let usuarios = [];
let pacientes = [];
let citas = [];
let pacienteId = 0;

// Función para mostrar u ocultar secciones
function toggleSection(id) {
  document.querySelectorAll('#authSection, #mainPage').forEach(sec => sec.classList.add('d-none'));
  document.getElementById(id).classList.remove('d-none');
}

// Navegación entre pantallas
document.getElementById('btnCrearCuenta')?.addEventListener('click', () => {
  toggleSection('authSection');
  document.getElementById('crearCuentaDiv').style.display = 'block';
  document.getElementById('loginDiv').style.display = 'none';
});
document.getElementById('btnIniciarSesion')?.addEventListener('click', () => {
  toggleSection('authSection');
  document.getElementById('loginDiv').style.display = 'block';
  document.getElementById('crearCuentaDiv').style.display = 'none';
});
document.getElementById('irAIniciarSesion')?.addEventListener('click', () => {
  toggleSection('authSection');
  document.getElementById('loginDiv').style.display = 'block';
  document.getElementById('crearCuentaDiv').style.display = 'none';
});
document.getElementById('irACrearCuenta')?.addEventListener('click', () => {
  toggleSection('authSection');
  document.getElementById('crearCuentaDiv').style.display = 'block';
  document.getElementById('loginDiv').style.display = 'none';
});

// Mostrar/Ocultar contraseñas
document.getElementById('mostrarContrasena')?.addEventListener('click', () => {
  const input = document.getElementById('contrasena');
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
});
document.getElementById('mostrarLoginContrasena')?.addEventListener('click', () => {
  const input = document.getElementById('loginContrasena');
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
});

// Crear cuenta con validación avanzada
document.getElementById('formCrearCuenta')?.addEventListener('submit', e => {
  e.preventDefault();
  const contrasena = document.getElementById('contrasena').value.trim();
  const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (e.target.checkValidity()) {
    if (!regexContrasena.test(contrasena)) {
      alert('La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.');
      return;
    }
    usuarios.push({
      nombre: document.getElementById('nombreUsuario').value.trim(),
      email: document.getElementById('emailUsuario').value.trim(),
      contrasena: contrasena
    });
    alert('Cuenta creada. Ahora inicia sesión.');
    e.target.reset();
  } else {
    e.target.classList.add('was-validated');
  }
});

// Inicio de sesión
document.getElementById('formLogin')?.addEventListener('submit', e => {
  e.preventDefault();
  const usuario = usuarios.find(u => u.nombre === document.getElementById('loginUsuario').value.trim());
  if (usuario) {
    const contrasenaIngresada = document.getElementById('loginContrasena').value.trim();
    if (usuario.contrasena === contrasenaIngresada) {
      alert('Bienvenido ' + usuario.nombre);
      toggleSection('mainPage');
      cargarDatos();
    } else {
      alert('Contraseña incorrecta.');
    }
  } else {
    alert('Usuario no encontrado.');
  }
});

// "Olvidé mi contraseña"
document.getElementById('btnOlvidasteContrasena')?.addEventListener('click', () => {
  const nombreUsuario = prompt('Ingresa tu nombre de usuario:');
  if (nombreUsuario) {
    const usuario = usuarios.find(u => u.nombre === nombreUsuario.trim());
    if (usuario) {
      alert(`Tu contraseña es: ${usuario.contrasena}`);
    } else {
      alert('Usuario no encontrado.');
    }
  }
});

// Cerrar sesión
document.getElementById('cerrarSesion')?.addEventListener('click', () => {
  toggleSection('authSection');
  document.getElementById('formPaciente').reset();
  document.getElementById('formCita').reset();
  document.querySelector('#tablaPacientes tbody').innerHTML = '';
  document.getElementById('listaCitas').innerHTML = '';
});

// Funciones para cargar y mostrar datos
function cargarDatos() {
  actualizarContadores();
  mostrarPacientes();
  mostrarCitas();
}

// Mostrar pacientes
function mostrarPacientes() {
  const tbody = document.querySelector('#tablaPacientes tbody');
  tbody.innerHTML = '';
  pacientes.forEach((p, index) => {
    // Asignar clase según gravedad
    let btnColor = '';
    switch(p.gravedad) {
      case 'Leve':
        btnColor = 'btn-leve';
        break;
      case 'Moderado':
        btnColor = 'btn-moderado';
        break;
      case 'Urgente':
        btnColor = 'btn-urgente';
        break;
      case 'Crítico':
        btnColor = 'btn-critico';
        break;
    }
    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${p.nombre}</td>
        <td>${p.edad}</td>
        <td>${p.genero}</td>
        <td>${p.documento}</td>
        <td>${p.sintomas}</td>
        <td><button class="btn btn-gravedad ${btnColor} btn-sm">${p.gravedad}</button></td>
        <td>${p.tratamiento}</td>
        <td>${p.medicamentos}</td>
        <td>${p.examenes}</td>
        <td><button class="btn btn-danger btn-sm" onclick="eliminarPaciente(${p.id})"><i class="bi bi-trash"></i></button></td>
      </tr>
    `;
  });
}

// Eliminar paciente
function eliminarPaciente(id) {
  pacientes = pacientes.filter(p => p.id !== id);
  mostrarPacientes();
  actualizarContadores();
}

// Registrar paciente
document.getElementById('formPaciente')?.addEventListener('submit', e => {
  e.preventDefault();
  const edadValor = parseInt(document.getElementById('edad').value);
  if (isNaN(edadValor) || edadValor <= 0) {
    alert('Edad debe ser mayor a 0');
    return;
  }
  const doc = document.getElementById('docIdentidad').value.trim();
  if (doc.length < 5) {
    alert('Documento debe tener al menos 5 caracteres');
    return;
  }
  pacientes.push({
    id: Date.now(),
    nombre: document.getElementById('nombreCompleto').value.trim(),
    edad: edadValor,
    genero: document.getElementById('genero').value,
    documento: doc,
    sintomas: document.getElementById('sintomas').value.trim(),
    gravedad: document.getElementById('nivel').value,
    tratamiento: document.getElementById('tratamiento').value.trim(),
    medicamentos: document.getElementById('medicamentos').value.trim(),
    examenes: document.getElementById('examenes').value
  });
  ordenarPacientes();
  mostrarPacientes();
  e.target.reset();
  alert('Paciente registrado');
  actualizarContadores();
  if (pacientes[pacientes.length - 1].gravedad === 'Crítico') {
    alert('Paciente en estado crítico!');
  }
});

// Ordenar pacientes por gravedad
function ordenarPacientes() {
  const orden = { 'Crítico': 1, 'Urgente': 2, 'Moderado': 3, 'Leve': 4 };
  pacientes.sort((a, b) => orden[a.gravedad] - orden[b.gravedad]);
}

// Mostrar citas
function mostrarCitas() {
  const ul = document.getElementById('listaCitas');
  ul.innerHTML = '';
  citas.forEach(c => {
    const li = document.createElement('li');
    li.className='list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML= `
      <div>
        <strong>Doctor:</strong> ${c.doctor}<br>
        <strong>Fecha:</strong> ${c.fecha}<br>
        <strong>Hora:</strong> ${c.hora}
      </div>
      <button class="btn btn-danger btn-sm" onclick="eliminarCita(${c.id})"><i class="bi bi-trash"></i></button>
    `;
    ul.appendChild(li);
  });
}

// Eliminar cita
function eliminarCita(id) {
  citas = citas.filter(c => c.id !== id);
  mostrarCitas();
}

// Actualizar contadores
function actualizarContadores() {
  document.getElementById('contadorPacientes').textContent = pacientes.length;
  document.getElementById('contadorCritico').textContent= pacientes.filter(p => p.gravedad==='Crítico').length;
  document.getElementById('contadorUrgente').textContent= pacientes.filter(p => p.gravedad==='Urgente').length;
  document.getElementById('contadorModerado').textContent= pacientes.filter(p => p.gravedad==='Moderado').length;
  document.getElementById('contadorLeve').textContent= pacientes.filter(p => p.gravedad==='Leve').length;
}

// Registrar cita
document.getElementById('formCita')?.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.checkValidity()) {
    citas.push({
      id: Date.now(),
      doctor: document.getElementById('doctorSelect').value,
      fecha: document.getElementById('fechaCita').value,
      hora: document.getElementById('horaCita').value
    });
    mostrarCitas();
    e.target.reset();
    alert('Cita agendada');
  } else {
    e.target.classList.add('was-validated');
  }
});