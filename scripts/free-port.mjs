import { execSync } from 'child_process';

const port = process.argv[2] ?? '4000';

function freePortWindows(targetPort) {
  try {
    const output = execSync(`netstat -ano | findstr :${targetPort}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });

    const pids = new Set();

    for (const line of output.split('\n')) {
      if (!line.includes('LISTENING')) continue;
      const pid = line.trim().split(/\s+/).at(-1);
      if (pid && pid !== '0') pids.add(pid);
    }

    for (const pid of pids) {
      // eslint-disable-next-line no-console
      console.log(`Freeing port ${targetPort} (PID ${pid})`);
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'inherit' });
    }
  } catch {
    // Port is already free.
  }
}

function freePortUnix(targetPort) {
  try {
    const output = execSync(`lsof -ti tcp:${targetPort}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });

    for (const pid of output.split('\n').map((value) => value.trim()).filter(Boolean)) {
      // eslint-disable-next-line no-console
      console.log(`Freeing port ${targetPort} (PID ${pid})`);
      execSync(`kill -9 ${pid}`, { stdio: 'inherit' });
    }
  } catch {
    // Port is already free.
  }
}

if (process.platform === 'win32') {
  freePortWindows(port);
} else {
  freePortUnix(port);
}
