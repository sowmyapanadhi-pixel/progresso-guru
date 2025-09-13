import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Coffee,
  Brain,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';

interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  soundEnabled: boolean;
}

interface PomodoroTimerProps {
  taskId?: string;
  onSessionComplete?: (type: 'work' | 'break', duration: number) => void;
}

export const PomodoroTimer = ({ taskId, onSessionComplete }: PomodoroTimerProps) => {
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    soundEnabled: true
  });

  const [currentSession, setCurrentSession] = useState<'work' | 'short-break' | 'long-break'>('work');
  const [timeRemaining, setTimeRemaining] = useState(settings.workDuration * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const getCurrentDuration = useCallback(() => {
    switch (currentSession) {
      case 'work': return settings.workDuration * 60;
      case 'short-break': return settings.shortBreakDuration * 60;
      case 'long-break': return settings.longBreakDuration * 60;
      default: return settings.workDuration * 60;
    }
  }, [currentSession, settings]);

  // Update time remaining when session type changes
  useEffect(() => {
    setTimeRemaining(getCurrentDuration());
  }, [currentSession, getCurrentDuration]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      // Session completed
      setIsRunning(false);
      
      if (settings.soundEnabled) {
        // Play completion sound (browser notification sound)
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D0wGcdBSJ4yvLZeSsFJH/Q8NmPPwwPVLTk9p5TEAw+ltj50WYfBS19zvLMeywFKpDU8N2QQAoUarny0poQChFSo+DwvGcuASN/yQ==');
        audio.play().catch(() => {});
      }

      // Handle session completion
      if (currentSession === 'work') {
        const newCompletedSessions = completedSessions + 1;
        setCompletedSessions(newCompletedSessions);
        
        // Determine next session type
        if (newCompletedSessions % settings.sessionsUntilLongBreak === 0) {
          setCurrentSession('long-break');
        } else {
          setCurrentSession('short-break');
        }
        
        onSessionComplete?.('work', settings.workDuration);
      } else {
        setCurrentSession('work');
        onSessionComplete?.('break', currentSession === 'short-break' ? settings.shortBreakDuration : settings.longBreakDuration);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentSession, completedSessions, settings, onSessionComplete]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(getCurrentDuration());
  };

  const skipSession = () => {
    setIsRunning(false);
    if (currentSession === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      if (newCompletedSessions % settings.sessionsUntilLongBreak === 0) {
        setCurrentSession('long-break');
      } else {
        setCurrentSession('short-break');
      }
    } else {
      setCurrentSession('work');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = getCurrentDuration();
    return ((total - timeRemaining) / total) * 100;
  };

  const getSessionIcon = () => {
    switch (currentSession) {
      case 'work': return <Brain className="h-5 w-5" />;
      case 'short-break':
      case 'long-break': return <Coffee className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work': return 'text-primary';
      case 'short-break': return 'text-accent';
      case 'long-break': return 'text-tutorial-highlight';
      default: return 'text-primary';
    }
  };

  const getSessionLabel = () => {
    switch (currentSession) {
      case 'work': return 'Focus Time';
      case 'short-break': return 'Short Break';
      case 'long-break': return 'Long Break';
      default: return 'Focus Time';
    }
  };

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <Card className="p-8">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-2">
            <div className={getSessionColor()}>
              {getSessionIcon()}
            </div>
            <Badge variant="outline" className={getSessionColor()}>
              {getSessionLabel()}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="text-6xl font-mono font-bold">
              {formatTime(timeRemaining)}
            </div>
            
            <Progress value={getProgress()} className="h-3" />
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            {!isRunning ? (
              <Button onClick={startTimer} size="lg">
                <Play className="h-5 w-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={pauseTimer} variant="outline" size="lg">
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            )}
            
            <Button onClick={resetTimer} variant="outline" size="lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
            
            <Button onClick={skipSession} variant="outline" size="lg">
              <Square className="h-5 w-5 mr-2" />
              Skip
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{completedSessions}</p>
            <p className="text-sm text-muted-foreground">Completed Sessions</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{Math.floor(completedSessions / settings.sessionsUntilLongBreak)}</p>
            <p className="text-sm text-muted-foreground">Completed Cycles</p>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-tutorial-highlight">{completedSessions * settings.workDuration}</p>
            <p className="text-sm text-muted-foreground">Minutes Focused</p>
          </div>
        </Card>
      </div>

      {/* Settings */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Timer Settings</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showSettings ? 'Hide' : 'Show'} Settings
          </Button>
        </div>
        
        {showSettings && (
          <div className="space-y-4 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Work Duration</label>
                <Select
                  value={settings.workDuration.toString()}
                  onValueChange={(value) => setSettings({ ...settings, workDuration: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="25">25 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Short Break</label>
                <Select
                  value={settings.shortBreakDuration.toString()}
                  onValueChange={(value) => setSettings({ ...settings, shortBreakDuration: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 minutes</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Long Break</label>
                <Select
                  value={settings.longBreakDuration.toString()}
                  onValueChange={(value) => setSettings({ ...settings, longBreakDuration: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Cycle Length</label>
                <Select
                  value={settings.sessionsUntilLongBreak.toString()}
                  onValueChange={(value) => setSettings({ ...settings, sessionsUntilLongBreak: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 sessions</SelectItem>
                    <SelectItem value="4">4 sessions</SelectItem>
                    <SelectItem value="5">5 sessions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              >
                {settings.soundEnabled ? (
                  <Volume2 className="h-4 w-4 mr-2" />
                ) : (
                  <VolumeX className="h-4 w-4 mr-2" />
                )}
                {settings.soundEnabled ? 'Sound On' : 'Sound Off'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};