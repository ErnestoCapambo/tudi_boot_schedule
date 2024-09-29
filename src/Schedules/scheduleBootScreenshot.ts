import { schedule } from 'node-cron';
import axios from 'axios';

// Função que faz a requisição GET para a URL
async function scheduleBootScreenshot() {
  try {
    let url = 'http://127.0.0.1:8000/aviator_boot/screenshot/';

    const response = await axios.get(url, { maxRedirects: 1 });

  } catch (error) {
    console.error('Erro ao enviar dados para a api ', error)
  }
}

// Agenda a função para ser executada a cada 3 segundos
export default schedule('*/3 * * * * *', scheduleBootScreenshot);
