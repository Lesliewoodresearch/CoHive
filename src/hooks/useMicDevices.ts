import { useState, useEffect } from 'react';

export interface MicDevice {
  deviceId: string;
  label: string;
}

export function useMicDevices() {
  const [devices, setDevices] = useState<MicDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('default');

  const loadDevices = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      // Passive enumeration only — no getUserMedia so we never activate the mic
      // on load. Labels may be empty if permission hasn't been granted yet; that's
      // fine — the recording button handlers call getUserMedia themselves.
      const all = await navigator.mediaDevices.enumerateDevices();
      const mics: MicDevice[] = all
        .filter(d => d.kind === 'audioinput')
        .map((d, i) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${i + 1}`,
        }));
      setDevices(mics);
      // Keep selection if still valid, otherwise fall back to first device
      setSelectedDeviceId(prev =>
        mics.find(m => m.deviceId === prev) ? prev : (mics[0]?.deviceId ?? 'default')
      );
    } catch {
      // No media devices available
    }
  };

  useEffect(() => {
    loadDevices();
    const handler = () => loadDevices();
    navigator.mediaDevices?.addEventListener('devicechange', handler);
    return () => navigator.mediaDevices?.removeEventListener('devicechange', handler);
  }, []);

  return { devices, selectedDeviceId, setSelectedDeviceId, loadDevices };
}
