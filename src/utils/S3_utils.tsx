import axios from "axios";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3_file_params } from "../types/S3_file_params";
import Credentials from "./credentials";

export const putFile = (url: string, data: File) => {
    return axios.put(url, data).then(response => {
        return response;
    }).catch(error => {
        throw new Error(error.message);
    })
}

export const handlePreSignedUrl = (params: S3_file_params) => {
    try {
        const { s3_region: region, s3_bucket: bucket, s3_key: key } = params;

        const client = new S3Client({
            region: region,
            credentials: new Credentials().CredentialsObject
        });

        const command = new PutObjectCommand({ Bucket: bucket, Key: key });
        return getSignedUrl(client, command, { expiresIn: 3600 });
    } catch (error: any) {
        throw new Error(`Failed to generate pre-signed URL: ${error.message}`);
    }
}