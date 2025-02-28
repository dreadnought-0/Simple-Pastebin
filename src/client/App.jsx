import React, { useState, useEffect } from 'react';
import { Clipboard, Share2, AlertCircle, Clock, Eye } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const App = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [pasteId, setPasteId] = useState('');
  const [showCopied, setShowCopied] = useState(false);
  const [pasteSaved, setPasteSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pasteInfo, setPasteInfo] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/paste\/([a-zA-Z0-9]+)/);
    if (match) {
      loadPaste(match[1]);
    }
  }, []);

  const loadPaste = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/paste/${id}`);
      if (!response.ok) throw new Error('Paste not found');
      const data = await response.json();
      setCode(data.content);
      setLanguage(data.language);
      setPasteId(id);
      setPasteSaved(true);
      setPasteInfo({
        views: data.views,
        createdAt: new Date(data.createdAt)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    if (!code.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/paste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: code,
          language 
        }),
      });

      if (!response.ok) throw new Error('Failed to create paste');
      
      const data = await response.json();
      setPasteId(data.pasteId);
      setPasteSaved(true);
      
      // Update URL without reload
      window.history.pushState({}, '', `/paste/${data.pasteId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const shareUrl = `${window.location.origin}/paste/${pasteId}`;
    navigator.clipboard.writeText(shareUrl);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
         <img 
            src="/assets/logo.png" 
            alt="Dark Space Labs" 
            className="h-40 w-40 animate-glow"
            style={{
              filter: 'drop-shadow(0 0 15px #0ea5e9)'
            }}
          />
        </div>
        <h1 className="text-4xl font-bold text-center mb-2 text-white">
          Dark Space Pastebin
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Share code securely with end-to-end encryption
        </p>

        {error && (
          <div className="mb-4 bg-red-900 border border-red-500 text-white px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          {!pasteSaved ? (
            <>
              <div className="mb-4">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-700 text-gray-200 rounded-lg px-3 py-2 w-full md:w-auto"
                >
                  <option value="plaintext">Plain Text</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                  <option value="json">JSON</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="sql">SQL</option>
                </select>
              </div>
              
              <textarea
                className="w-full h-96 bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  onClick={handlePaste}
                  disabled={!code.trim() || loading}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  Create Paste
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-700 border-l-4 border-cyan-500 p-4 rounded">
                <p className="text-gray-200">
                  Your paste has been created! Share this link with others:
                </p>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-900 p-3 rounded-lg">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/paste/${pasteId}`}
                  className="flex-1 bg-transparent text-gray-300 focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  {showCopied ? (
                    <span>Copied!</span>
                  ) : (
                    <>
                      <Clipboard size={16} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {pasteInfo && (
                <div className="flex gap-4 text-gray-400 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>{pasteInfo.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>Created {new Date(pasteInfo.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  language={language}
                  style={atomOneDark}
                  customStyle={{
                    padding: '1.5rem',
                    margin: 0,
                    background: 'transparent'
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setCode('');
                    setPasteId('');
                    setPasteSaved(false);
                    setPasteInfo(null);
                    window.history.pushState({}, '', '/');
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Create New Paste
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🔒</span>
            <h2 className="text-xl font-semibold">Privacy & Security</h2>
          </div>
          <ul className="space-y-2 text-gray-400">
            <li>• All pastes are encrypted end-to-end</li>
            <li>• Your code is never stored in plaintext</li>
            <li>• Pastes automatically expire after 30 days</li>
            <li>• No registration or personal information required</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;