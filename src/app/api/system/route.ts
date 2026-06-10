import { NextResponse } from 'next/server';
import si from 'systeminformation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [cpu, mem, cpuTemp, load, disk, net, os, time] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.cpuTemperature(),
      si.currentLoad(),
      si.fsSize(),
      si.networkStats(),
      si.osInfo(),
      si.time(),
    ]);

    const primaryDisk = disk[0] || { size: 0, used: 0, use: 0, fs: 'N/A', mount: '/' };
    const primaryNet = net[0] || { rx_sec: 0, tx_sec: 0, iface: 'N/A' };

    return NextResponse.json({
      cpu: {
        brand: cpu.brand,
        speed: cpu.speed,
        cores: cpu.cores,
        physicalCores: cpu.physicalCores,
        load: Math.round(load.currentLoad),
        temp: Math.round(cpuTemp.main || 0),
      },
      memory: {
        total: mem.total,
        used: mem.used,
        free: mem.free,
        percent: Math.round((mem.used / mem.total) * 100),
      },
      disk: {
        size: primaryDisk.size,
        used: primaryDisk.used,
        percent: Math.round(primaryDisk.use),
        fs: primaryDisk.fs,
        mount: primaryDisk.mount,
      },
      network: {
        rx: Math.round((primaryNet.rx_sec || 0) / 1024),
        tx: Math.round((primaryNet.tx_sec || 0) / 1024),
        iface: primaryNet.iface,
      },
      os: {
        platform: os.platform,
        distro: os.distro,
        arch: os.arch,
        hostname: os.hostname,
      },
      time: {
        current: time.current,
        uptime: time.uptime,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch system info' }, { status: 500 });
  }
}
