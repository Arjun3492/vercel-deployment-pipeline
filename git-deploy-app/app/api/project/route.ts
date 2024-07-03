import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs'
import { generateSlug } from "random-word-slugs";

export async function POST(
    req: Request,
) {
    try {
        const { gitURL, slug } = await req.json();
        if (!gitURL && !slug)
            return Response.json({ error: "Missing required fields" }, { status: 400 });



        const ecsClient = new ECSClient({
            region: process.env.AWS_REGION || 'ap-south-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
            }
        })

        const config = {
            CLUSTER: process.env.ECS_CLUSTER_ARN || '',
            TASK: process.env.ECS_TASK_ARN || ''
        }

        const projectSlug = slug ? slug : generateSlug()


        const command = new RunTaskCommand({
            cluster: config.CLUSTER,
            taskDefinition: config.TASK,
            launchType: 'FARGATE',
            count: 1,
            networkConfiguration: {
                awsvpcConfiguration: {
                    assignPublicIp: 'ENABLED',
                    subnets: [process.env.SUBNET_V1 as string, process.env.SUBNET_V2 as string, process.env.SUBNET_V3 as string],
                    securityGroups: [process.env.SECURITY_GROUP as string]
                }
            },
            overrides: {
                containerOverrides: [
                    {
                        name: process.env.CONTAINER_IMAGE as string,
                        environment: [
                            { name: 'GIT_REPOSITORY__URL', value: gitURL },
                            { name: 'PROJECT_ID', value: projectSlug },
                            { name: 'AWS_REGION', value: process.env.AWS_REGION || 'ap-south-1' },
                            { name: 'AWS_ACCESS_KEY_ID', value: process.env.AWS_ACCESS_KEY_ID || '' },
                            { name: 'AWS_SECRET_ACCESS_KEY', value: process.env.AWS_SECRET_ACCESS_KEY || '' },
                            { name: 'AWS_BUCKET_NAME', value: process.env.AWS_BUCKET_NAME || '' },
                            { name: 'REDIS_HOST', value: process.env.REDIS_HOST || '' }
                        ]
                    }
                ]
            },
        })

        await ecsClient.send(command);

        return Response.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` } })
    }
    catch (e) {
        console.log("Error with /project endpoint", e);
    }
}