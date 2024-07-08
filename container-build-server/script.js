const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const Redis = require('ioredis');

const publisher = new Redis(process.env.REDIS_HOST);
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const PROJECT_ID = process.env.PROJECT_ID;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
var log_id = 0;

function publishLog(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log, id: log_id++ }));
}
function log(log) {
    console.log(log);
    publishLog(log);
}
async function buildProject() {
    log('Build Started...');
    const outDirPath = path.join(__dirname, 'repo');
    const buildCommand = `cd ${outDirPath} && npm install && npm run build`;

    try {
        const p = exec(buildCommand);

        p.stdout.on('data', (data) => {
            log(data.toString());
        });

        p.stderr.on('data', (data) => {
            log(data.toString());
        });

        await new Promise((resolve, reject) => {
            p.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Build failed with code ${code}`));
                } else {
                    resolve();
                }
            });
        });

        log('Build completed');
    } catch (error) {
        log(`Error building project: ${error.message}`);
        throw error;
    }
}

async function uploadToS3() {
    log('Uploading to S3...');

    const outDirPath = path.join(__dirname, 'repo');
    const buildFolderPath = fs.existsSync(path.join(outDirPath, 'build'))
        ? path.join(outDirPath, 'build')
        : path.join(outDirPath, 'dist');

    const buildFolderContents = fs.readdirSync(buildFolderPath, { recursive: true });

    const uploadPromises = buildFolderContents.map((file) => {
        const filePath = path.join(buildFolderPath, file);
        if (fs.lstatSync(filePath).isDirectory()) return;

        log(`Uploading ${file}...`);

        const command = new PutObjectCommand({
            Bucket: AWS_BUCKET_NAME,
            Key: `__outputs/${PROJECT_ID}/${file}`,
            Body: fs.createReadStream(filePath),
            ContentType: mime.lookup(filePath),
        });

        return s3Client.send(command).then(() => {
            log(`Uploaded ${file}`);
        }).catch((error) => {
            log(`Error uploading ${file}: ${error.message}`);
        });
    });

    await Promise.all(uploadPromises);
    log('Upload completed');
}

async function init() {
    try {
        await buildProject();
        await uploadToS3();
        log('Process completed successfully');
    } catch (error) {
        log(`Error: ${error.message}`);
    } finally {
        setTimeout(() => {
            process.exit(0);
        }, 5000);
    }
}

init();
