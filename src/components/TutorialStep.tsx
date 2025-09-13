import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

interface TutorialStepProps {
  step: {
    id: string;
    title: string;
    content: string;
    codeExample?: string;
    hints: string[];
    isCompleted: boolean;
  };
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
}

export const TutorialStep = ({ 
  step, 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious, 
  onComplete 
}: TutorialStepProps) => {
  const progressPercentage = ((currentStep) / totalSteps) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              Step {currentStep} of {totalSteps}
            </Badge>
            {step.isCompleted && (
              <CheckCircle className="h-5 w-5 text-accent" />
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {Math.round(progressPercentage)}% Complete
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="p-6 border-l-4 border-l-tutorial-highlight">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {step.title}
          </h2>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {step.content}
            </p>
          </div>

          {/* Code Example */}
          {step.codeExample && (
            <Card className="p-0 overflow-hidden bg-editor-bg">
              <div className="p-4">
                <div className="text-xs text-muted-foreground mb-2">Example Code</div>
                <pre className="text-editor-foreground font-mono text-sm overflow-x-auto">
                  <code>{step.codeExample}</code>
                </pre>
              </div>
            </Card>
          )}

          {/* Hints */}
          {step.hints.length > 0 && (
            <Card className="p-4 bg-tutorial-highlight/10 border-tutorial-highlight/20">
              <div className="flex items-start space-x-3">
                <Lightbulb className="h-5 w-5 text-tutorial-highlight mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Helpful Hints</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {step.hints.map((hint, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Circle className="h-3 w-3 mt-1 flex-shrink-0" />
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 1}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex space-x-2">
          {!step.isCompleted && (
            <Button
              variant="outline"
              onClick={onComplete}
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Mark Complete</span>
            </Button>
          )}
          
          <Button
            onClick={onNext}
            disabled={currentStep === totalSteps}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};