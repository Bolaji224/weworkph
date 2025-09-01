import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Target,
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { useParams } from "react-router-dom";
import {
  loadGuides,
  seedGuidesIfEmpty,
  GuideBlock,
} from "../../../utils/localStorage";

const SmartGuidePage: React.FC = () => {
  const { guideId } = useParams<{ guideId: string }>(); // 👈 get guideId from URL
  const [guide, setGuide] = useState<GuideBlock | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const LS_PROGRESS_KEY = `completedModules_${guideId}`; // ✅ store progress per guide

  useEffect(() => {
    seedGuidesIfEmpty();
    const guides = loadGuides();

    const selectedGuide = guides.find((g: GuideBlock) => g.id === guideId);
    setGuide(selectedGuide || null);

    const savedProgress = localStorage.getItem(LS_PROGRESS_KEY);
    if (savedProgress) {
      setCompletedModules(JSON.parse(savedProgress));
    } else {
      setCompletedModules([]);
    }
  }, [guideId]);

  const toggleModuleCompletion = (moduleId: string) => {
    const newCompleted = completedModules.includes(moduleId)
      ? completedModules.filter((id) => id !== moduleId)
      : [...completedModules, moduleId];

    setCompletedModules(newCompleted);
    localStorage.setItem(LS_PROGRESS_KEY, JSON.stringify(newCompleted));
  };

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Guide not found. Please select a role.</p>
      </div>
    );
  }

  // Modules dynamically generated
  const modules = [
    {
      id: "role-overview",
      title: "Role Overview",
      description: guide.roleOverview || "No overview available",
      duration: "2 hours",
      difficulty: guide.level,
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "client-acquisition",
      title: "Client Acquisition",
      description: guide.clientAcquisition?.join(" ") || "No content available",
      duration: "1.5 hours",
      difficulty: guide.level,
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: "pricing-packages",
      title: "Pricing & Packages",
      description: guide.pricingPackages?.join(" ") || "No content available",
      duration: "1 hour",
      difficulty: guide.level,
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: "tools-templates",
      title: "Tools & Templates",
      description: guide.toolsTemplates?.join(" ") || "No content available",
      duration: "45 mins",
      difficulty: guide.level,
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      id: "service-delivery",
      title: "Service Delivery Standards",
      description: guide.serviceStandards?.join(" ") || "No content available",
      duration: "30 mins",
      difficulty: guide.level,
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];

  const completionRate = Math.round(
    (completedModules.length / modules.length) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-6 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {guide.title}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {guide.category} - {guide.level}
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {guide.roleOverview}
          </p>

          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm font-medium text-[#2AA100]">
                {completionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-[#2AA100] h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {completedModules.length} of {modules.length} modules completed
            </p>
          </div>
        </div>

        {/* Modules Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Learning Modules
            </h2>
            <div className="space-y-4">
              {modules.map((module) => {
                const isCompleted = completedModules.includes(module.id);
                return (
                  <div
                    key={module.id}
                    className={`bg-white rounded-xl p-6 shadow-sm border transition-all hover:shadow-md ${
                      isCompleted
                        ? "border-[#2AA100] bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`p-3 rounded-lg ${
                            isCompleted
                              ? "bg-[#2AA100] text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {module.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-800">
                              {module.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {module.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {module.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleModuleCompletion(module.id)}
                        className={`p-2 rounded-full transition-colors ${
                          isCompleted
                            ? "bg-[#2AA100] text-white hover:bg-green-700"
                            : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                        }`}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {guide.quickWins?.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Quick Wins
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {guide.quickWins.map((win: string, i: number) => (
                    <li key={i}>{win}</li>
                  ))}
                </ul>
              </div>
            )}

            {guide.aiAutomationTips?.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  AI Automation Tips
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {guide.aiAutomationTips.map((tip: string, i: number) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartGuidePage;
