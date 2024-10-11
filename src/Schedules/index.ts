import checkSessionExpiredToRestartBoot from './checkSessionExpiredToRestartBoot'

class ManagerCron {
    jobs: any;

    constructor() {
        this.jobs = [
            // Cron Jobs

            checkSessionExpiredToRestartBoot,
        ];
    }

    run(){
        this.jobs.forEach(
            (job:any) => job.start()
        );
    }
}

export default new ManagerCron();