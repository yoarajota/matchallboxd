export class Log {
    static error(toLog: any) {
        if (["array", "object"].includes(typeof toLog)) {
            toLog = JSON.stringify(toLog)
        }

        console.log(`❌ ERROR -=-=- ${toLog}`)
    }

    static log(toLog: any) {
        if (["array", "object"].includes(typeof toLog)) {
            toLog = JSON.stringify(toLog)
        }

        console.log(`❕ LOG -=-=- ${toLog}`)
    }
}