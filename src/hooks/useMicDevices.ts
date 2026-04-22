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
      // Request permission first — without it, labels are empty strings
      const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      tempStream.getTracks().forEach(t => t.stop());

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
      // Permission denied — leave devices empty
    }
  };

  useEffect(() => {
    loadDevices();
    navigator.mediaDevices?.addEventListener('devicechange', loadDevices);
    return () => navigator.mediaDevices?.removeEventListener('devicechange', loadDevices);
  }, []);

  return { devices, selectedDeviceId, setSelectedDeviceId, loadDevices };
}
