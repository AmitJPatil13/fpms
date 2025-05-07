import { Clock, FileText, Star, Users } from "lucide-react";

export const GeneralFacultyInfo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {/* Teaching Hours Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Teaching Hours</p>
            <h3 className="text-2xl font-bold text-gray-700 mt-2">24</h3>
            <p className="text-green-600 text-sm mt-2">+2.5% from last month</p>
          </div>
          <Clock className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      {/* Research Papers Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Research Papers</p>
            <h3 className="text-2xl font-bold text-gray-700 mt-2">12</h3>
            <p className="text-green-600 text-sm mt-2">3 published this year</p>
          </div>
          <FileText className="h-8 w-8 text-purple-500" />
        </div>
      </div>

      {/* Student Rating Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Student Rating</p>
            <h3 className="text-2xl font-bold text-gray-700 mt-2">4.8</h3>
            <p className="text-green-600 text-sm mt-2">96% positive feedback</p>
          </div>
          <Star className="h-8 w-8 text-yellow-500" />
        </div>
      </div>

      {/* Activities Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Activities</p>
            <h3 className="text-2xl font-bold text-gray-700 mt-2">8</h3>
            <p className="text-green-600 text-sm mt-2">2 upcoming events</p>
          </div>
          <Users className="h-8 w-8 text-green-500" />
        </div>
      </div>
    </div>
  );
};
