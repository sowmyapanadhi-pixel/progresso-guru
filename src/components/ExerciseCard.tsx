import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, Trophy, ChevronRight } from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  completionRate: number;
  language: string;
  topics: string[];
  isCompleted?: boolean;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onStart: (exerciseId: string) => void;
}

export const ExerciseCard = ({ exercise, onStart }: ExerciseCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-difficulty-easy text-white';
      case 'medium': return 'bg-difficulty-medium text-white';
      case 'hard': return 'bg-difficulty-hard text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyDots = (difficulty: string) => {
    const dots = [];
    const level = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    
    for (let i = 0; i < 3; i++) {
      dots.push(
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < level ? getDifficultyColor(difficulty).split(' ')[0] : 'bg-muted'
          }`}
        />
      );
    }
    return dots;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary group cursor-pointer">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {exercise.title}
              </h3>
              {exercise.isCompleted && (
                <Trophy className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {exercise.language}
              </Badge>
              <div className="flex items-center space-x-1">
                {getDifficultyDots(exercise.difficulty)}
                <span className="text-xs text-muted-foreground ml-2 capitalize">
                  {exercise.difficulty}
                </span>
              </div>
            </div>
          </div>
          
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {exercise.description}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-2">
          {exercise.topics.map((topic, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{exercise.estimatedTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{exercise.completionRate}% completed</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Community Completion</span>
            <span>{exercise.completionRate}%</span>
          </div>
          <Progress value={exercise.completionRate} className="h-2" />
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => onStart(exercise.id)}
          className="w-full"
          variant={exercise.isCompleted ? "outline" : "default"}
        >
          {exercise.isCompleted ? 'Review Solution' : 'Start Exercise'}
        </Button>
      </div>
    </Card>
  );
};