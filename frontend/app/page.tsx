"use client";

import Navigation from "@/components/layout/Navigation";
import { getCourses, getEnrollments, getStudents } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["enrollments"],
    queryFn: getEnrollments,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  // Calculate enrollments per course
  const enrollmentsPerCourse = courses.map((course) => ({
    name: course.name,
    count: enrollments.filter((e) => e.course_id === course.id).length,
  }));

  // Calculate student distribution (percentage of total enrollments)
  const studentDistribution = students.map((student) => ({
    name: student.name,
    percentage:
      (enrollments.filter((e) => e.student_id === student.id).length /
        enrollments.length) *
      100,
  }));

  const barChartData = {
    labels: enrollmentsPerCourse.map((item) => item.name),
    datasets: [
      {
        label: "Number of Enrollments",
        data: enrollmentsPerCourse.map((item) => item.count),
        backgroundColor: "rgba(79, 70, 229, 0.5)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
      },
    ],
  };

  const backgroundColors = generateColors(studentDistribution.length);
  const borderColors = backgroundColors.map((color) =>
    color.replace("70%", "40%").replace(/0\.7\)$/, "1)")
  );

  const pieChartData = {
    labels: studentDistribution.map((item) => item.name),
    datasets: [
      {
        data: studentDistribution.map((item) => item.percentage),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Enrollments per Course",
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Student Distribution",
      },
    },
  };

  if (enrollmentsLoading || studentsLoading || coursesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Students
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {students.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Courses
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {courses.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Enrollments
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {enrollments.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <Bar
                options={barChartOptions}
                data={barChartData}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <Pie
                options={pieChartOptions}
                data={pieChartData}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const generateColors = (count: number) => {
  const colors = [];

  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count; // Distribute hues evenly
    colors.push(`hsla(${hue}, 70%, 70%, 0.7)`);
  }

  return colors;
};
