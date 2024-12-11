let intervalId = null;

onmessage = function(e) {
  if (e.data === 'start') {
    intervalId = setInterval(() => {
      postMessage({ type: 'tick', timestamp: Date.now() });
    }, 1000);
  } else if (e.data === 'stop') {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
};