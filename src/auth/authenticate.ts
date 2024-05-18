import {
    CognitoUser,
    AuthenticationDetails,
    CognitoUserSession,
    CognitoUserAttribute
} from "amazon-cognito-identity-js";

import { TokenResponse } from "./../types/accessTokenResponse";
import userpool from "../userpool";
import { ApiResponse } from "../types/ApiResponse";

export const authenticate = async (email: string, password: string): Promise<TokenResponse> => {
    const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userpool
    });

    const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password
    });

    let response: TokenResponse;

    if (!email.endsWith('@asu.edu')) {
        return <TokenResponse>{
            status: false,
            error: `Email format ${email} should have @asu.edu`,
            message: `Email format ${email} should have @asu.edu`
        }
    }

    return new Promise((resolve) => {
        cognitoUser.authenticateUser(
            authDetails,
            {
                onSuccess: (result: CognitoUserSession) => {
                    console.log('login successful');
                    const accessToken: string = result.getAccessToken().getJwtToken();

                    resolve(response = {
                        status: true,
                        message: 'Login succesful',
                        accessToken: accessToken,
                        error: null
                    });
                },
                onFailure: (error: Error) => {
                    console.log(`login failed: ${error.message}`);
                    resolve(response = {
                        status: false,
                        message: `login failed: ${error.message}`,
                        error: error
                    });
                }
            })
    })
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
                if (err) {
                    console.log(err);
                    return;
                }

                console.log(result);
            });

    } catch (error: any) {
        console.log(`Error: ${error.message}`)
    }
};

export const verifyUser = (email: string, confirmationCode: string): Promise<ApiResponse> => {
    const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userpool
    });

    return new Promise(() => cognitoUser.confirmRegistration(
        confirmationCode,
        true,
        function (err, result) {
            return <ApiResponse>{
                message: err?.message,
                status: result === "SUCCESS"
            }
        }));
}