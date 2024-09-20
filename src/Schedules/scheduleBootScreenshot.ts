import { schedule } from "node-cron";
import axios from "axios";

async function scheduleBootScreenshot() {
    let url =  'http://127.0.0.1:8000/aviator_boot/screenshot'

    axios.get(url).then((response) => {
        return
    }).catch((error) => {
        return
    })
}

export default schedule('*/3 * * * * *', scheduleBootScreenshot)

