class Credentials {
    accessKeyId: string;
    secretAccessKey: string;

    constructor() {
        this.accessKeyId = process.env.REACT_APP_ACCESS_KEY || '';
        this.secretAccessKey = process.env.REACT_APP_SECRET_KEY || '';
    }

    get CredentialsObject(): any {
        return {
            accessKeyId: this.accessKeyId,
            secretAccessKey: this.secretAccessKey
        }
    }
}

export default Credentials;