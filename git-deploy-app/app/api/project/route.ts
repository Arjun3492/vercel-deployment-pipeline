import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs'
import { generateSlug } from "random-word-slugs";


export async function POST(
    req: Request,
) {
    try {
        const { gitURL, slug } = await req.json();

        if (!gitURL || !slug)
            return Response.json({ error: "Missing required fields" }, { status: 400 });



        const ecsClient = new ECSClient({
            region: process.env.ECS_REGION || 'ap-south-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
            }
        })

        const config = {
            CLUSTER: process.env.ECR_CLUSTER_ARN || '',
            TASK: process.env.ECR_TASK_ARN || ''
        }

        const projectSlug = slug ? slug : generateSlug()

        // Spin the container
        const command = new RunTaskCommand({
            cluster: config.CLUSTER,
            taskDefinition: config.TASK,
            launchType: 'FARGATE',
            count: 1,
            networkConfiguration: {
                awsvpcConfiguration: {
                    assignPublicIp: 'ENABLED',
                    subnets: ['', '', ''],
                    securityGroups: ['']
                }
            },
            overrides: {
                containerOverrides: [
                    {
                        name: 'builder-image',
                        environment: [
                            { name: 'GIT_REPOSITORY__URL', value: gitURL },
                            { name: 'PROJECT_ID', value: projectSlug }
                        ]
                    }
                ]
            }
        })

        await ecsClient.send(command);

        return Response.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` } })
    }
    catch (e) {
        console.log("Error with /project endpoint", e);
    }
}