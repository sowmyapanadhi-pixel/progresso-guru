import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CodeEditor } from '@/components/CodeEditor';
import { ExerciseCard } from '@/components/ExerciseCard';
import { TutorialStep } from '@/components/TutorialStep';
import { 
  Code, 
  BookOpen, 
  Trophy, 
  Target, 
  Users, 
  TrendingUp,
  Play,
  CheckCircle,
  Clock
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTutorialStep, setCurrentTutorialStep] = useState(1);

  // Sample data
  const exercises = [
    {
      id: '1',
      title: 'Array Manipulation Basics',
      description: 'Learn how to manipulate arrays using map, filter, and reduce methods. Perfect for beginners who want to master functional programming concepts.',
      difficulty: 'easy' as const,
      estimatedTime: '15 mins',
      completionRate: 87,
      language: 'JavaScript',
      topics: ['Arrays', 'Functions', 'ES6'],
      isCompleted: true
    },
    {
      id: '2',
      title: 'Object-Oriented Programming',
      description: 'Master classes, inheritance, and polymorphism. Build a complete project using OOP principles and design patterns.',
      difficulty: 'medium' as const,
      estimatedTime: '45 mins',
      completionRate: 64,
      language: 'Python',
      topics: ['Classes', 'Inheritance', 'Design Patterns']
    },
    {
      id: '3',
      title: 'Advanced Algorithm Design',
      description: 'Solve complex problems using dynamic programming, graph algorithms, and optimization techniques.',
      difficulty: 'hard' as const,
      estimatedTime: '90 mins',
      completionRate: 23,
      language: 'C++',
      topics: ['Algorithms', 'Data Structures', 'Optimization']
    }
  ];

  const tutorialSteps = [
    {
      id: '1',
      title: 'Getting Started with Variables',
      content: 'Variables are containers for storing data values. In JavaScript, you can declare variables using let, const, or var keywords.',
      codeExample: `// Declaring variables
let message = "Hello, World!";
const pi = 3.14159;
var age = 25;

console.log(message);`,
      hints: [
        'Use const for values that won\'t change',
        'Use let for values that will change',
        'Avoid var in modern JavaScript'
      ],
      isCompleted: true
    },
    {
      id: '2',
      title: 'Working with Functions',
      content: 'Functions are reusable blocks of code that perform specific tasks. They help organize your code and make it more modular.',
      codeExample: `// Function declaration
function greet(name) {
    return "Hello, " + name + "!";
}

// Arrow function
const multiply = (a, b) => a * b;

console.log(greet("Alice"));
console.log(multiply(5, 3));`,
      hints: [
        'Functions should have descriptive names',
        'Use arrow functions for simple operations',
        'Always return a value when needed'
      ],
      isCompleted: false
    }
  ];

  const stats = [
    { label: 'Exercises Completed', value: '12', icon: CheckCircle, color: 'text-accent' },
    { label: 'Hours Coded', value: '34', icon: Clock, color: 'text-primary' },
    { label: 'Skill Level', value: 'Intermediate', icon: TrendingUp, color: 'text-tutorial-highlight' },
    { label: 'Streak', value: '7 days', icon: Trophy, color: 'text-yellow-500' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary w-10 h-10 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CodeLearn</h1>
                <p className="text-sm text-muted-foreground">Programming Education Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>234 learners online</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Exercises</span>
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Tutorials</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Code Editor</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Progress */}
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Recent Progress</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>JavaScript Fundamentals</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Python Basics</span>
                      <span>62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Data Structures</span>
                      <span>34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Code className="h-4 w-4 mr-2" />
                    Practice Coding
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Trophy className="h-4 w-4 mr-2" />
                    View Achievements
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Coding Exercises</h2>
              <Badge variant="outline">
                {exercises.filter(e => e.isCompleted).length} of {exercises.length} completed
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onStart={(id) => {
                    console.log('Starting exercise:', id);
                    setActiveTab('code');
                  }}
                />
              ))}
            </div>
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <TutorialStep
              step={tutorialSteps[currentTutorialStep - 1]}
              currentStep={currentTutorialStep}
              totalSteps={tutorialSteps.length}
              onNext={() => setCurrentTutorialStep(Math.min(currentTutorialStep + 1, tutorialSteps.length))}
              onPrevious={() => setCurrentTutorialStep(Math.max(currentTutorialStep - 1, 1))}
              onComplete={() => {
                console.log('Step completed');
                // Update completion status
              }}
            />
          </TabsContent>

          {/* Code Editor Tab */}
          <TabsContent value="code" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Interactive Code Editor</h2>
              <Badge variant="outline">Real-time Error Detection</Badge>
            </div>
            
            <CodeEditor
              initialCode={`// Welcome to the CodeLearn editor!
// Try writing some JavaScript code below

function greetUser(name) {
    console.log("Hello, " + name + "!");
}

// Call the function
greetUser("Programmer");

// Try creating a variable
let message = "Start coding and learn!";
console.log(message);`}
              language="javascript"
              onCodeChange={(code) => console.log('Code changed:', code)}
              onRun={(code) => console.log('Running code:', code)}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
