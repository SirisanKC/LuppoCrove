import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Sparkles, Send, X } from "lucide-react";
import { langGraphAPI, ChatMessage as APIMessage } from "../services/api";

interface Message {
  role: "ai" | "user";
  content: string;
}

interface ProposalData {
  title: string;
  topic: string;
  timeline: string;
  ndaStatus: string;
  scope: string;
}

export function AIProjectWizard() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hi! I'm here to assist you with submitting an idea. To get started, what general topic does your project fall under?",
    },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0); // 0 = Topic, 1 = Description, 2 = NDA, 3 = Final
  const [isProcessing, setIsProcessing] = useState(false);
  const [proposalData, setProposalData] = useState<ProposalData>({
    title: "",
    topic: "",
    timeline: "",
    ndaStatus: "",
    scope: "",
  });

  const handleTopicSelect = async (topic: string) => {
     if (step !== 0 || isProcessing) return;
     
     setIsProcessing(true);
     
     // Add user message
    const newMessages = [...messages, { role: "user" as const, content: topic }];
    setMessages(newMessages);

     try {
       // Call LangGraph API for AI response
       const apiMessages: APIMessage[] = newMessages.map(m => ({
         role: m.role,
         content: m.content,
       }));
       
       const aiResponse = await langGraphAPI.chatWithAI(apiMessages, {
         courseId,
         companyId: 'demo_company_1',
       });
       
       setProposalData(prev => ({ ...prev, topic }));
       setMessages([
         ...newMessages,
         {
           role: "ai",
           content: aiResponse.content,
         },
       ]);
       setStep(1); // Move to description input
     } catch (error) {
       console.error('AI chat failed:', error);
       // Fallback to mock response
       setProposalData(prev => ({ ...prev, topic }));
       setMessages([
         ...newMessages,
         {
           role: "ai",
           content: "Great choice. Could you give me a quick description of the project in a few sentences?",
         },
       ]);
       setStep(1);
     } finally {
       setIsProcessing(false);
     }
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);

    // Add user message
    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);

    try {
      // Call LangGraph API for processing
      const apiMessages: APIMessage[] = newMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      
      const aiResponse = await langGraphAPI.chatWithAI(apiMessages, {
        courseId,
        companyId: 'demo_company_1',
      });

      if (step === 1) {
        // First response - extract initial data
        setProposalData((prev) => ({
          ...prev,
          title: "Predictive Maintenance Modeling via Telemetry Data",
          timeline: "12-14 Weeks",
          scope: input,
        }));
        setMessages([
          ...newMessages,
          {
            role: "ai",
            content: aiResponse.content,
          },
        ]);
        setStep(2);
      } else if (step === 2) {
        // Second response - finalize NDA status
        const ndaResponse = input.toLowerCase().includes("yes") ? "NDA Required" : "No NDA Required";
        setProposalData((prev) => ({
          ...prev,
          ndaStatus: ndaResponse,
        }));
        setMessages([
          ...newMessages,
          {
            role: "ai",
            content: aiResponse.content,
          },
        ]);
        setStep(3);
      }
    } catch (error) {
      console.error('AI response failed:', error);
      // Fallback logic
      if (step === 1) {
        setProposalData((prev) => ({
          ...prev,
          title: "Predictive Maintenance Modeling via Telemetry Data",
          timeline: "12-14 Weeks",
          scope: input,
        }));
        setMessages([
          ...newMessages,
          {
            role: "ai",
            content: "Excellent. I can format that. Does this data require the students to sign an NDA?",
          },
        ]);
        setStep(2);
      } else if (step === 2) {
        const ndaResponse = input.toLowerCase().includes("yes") ? "NDA Required" : "No NDA Required";
        setProposalData((prev) => ({
          ...prev,
          ndaStatus: ndaResponse,
        }));
        setMessages([
          ...newMessages,
          {
            role: "ai",
            content: "Perfect! I've compiled your proposal. Please review the structured document on the right. When you're ready, you can submit it to the university.",
          },
        ]);
        setStep(3);
      }
    } finally {
      setIsProcessing(false);
    }

    setInput("");
  };
  
  const handleSubmit = async () => {
    if (step < 3) return;
    
    setIsProcessing(true);
    
    try {
      const result = await langGraphAPI.submitProposal({
        topic: proposalData.topic,
        description: proposalData.scope,
        courseId: courseId || '',
        companyId: 'demo_company_1',
        requiresNDA: proposalData.ndaStatus.includes('Required'),
      });
      
      console.log('Proposal submitted:', result);
      alert('Proposal submitted successfully!');
      navigate("/company/proposals");
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal */}
      <div className="w-[1100px] h-[720px] bg-white rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.2)] flex overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => navigate("/company")}
          className="absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Pane - Chatbot Interview */}
        <div className="w-[45%] flex flex-col bg-white">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2d5a47]" strokeWidth={1.5} />
              <h2 className="text-lg font-semibold text-gray-900">Project Assistant</h2>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-xl ${
                    message.role === "ai"
                      ? "bg-[#fafaf9] text-gray-800 rounded-tl-none"
                      : "bg-[#2d5a47] text-white rounded-tr-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            
            {/* Topic Selection Pills - Only show if step is 0 */}
            {step === 0 && (
              <div className="flex flex-wrap gap-2 mt-2 ml-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {["Software MVP", "Data Analytics", "Service Design", "AI & ML"].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicSelect(topic)}
                    className="px-4 py-2 bg-white border border-[#2d5a47] text-[#2d5a47] rounded-full text-sm font-medium hover:bg-[#2d5a47] hover:text-white transition-all shadow-sm"
                  >
                    {topic}
                  </button>
                ))}
                <div className="relative flex items-center">
                    <input 
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-medium focus:border-[#2d5a47] outline-none transition-all w-24 focus:w-48 placeholder:text-gray-500"
                        placeholder="Other..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleTopicSelect(e.currentTarget.value);
                            }
                        }}
                    />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-8 pb-8 pt-4 border-t border-gray-200">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={step === 0 ? "Select a topic above..." : "Type your response..."}
                disabled={step === 0}
                className="w-full h-12 pl-4 pr-12 rounded-full border border-gray-300 focus:border-[#2d5a47] focus:outline-none focus:ring-2 focus:ring-[#2d5a47]/20 text-sm disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={step === 0 || isProcessing}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#2d5a47] text-white flex items-center justify-center hover:bg-[#234739] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-gray-200" />

        {/* Right Pane - Live Template Preview */}
        <div className="w-[55%] bg-[#f0f0ed] flex flex-col">
          {/* Header */}
          <div className="px-10 pt-8 pb-6">
            <h2 className="text-xl font-semibold text-gray-900">Academic Proposal Preview</h2>
          </div>

          {/* Document Preview Container */}
          <div className="flex-1 overflow-y-auto px-10 pb-8">
            <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
              {/* Field 1: Suggested Title */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Suggested Title:</p>
                <p className="text-sm text-gray-700">
                  {proposalData.title || (
                    <span className="inline-block w-24 h-4 bg-gray-100 rounded animate-pulse" />
                  )}
                </p>
              </div>

              {/* Field 2: Target Topic */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Target Topic:</p>
                <p className="text-sm text-gray-700">
                  {proposalData.topic || (
                    <span className="inline-block w-32 h-4 bg-gray-100 rounded animate-pulse" />
                  )}
                </p>
              </div>

              {/* Field 3: Project Scope */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Project Scope:</p>
                {proposalData.scope ? (
                  <p className="text-sm text-gray-700 leading-relaxed">{proposalData.scope}</p>
                ) : (
                  <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                    <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
                    <div className="w-[90%] h-4 bg-gray-100 rounded animate-pulse" />
                    <div className="w-[80%] h-4 bg-gray-100 rounded animate-pulse" />
                  </div>
                )}
              </div>

              {/* Field 4: Legal / NDA Status (Waiting for input) */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">Legal / NDA Status:</p>
                {proposalData.ndaStatus ? (
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      proposalData.ndaStatus.includes("Required")
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {proposalData.ndaStatus}
                  </span>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-amber-600 italic">Waiting for response</span>
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="px-10 pb-8 flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              onClick={() => navigate("/company")}
              className="px-6 h-11 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={step < 3 || isProcessing}
              className={`px-6 h-11 rounded-lg text-sm font-medium transition-all ${
                step >= 3 && !isProcessing
                  ? "bg-[#2d5a47] text-white hover:bg-[#234739] shadow-sm hover:shadow-md"
                  : "bg-[#2d5a47] text-white opacity-50 cursor-not-allowed"
              }`}
            >
              {isProcessing ? 'Submitting...' : 'Submit to University'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}