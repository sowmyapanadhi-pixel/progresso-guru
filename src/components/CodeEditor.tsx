import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Bug, CheckCircle, AlertCircle } from 'lucide-react';

interface CodeError {
  line: number;
  message: string;
  type: 'error' | 'warning';
}

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
}

export const CodeEditor = ({ 
  initialCode = '', 
  language = 'javascript',
  onCodeChange,
  onRun 
}: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState<CodeError[]>([]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
    
    // Simple error detection for demo
    const lines = newCode.split('\n');
    const newErrors: CodeError[] = [];
    
    lines.forEach((line, index) => {
      if (line.includes('console.log(') && !line.includes(');')) {
        newErrors.push({
          line: index + 1,
          message: 'Missing closing parenthesis',
          type: 'error'
        });
      }
      if (line.includes('let ') && line.includes('=') && !line.includes(';')) {
        newErrors.push({
          line: index + 1,
          message: 'Missing semicolon',
          type: 'warning'
        });
      }
    });
    
    setErrors(newErrors);
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (errors.some(e => e.type === 'error')) {
        setOutput('Error: Please fix the syntax errors before running.');
      } else {
        setOutput('Code executed successfully!\nOutput: Hello, World!');
      }
      
      onRun?.(code);
    } catch (error) {
      setOutput('Runtime error occurred.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{language}</Badge>
          {errors.length > 0 && (
            <Badge variant="destructive" className="flex items-center space-x-1">
              <Bug className="h-3 w-3" />
              <span>{errors.length} issue{errors.length !== 1 ? 's' : ''}</span>
            </Badge>
          )}
        </div>
        <Button 
          onClick={handleRun} 
          disabled={isRunning}
          variant="default"
          className="flex items-center space-x-2"
        >
          <Play className="h-4 w-4" />
          <span>{isRunning ? 'Running...' : 'Run Code'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {/* Code Input */}
        <Card className="p-0 overflow-hidden">
          <div className="bg-editor-bg text-editor-foreground p-4 h-full">
            <div className="text-sm text-muted-foreground mb-2">Code Editor</div>
            <textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-96 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed"
              placeholder="// Start coding here..."
              spellCheck={false}
            />
            
            {/* Error indicators */}
            {errors.length > 0 && (
              <div className="mt-4 space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    {error.type === 'error' ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-muted-foreground">Line {error.line}:</span>
                    <span className={error.type === 'error' ? 'text-destructive' : 'text-yellow-500'}>
                      {error.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Output */}
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-2 flex items-center space-x-2">
            <span>Output</span>
            {!errors.some(e => e.type === 'error') && output && (
              <CheckCircle className="h-4 w-4 text-accent" />
            )}
          </div>
          <div className="h-96 bg-muted/30 rounded-md p-4 font-mono text-sm overflow-auto">
            {output || 'Run your code to see the output here...'}
          </div>
        </Card>
      </div>
    </div>
  );
};