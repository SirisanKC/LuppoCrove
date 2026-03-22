import { X, Info, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface TemplateReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateReviewDrawer({ isOpen, onClose }: TemplateReviewDrawerProps) {
  if (!isOpen) return null;

  const checklistItems = [
    { id: 1, text: "Topic: Data Analytics", satisfied: true },
    { id: 2, text: "Dataset provided (>1GB)", satisfied: true },
    { id: 3, text: "Signed NDA Agreement", satisfied: false },
    { id: 4, text: "Defined 12-week timeline", satisfied: true },
  ];

  const allSatisfied = checklistItems.every(item => item.satisfied);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-[800px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="border-b border-[#eaeaea] px-8 py-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Predictive Maintenance Modeling
          </h1>
          <p className="text-sm text-gray-600">
            Target Course: Advanced Machine Learning Practicum • Teacher: Jonas H.
          </p>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-[#fafaf9] px-8 py-8">
          <div className="grid grid-cols-5 gap-6">
            {/* Left Column - Teacher's Checklist (40%) */}
            <div className="col-span-2">
              <div className="bg-white rounded-xl border border-[#eaeaea] p-6">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-base font-semibold text-gray-900">
                    Course Requirements
                  </h2>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>

                <div className="space-y-4">
                  {checklistItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        !item.satisfied ? "bg-amber-50" : ""
                      }`}
                    >
                      {item.satisfied ? (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2d5a47] flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#f59e0b] flex items-center justify-center">
                          <AlertCircle className="w-3 h-3 text-[#f59e0b]" strokeWidth={2.5} />
                        </div>
                      )}
                      <span className={`text-sm ${
                        !item.satisfied ? "text-gray-900 font-medium" : "text-gray-700"
                      }`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - AI Proposal Draft (60%) */}
            <div className="col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-8">
                {/* AI Context Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-3">
                        <strong>AI Assistant Note:</strong> Your proposal looks great, but the teacher requires an NDA. Let's finish the interview to complete this template.
                      </p>
                      <button className="px-4 py-2 bg-[#f59e0b] text-white text-sm font-medium rounded-lg hover:bg-[#d97706] transition-colors">
                        Resume AI Interview
                      </button>
                    </div>
                  </div>
                </div>

                {/* Document Content */}
                <div className="space-y-6">
                  {/* Section 1 */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Project Objective
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Develop a machine learning system to predict equipment failures in manufacturing environments. Students will work with real-world telemetry data to create predictive models that can identify potential maintenance needs 48-72 hours before critical failures occur, enabling proactive maintenance scheduling and reducing downtime.
                    </p>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Data Assets
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Telemetry dataset (3.2TB) formatted in CSV, containing sensor readings from industrial equipment including temperature, vibration, pressure, and operational metrics collected over 18 months of continuous operation.
                    </p>
                  </div>

                  {/* Section 3 */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Legal Constraints (NDA)
                    </h3>
                    <p className="text-sm text-[#f59e0b] italic">
                      [Pending Company Input]
                    </p>
                  </div>

                  {/* Section 4 */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">
                      Timeline & Milestones
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      12-week project structure with bi-weekly sprint reviews.
                      <br /><br />
                      <span className="block pl-4">• Weeks 1-3: Data exploration and cleaning</span>
                      <span className="block pl-4">• Weeks 4-6: Feature engineering and model selection</span>
                      <span className="block pl-4">• Weeks 7-9: Model training and validation</span>
                      <span className="block pl-4">• Weeks 10-12: Production deployment and documentation</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Sticky */}
        <div className="border-t border-[#eaeaea] bg-white px-8 py-6 flex items-center justify-between">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Delete Draft
          </button>
          <button
            disabled={!allSatisfied}
            className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
              allSatisfied
                ? "bg-[#2d5a47] text-white hover:bg-[#234538] cursor-pointer"
                : "bg-[#2d5a47]/30 text-white/70 cursor-not-allowed"
            }`}
          >
            Publish to Course Marketplace
          </button>
        </div>
      </div>
    </>
  );
}