import * as cron from 'node-cron';
import axios from 'axios';

// Función que contiene la tarea cron
export function scheduleSyncGames() {
  // Cronograma para ejecutar a las 2 AM todos los días
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('Iniciando sincronización...');
      
      // Realiza la solicitud GET al endpoint de sincronización
      const response = await axios.get('http://localhost:3000/games/sync'); // Asegúrate de que la URL esté bien configurada

      console.log(response.data);  // Esto imprimirá la respuesta del servidor, 'Sincronización completada con éxito' o el error correspondiente
    } catch (error) {
      console.error('Error al ejecutar la sincronización:', error);
    }
  });
}

// Puedes exportar la función para su uso en otros módulos

