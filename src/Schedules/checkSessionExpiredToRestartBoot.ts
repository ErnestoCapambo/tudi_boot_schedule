import { schedule } from "node-cron";
import axios from "axios";


export async function checkSessionExpiredToRestartBoot() {
    try {
        let url = 'http://127.0.0.1:8000/aviator_boot/check_session_to_restart_boot/';
    
        await axios.get(url, { maxRedirects: 1 });

      } catch (error) {
        console.error('Erro ao enviar dados para a api ', error)
      }
}

export default schedule('*/10 * * * * *', checkSessionExpiredToRestartBoot)