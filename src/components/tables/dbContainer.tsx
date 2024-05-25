import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { useAppSelector } from "../../types/hooks";
import { RootState } from "../../store";

async function GetAllRecords(region: string, userPoolId: string, idToken: string) {
    console.log(region, userPoolId, idToken);
    
    const ddb = new DynamoDBClient({
        region: region,
        credentials: fromCognitoIdentityPool({
            clientConfig: { region: region },
            identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID || '',
            logins: {
                [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: idToken
            }
        }),
         });

    const db_client = DynamoDBDocumentClient.from(ddb);

    let command = new ScanCommand({
        TableName: 'file-info',
        ConsistentRead: true,
    });

    const response = await db_client.send(command);
    console.log(response);
}

const DbContainer = () => {
    const accessToken = useAppSelector((state: RootState) => state.auth.accessToken);
    const idToken = useAppSelector((state: RootState) => state.auth.idToken);
    const Region: string = process.env.REACT_APP_AWS_REGION || '';
    const userPoolId: string = process.env.REACT_APP_USER_POOL_ID || '';

    GetAllRecords(
        Region,
        userPoolId,
        idToken
    );

    return (
        <div>Dbcontainer</div>
    );
}

export default DbContainer;