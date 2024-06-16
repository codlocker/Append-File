import os
import boto3
import json
from datetime import datetime

s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    partition_key = datetime.today().strftime("%m-%Y")
    bucket = event['Records'][0]['s3']['bucket']['name']
    file_name = event['Records'][0]['s3']['object']['key']

    print(bucket, file_name)

    response = s3_client.get_object(Bucket=bucket, Key=file_name)
    content = response['Body'].read().decode('utf-8')

    table_name = 'file-info'
    table = dynamodb.Table(table_name)

    try:
        table.put_item(
            Item = {
                "fileId": str(partition_key),
                "Name" : file_name,
                "Content" : content,
                "UploadDate": datetime.today().strftime("%d-%m-%Y")
            })
    except Exception as e:
        print(e)

    return json({
        'statusCode': 200,
        'body': 'Parse successful'
    })