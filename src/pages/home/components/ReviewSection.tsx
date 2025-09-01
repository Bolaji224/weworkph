import React from "react";
import { Star, MapPin, Calendar, User, Briefcase, Heart } from "lucide-react";

const ReviewSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: "Chioma O.",
      role: "Entrepreneur",
      location: "Manchester",
      rating: 5,
      date: "2d ago",
      avatar: "CO",
      review: "Hiring a VA through WeWorkPerHour was the best decision. I finally got my admin tasks under control, emails responded to on time, and my calendar properly managed.",
      category: "Virtual Assistant",
      verified: true
    },
    {
      id: 2,
      name: "James L.",
      role: "Tech Founder",
      location: "UK",
      rating: 5,
      date: "1w ago",
      avatar: "JL",
      review: "I didn't just get a VA; I got a partner who anticipates my needs. It feels like I have a full team behind me.",
      category: "Virtual Assistant",
      verified: true
    },
    {
      id: 3,
      name: "Anita B.",
      role: "Marketing Consultant",
      location: "UK",
      rating: 5,
      date: "2w ago",
      avatar: "AB",
      review: "Instead of wasting weeks searching for freelancers, I got a verified editor within 48 hours through SmartStart. The process was so smooth.",
      category: "SmartStart",
      verified: true
    },
    {
      id: 4,
      name: "Olu T.",
      role: "Diaspora Entrepreneur",
      location: "London",
      rating: 5,
      date: "3w ago",
      avatar: "OT",
      review: "The SmartStart pack saved me. I didn't have to interview endlessly—WeWorkPerHour sent me pre-vetted talent who matched my exact needs.",
      category: "SmartStart",
      verified: true
    },
    {
      id: 5,
      name: "Blessing",
      role: "Freelance Video Editor",
      location: "Nigeria",
      rating: 5,
      date: "1m ago",
      avatar: "BL",
      review: "Getting SkillStamped on WeWorkPerHour gave me credibility. I landed my first UK client within a week.",
      category: "SkillStamp",
      verified: true
    },
    {
      id: 6,
      name: "Kelechi",
      role: "VA",
      location: "Lagos",
      rating: 5,
      date: "1m ago",
      avatar: "KE",
      review: "As a VA, I've joined platforms before, but none felt this personal. WeWorkPerHour not only got me clients, but also trained me with SmartGuide.",
      category: "SmartGuide",
      verified: true
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Virtual Assistant":
        return "from-blue-600 to-blue-600";
      case "SmartStart":
        return "from-green-600 to-green-600";
      case "SkillStamp":
        return "from-purple-500 to-purple-500";
      case "SmartGuide":
        return "from-pink-500 to-pink-500";
      default:
        return "from-gray-500 to-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Virtual Assistant":
        return User;
      case "SmartStart":
        return Briefcase;
      case "SkillStamp":
        return Star;
      case "SmartGuide":
        return Heart;
      default:
        return Star;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Main Title */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-800">What Our </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Community
            </span>
            <span className="text-gray-800"> Says</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 font-medium max-w-3xl mx-auto">
            Real stories from freelancers and clients who've transformed their careers and businesses with WeWorkPerHour.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent mb-1">4.9★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-1">2,847</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-pink-500 bg-clip-text text-transparent mb-1">1,200+</div>
              <div className="text-sm text-gray-600">Active Freelancers</div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {reviews.map((review) => {
            const CategoryIcon = getCategoryIcon(review.category); 
            const categoryColor = getCategoryColor(review.category);
            
            return (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Decorative Background Element */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${categoryColor} opacity-10 rounded-bl-3xl`}></div>
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className={`w-12 h-12 bg-gradient-to-r ${categoryColor} rounded-full flex items-center justify-center text-white font-bold`}>
                      {review.avatar}
                    </div>
                    
                    {/* User Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800">{review.name}</h3>
                        {review.verified && (
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{review.role}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} />
                        <span>{review.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>{review.date}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {review.rating}.0
                  </span>
                </div>

                {/* Review Content */}
                <blockquote className="text-gray-700 leading-relaxed text-sm lg:text-base mb-4 italic">
                  "{review.review}"
                </blockquote>

                {/* Category Badge */}
                <div className="flex items-center gap-2">
                  <div className={`inline-flex items-center gap-1 bg-gradient-to-r ${categoryColor} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                    <CategoryIcon size={12} />
                    <span>{review.category}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-12 bg-white rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Join Thousands of Satisfied Users
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our community continues to grow with freelancers and clients who trust WeWorkPerHour 
              for their professional needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2,847</div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">1,200+</div>
              <div className="text-sm text-gray-600">Active Freelancers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;