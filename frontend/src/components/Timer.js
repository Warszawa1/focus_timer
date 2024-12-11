import React, { useState, useEffect, useCallback } from 'react';

// Production durations
const DURATIONS = {
  POMODORO: 25 * 60,    // 25 minutes
  SHORT_BREAK: 5 * 60,  // 5 minutes
  LONG_BREAK: 15 * 60   // 15 minutes
};

// Testing durations - uncomment to use
// const DURATIONS = {
//   POMODORO: 25,      // 25 seconds
//   SHORT_BREAK: 5,    // 5 seconds
//   LONG_BREAK: 15     // 15 seconds
// };

const focusSound = new Audio('/focus-start.mp3');  // You'll need to add these sound files
const breakSound = new Audio('/break-start.mp3');
const completionSound = new Audio('/complete.mp3');

function Timer() {
  const [timerConfig, setTimerConfig] = useState({
    startTime: null,        
    endTime: null,         
    duration: DURATIONS.POMODORO,
    isActive: false,
    type: 'focus',
    pomodoroCount: 0
  });
  
  const [displayTime, setDisplayTime] = useState(DURATIONS.POMODORO);
  const [targetPomodoros, setTargetPomodoros] = useState(4);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [notificationSetup, setNotificationSetup] = useState(false); 
  
  // Remove the automatic notification request from useEffect
  useEffect(() => {
    if ('Notification' in window) {
      // Just check current permission
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Add a function to request permissions
  const requestNotifications = async () => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        setNotificationSetup(true);
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      setNotificationPermission('denied');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  

  const handleTimerComplete = useCallback(() => {
    if (timerConfig.type === 'focus') {
        const newPomodoroCount = timerConfig.pomodoroCount + 1;
        
        // Check if all pomodoros are completed first
        if (newPomodoroCount === targetPomodoros) {
            completionSound.play().catch(err => console.log('Sound failed:', err));

            if (notificationPermission === 'granted') {
                new Notification('Congratulations!', {
                    body: 'You completed all your pomodoros for this session!',
                    icon: '/icon-192x192.png'
                });
            }
            
            setTimerConfig({
                startTime: null,
                endTime: null,
                isActive: false,
                pomodoroCount: 0,
                type: 'focus',
                duration: DURATIONS.POMODORO
            });
            setDisplayTime(DURATIONS.POMODORO);
            return;
        }

        // Start break
        breakSound.play().catch(err => console.log('Sound failed:', err));
        const isLongBreakDue = newPomodoroCount % 4 === 0;
        const newDuration = isLongBreakDue ? DURATIONS.LONG_BREAK : DURATIONS.SHORT_BREAK;

        // Set next timer state immediately
        const now = Date.now();
        const nextEndTime = now + (newDuration * 1000);
        
        setTimerConfig(prev => ({
            ...prev,
            startTime: now,
            endTime: nextEndTime,
            duration: newDuration,
            isActive: true,
            type: 'break',
            pomodoroCount: newPomodoroCount
        }));
        setDisplayTime(newDuration);

        if (notificationPermission === 'granted') {
            new Notification('Focus Session Complete!', {
                body: `Time for a ${isLongBreakDue ? 'long' : 'short'} break!`,
                icon: '/icon-192x192.png'
            });
        }
    } else {
        // Break completed, start new pomodoro
        focusSound.play().catch(err => console.log('Sound failed:', err));
        
        const now = Date.now();
        const nextDuration = DURATIONS.POMODORO;
        const nextEndTime = now + (nextDuration * 1000);

        setTimerConfig(prev => ({
          ...prev,
          startTime: now,
          endTime: nextEndTime,
          duration: nextDuration,
          isActive: true,
          type: 'focus'
      }));
      setDisplayTime(nextDuration);

      if (notificationPermission === 'granted') {
          new Notification('Break Complete!', {
              body: 'Time to focus again!',
              icon: '/icon-192x192.png'
          });
      }
  }
}, [timerConfig.type, timerConfig.pomodoroCount, targetPomodoros, notificationPermission]);

// Add startTimer function to play focus sound when first starting
const startTimer = useCallback(() => {
    // Play focus sound when starting fresh
    if (!timerConfig.isActive && timerConfig.type === 'focus') {
        try {
            focusSound.play();
        } catch (err) {
            console.log('Sound playback failed:', err);
        }
    }

    const now = Date.now();
    setTimerConfig(prev => ({
        ...prev,
        startTime: now,
        endTime: now + (prev.duration * 1000),
        isActive: true
    }));
}, [timerConfig.isActive, timerConfig.type]);
  

  useEffect(() => {
    let interval;
    
    if (timerConfig.isActive && timerConfig.startTime && timerConfig.endTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.ceil((timerConfig.endTime - now) / 1000);
        
        if (remaining <= 0) {
          clearInterval(interval);
          // Ensure we complete the session
          setDisplayTime(0);
          handleTimerComplete();
        } else {
          setDisplayTime(remaining);
        }
      }, 500);
    }

    // Add visibility change handler
    const handleVisibilityChange = () => {
      if (document.hidden && timerConfig.isActive) {
        // When app goes to background, calculate and update time
        const now = Date.now();
        const remaining = Math.ceil((timerConfig.endTime - now) / 1000);
        setDisplayTime(remaining);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);


    return () => {
      if (interval) {
        clearInterval(interval);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timerConfig.isActive, timerConfig.startTime, timerConfig.endTime, handleTimerComplete]);



  const pauseTimer = useCallback(() => {
    setTimerConfig(prev => ({
      ...prev,
      isActive: false,
      duration: Math.ceil((prev.endTime - Date.now()) / 1000)
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setTimerConfig({
      startTime: null,
      endTime: null,
      duration: DURATIONS.POMODORO,
      isActive: false,
      type: 'focus',
      pomodoroCount: 0
    });
    setDisplayTime(DURATIONS.POMODORO);
  }, []);

  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const progress = 1 - (displayTime / timerConfig.duration);
  const strokeDashoffset = circumference * (1 - progress);

  // Add messages for all modes
  const getModeMessage = () => {
    if (timerConfig.type === 'break') {
      return `Take a ${timerConfig.duration === DURATIONS.LONG_BREAK ? '15-minute' : '5-minute'} break! 
              Stretch, hydrate, or take a quick walk.`;
    } else {
      return 'Focus Time: Remove distractions and concentrate on your task.';
    }
  };

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="mb-8 space-x-4">
        <label className="text-gray-600 block">
          Number of Pomodoros:
          <select 
            className="ml-2 px-3 py-1 rounded-lg border border-gray-300"
            value={targetPomodoros}
            onChange={(e) => setTargetPomodoros(Number(e.target.value))}
            disabled={timerConfig.isActive}
          >
            {[1, 2, 3, 4, 6, 8].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </label>
      </div>


      <div className="relative w-72 h-72 mx-auto group">
  {/* Background Icon - hidden on hover */}
  <div className="absolute inset-0 flex items-center justify-center">
    <img 
      src={timerConfig.type === 'break' ? '/icon-512x512.png' : '/icon-192x192.png'} 
      alt="Timer mode" 
      className="w-40 h-40 opacity-80 group-hover:opacity-0 transition-opacity duration-300" 
    />
  </div>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="144"
            cy="144"
            r="140"
            stroke="#F3F4F6"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="144"
            cy="144"
            r="140"
            stroke={timerConfig.type === 'break' ? "#22C55E" : "#A855F7"}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">

          <div className="text-7xl font-semibold">{formatTime(displayTime)}</div>
          <div className="text-gray-500 mt-2">
      {timerConfig.type === 'break' ? 'Break Time' : 'Focus Time'}
    </div>

          <div className="text-sm text-gray-500 mt-1 opacity-75">
            {timerConfig.pomodoroCount}/{targetPomodoros}
          </div>
        </div>
      </div>

      <div className="space-x-4 mt-8">
        <button 
          className={`px-8 py-2 rounded-full text-white ${
            timerConfig.type === 'break' ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-600 hover:bg-purple-700'
          }`}
          onClick={() => {
            if (timerConfig.isActive) {
              pauseTimer();
            } else {
              startTimer();
            }
          }}
        >
          {timerConfig.isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          className="bg-gray-200 text-gray-700 px-8 py-2 rounded-full hover:bg-gray-300"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>

      {!notificationSetup && notificationPermission !== 'granted' && (
        <div className="mt-4 bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-700 mb-2">
            Enable notifications to get alerts when your sessions end
          </p>
          <button
            onClick={requestNotifications}
            className="text-sm bg-purple-600 text-white px-4 py-1 rounded-full hover:bg-purple-700"
          >
            Enable Notifications
          </button>
        </div>
      )}


      <div className={`mt-4 ${timerConfig.type === 'break' ? 'text-green-600' : 'text-purple-600'}`}>
            {getModeMessage()}
          </div>
    </div>
  );
}

export default Timer;