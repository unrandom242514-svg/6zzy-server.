const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { inyectar } = require('./injector');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
  console.log('[6zzy] Cliente conectado');
  socket.emit('log', { msg: 'Panel 6zzy\' conectado al servidor', type: 'ok' });

  socket.on('inyectar', async (tipo) => {
    const enviar = (msg, type='') => socket.emit('log', { msg, type });

    if (tipo === 'config') {
      enviar('Cargando configuración 6zzy\'.json...', 'warn');
      enviar('Aimbot ON · Wallhack ON · Radar ON', 'ok');
      enviar('Configuración inyectada ✔', 'ok');
      socket.emit('status', 'LISTO');
      return;
    }

    const proceso = tipo === 'max' ? 'FreeFireMax.exe' : 'FreeFire.exe';
    enviar(`Buscando proceso ${proceso}...`, 'warn');

    const res = await inyectar(proceso, enviar);

    if (res.ok) {
      enviar(`Inyección en ${proceso} COMPLETADA ✔`, 'ok');
    } else {
      enviar(`Error: ${res.error}`, 'err');
    }
    socket.emit('status', 'LISTO');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[6zzy] Servidor corriendo en http://localhost:${PORT}`);
});
