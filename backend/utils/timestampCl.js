export const applyTimestampToLogs = () => {
  const originalConsoleLog = console.log;

  console.log = (...args) => {
    const now = new Date();
    const timestamp = `[${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}]`;
    originalConsoleLog(timestamp, ...args);
  };
};
