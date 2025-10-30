declare global {
  interface Window {
    ApexCharts?: {
      exec: (chartId: string, method: string, ...args: unknown[]) => void;
    };
  }
}

export {};
