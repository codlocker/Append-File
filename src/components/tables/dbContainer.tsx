import { Table, Container } from "react-bootstrap";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommandOutput } from "@aws-sdk/lib-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { useAppSelector } from "../../types/hooks";
import { RootState } from "../../store";
import { TableRecord } from "../../types/tableRecord";
import { useEffect, useState } from "react";


async function GetAllRecords(region: string, userPoolId: string, idToken: string): Promise<TableRecord[]> {
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

    const response: ScanCommandOutput = await db_client.send(command);

    if(response.Count !== undefined && response.Count > 0) {
        const tableRecord: TableRecord[] = [];

        response.Items?.forEach(element => {
            tableRecord.push({
                fileId: element.fileId['S'],
                fileName: element.Name['S'],
                fileContent: element.Content['S'],
                uploadDate: element.UploadDate['S']
            })
        });
        return tableRecord;
    }
    
    return [];
}

const DbContainer = () => {
    const accessToken = useAppSelector((state: RootState) => state.auth.accessToken);
    const idToken = useAppSelector((state: RootState) => state.auth.idToken);
    const [tableData, setTableData] = useState<TableRecord[]>([]);
    const Region: string = process.env.REACT_APP_AWS_REGION || '';
    const userPoolId: string = process.env.REACT_APP_USER_POOL_ID || '';
    
    useEffect(() => {
        const storeDbRecords = async () => {const data = await GetAllRecords(
            Region,
            userPoolId,
            idToken
        );

        setTableData(data);
    };
        storeDbRecords();
    }, []);

    return (
        <Container className="pt-4">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>File name</th>
                        <th>File contents</th>
                        <th>File Upload time</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData.map((record: TableRecord, index: number) => {
                            console.log(record);
                            return <tr key={index}>
                                <td>{record.fileName}</td>
                                <td>{record.fileContent}</td>
                                <td>{record.uploadDate}</td>
                            </tr>
                        })
                    }
                </tbody>
            </Table>
        </Container>
    );
}

export default DbContainer;