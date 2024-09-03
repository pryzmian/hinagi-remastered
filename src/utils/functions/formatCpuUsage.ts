export function formatCpuUsage(): number {
    const cpuUsage = process.cpuUsage();
    const totalCPUTime = cpuUsage.user + cpuUsage.system;
    const uptimeInSeconds = process.uptime();

    const cpuPercentage = (totalCPUTime / 1e6 / uptimeInSeconds) * 100;

    return cpuPercentage;
}
