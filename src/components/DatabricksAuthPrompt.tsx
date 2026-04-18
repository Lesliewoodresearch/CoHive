import { useState, useEffect } from 'react';
import { AlertCircle, Database, CheckCircle } from 'lucide-react';
import { isAuthenticated, initiateLogin } from '../utils/databricksAuth';

interface DatabricksAuthPromptProps {
  onAuthChange?: (authenticated: boolean) => void;
}

export function DatabricksAuthPrompt({ onAuthChange }: DatabricksAuthPromptProps) {
  const [isAuth, setIsAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    setIsChecking(true);
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (onAuthChange) onAuthChange(authenticated);
    setIsChecking(false);
  };

  const handleSignIn = async () => {
    setIsConnecting(true);
    setError(null);

    const email = localStorage.getItem('cohive_pending_email');

    if (!email) {
      setError('Session expired. Please log out and sign in again.');
      setIsConnecting(false);
      return;
    }

    try {
      const response = await fetch('/api/databricks/workspace-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || 'Could not find your workspace.');
        setIsConnecting(false);
        return;
      }

      const { workspaceHost } = await response.json();
      initiateLogin(workspaceHost);

    } catch (err) {
      setError('Failed to connect. Please try again.');
      setIsConnecting(false);
    }
  };

  if (isChecking) {
    return (
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-blue-600 animate-pulse" />
          <span className="text-gray-700">Checking Databricks authentication...</span>
        </div>
      </div>
    );
  }

  if (isAuth) {
    return (
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <span className="text-gray-900 font-medium">Connected to Databricks</span>
            <p className="text-gray-600 text-sm mt-1">All workflow steps can now save data to your organization's Knowledge Base</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-gray-900 font-medium mb-1">Databricks Authentication Required</h4>
          <p className="text-gray-700 text-sm mb-3">
            Connect to your organization's Databricks workspace to access the Knowledge Base and run assessments.
          </p>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <button
            onClick={handleSignIn}
            disabled={isConnecting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <Database className="w-4 h-4" />
            {isConnecting ? 'Connecting...' : 'Sign In to Databricks'}
          </button>
          <div className="mt-3 text-xs text-gray-600">
            <p className="mb-1">✓ Secure OAuth 2.0 authentication</p>
            <p className="mb-1">✓ Your credentials never leave Databricks</p>
            <p>✓ Access your organization's shared Knowledge Base</p>
          </div>
        </div>
      </div>
    </div>
  );
}