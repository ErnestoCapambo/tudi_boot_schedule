import scheduleBootScreenshot from './scheduleBootScreenshot'

class ManagerCron {
    jobs: any;

    constructor() {
        this.jobs = [
            // Screenshot Jobs

            scheduleBootScreenshot,
        ];
    }

    run(){
        this.jobs.forEach(
            (job:any) => job.start()
        );
    }
}

export default new ManagerCron();