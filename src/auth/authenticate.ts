import { CognitoUser,
     AuthenticationDetails, 
     CognitoUserSession, 
     CognitoUserPool, 
     CognitoUserAttribute } from "amazon-cognito-identity-js";
import userpool from "../userpool";

export const authenticate = (email: string, password: string) => {
    const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userpool
    });

    const authDetails = new AuthenticationDetails({
        Username: email,
       Password: password 
    });

    cognitoUser.authenticateUser(
        authDetails,
        {
            onSuccess: (result: CognitoUserSession) => {
                console.log('login successful');
                const accessToken: string = result.getAccessToken().getJwtToken();
                console.log(accessToken);
            },
            onFailure: (error: Error) => {
                console.log(`login failed: ${error.message}`);
            }
        }
    )
}

export const logOut = () => {
    const user = userpool.getCurrentUser();
    user?.signOut();
};

export const signUp = (email: string, password: string) => {
    try {
        const attributeList = [
            new CognitoUserAttribute({
                Name: "email",
                Value: email
            }),
        ];
        
        userpool.signUp(
            email,
            password,
            attributeList,
            [],
            (err, result) => {
                if(err) {
                    console.log(err);
                    return;
                }

                console.log(result);
            });

    } catch (error: any) {
        console.log(`Error: ${error.message}`)
    }
};