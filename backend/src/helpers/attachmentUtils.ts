import * as AWS from 'aws-sdk'
const AWSXRay=require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)
const s3=new XAWS.S3({
    signatureVErsion:'v4'
})
const bucket=process.env.ATTACHMENT_S3_BUCKET;
// TODO: Implement the fileStogare logic
export function getUrl(todoId:string){
    return s3.getSignedUrl('putObject',{
        Bucket:bucket,
        Key:todoId,
        Expires:300
    });
}