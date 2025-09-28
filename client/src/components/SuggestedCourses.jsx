import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const SuggestedCourses = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;
  
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.map((course) => (
          <Card key={course._id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <CardTitle className="text-lg">
                <Link to={`/course/${course._id}`}>{course.courseTitle}</Link>
              </CardTitle>
              <p className="text-gray-600 mt-2">{course.reason}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuggestedCourses;