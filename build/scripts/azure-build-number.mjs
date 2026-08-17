export function formatAzureBuildNumber(packageCount, pipeline, buildId) {
    if (!Number.isSafeInteger(packageCount) || packageCount < 0) {
        throw new Error(`Invalid package count: ${packageCount}`);
    }
    if (pipeline !== "build" && pipeline !== "cd") {
        throw new Error(`Invalid pipeline type: ${pipeline}`);
    }
    if (!/^\d+$/.test(buildId ?? "")) {
        throw new Error(`Invalid Azure Build.BuildId: ${buildId}`);
    }

    return `${packageCount}-${pipeline}-${buildId}`;
}

export function updateAzureBuildNumber(packageCount, pipeline) {
    if (!process.env.TF_BUILD) {
        return;
    }

    const buildNumber = formatAzureBuildNumber(
        packageCount,
        pipeline,
        process.env.AZURE_BUILD_ID,
    );
    console.log(`##vso[build.updatebuildnumber]${buildNumber}`);
}
