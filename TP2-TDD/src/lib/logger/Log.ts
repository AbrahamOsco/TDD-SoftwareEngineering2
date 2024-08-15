import colors from 'colors';

export class Log{
    
    private static activated: boolean = (process.env.ACTIVATE_LOG == "true");

    private constructor(){}

    public static info(message:string){
        if(this.activated){
            console.log(`${colors.blue('[INFO]')} ${message}`);
        }
    }
    public static error(message:string){
        if(this.activated){
            console.log(`${colors.red('[ERROR]')} ${message}`);
        }
    }
}