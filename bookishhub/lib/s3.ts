import {S3,PutObjectCommandOutput} from "@aws-sdk/client-s3";

export function getS3Url(keyOfFile: string) 
{
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-west-3.amazonaws.com/${keyOfFile}`;
  return url;
}

export async function uploadToS3(file: File): Promise<{ keyOfFile: string; nameOfFile: string }> 
{
  return new Promise(async (resolve, reject) => 
  {
    try 
    {
      const s3 = new S3({region: "eu-west-3",credentials: {accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!, secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!}})

      const keyOfFile = file.name.replace(/ /g, "-");
      const fileContent = await file.arrayBuffer(); 

      const params = {Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,Key: keyOfFile,Body: fileContent,ContentType: file.type}

      const data: PutObjectCommandOutput = await s3.putObject(params);
      console.log("Upload successful:", data);

      return resolve({ keyOfFile, nameOfFile: file.name });
    } 
    catch (error) 
    {
      console.error("Error in uploadToS3:", error);
      reject(error);
    }})}