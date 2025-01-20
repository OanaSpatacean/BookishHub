import {S3,PutObjectCommandOutput} from "@aws-sdk/client-s3";

export function getS3Url(keyOfFile: string) 
{
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-west-3.amazonaws.com/${keyOfFile}`;
  return url;
}

export async function uploadToS3(file: File): Promise<{ keyOfFile: string; nameOfFile: string }> 
{
  return new Promise((resolve, reject) => 
  {
    try 
    {
        const s3 = new S3({region: "eu-west-3",credentials: {accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!, secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!}})

        const keyOfFile = file.name.replace(" ", "-");

        const params = {Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,Key: keyOfFile,Body: file,ACL: 'public-read'}

        s3.putObject(params,(err: any, data: PutObjectCommandOutput | undefined) => {   return resolve({
                                                                                        keyOfFile,
                                                                                        nameOfFile: file.name
                                                                                     })})
    } 
    catch (error) 
    {
      reject(error)
    }})}