import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { XMarkIcon, MagnifyingGlassIcon, UserIcon, EnvelopeIcon, IdentificationIcon, BriefcaseIcon, MapPinIcon, BuildingOfficeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Chart from 'chart.js/auto';

// Mock data remains unchanged
const mockStudents = {
  1: [
    {
      reg_no: "CS123",
      name: "John Doe",
      email: "john@college.edu",
      contact: "1234567890",
      studying_year: 2,
      graduation_year: 2024,
      job_title: "Software Engineer",
      job_location: "Chennai",
      previous_company: "Tech Corp",
      department: "Computer Science",
      gpa: 8.5,
    },
    {
      reg_no: "CS124",
      name: "Alice Johnson",
      email: "alice@college.edu",
      contact: "9876543210",
      studying_year: 2,
      graduation_year: 2024,
      job_title: "Data Analyst",
      job_location: "Bangalore",
      previous_company: "Data Insights",
      department: "Computer Science",
      gpa: 8.9,
    },
    {
      reg_no: "CS125",
      name: "Bob Wilson",
      email: "bob@college.edu",
      contact: "8765432109",
      studying_year: 3,
      graduation_year: 2023,
      job_title: "Full Stack Developer",
      job_location: "Hyderabad",
      previous_company: "Web Solutions",
      department: "Computer Science",
      gpa: 7.8,
    },
  ],
  2: [
    {
      reg_no: "ME201",
      name: "Emma Brown",
      email: "emma@college.edu",
      contact: "7654321098",
      studying_year: 2,
      graduation_year: 2024,
      job_title: null,
      job_location: null,
      previous_company: null,
      department: "Mechanical Engineering",
      gpa: 8.2,
    },
  ],
  3: [
    {
      reg_no: "TM456",
      name: "Jane Smith",
      email: "jane@college.edu",
      contact: "0987654321",
      studying_year: 1,
      graduation_year: 2025,
      job_title: null,
      job_location: null,
      previous_company: null,
      department: "Telecommunication",
      gpa: 9.0,
    },
    {
      reg_no: "TM457",
      name: "Michael Lee",
      email: "michael@college.edu",
      contact: "6543210987",
      studying_year: 1,
      graduation_year: 2025,
      job_title: null,
      job_location: null,
      previous_company: null,
      department: "Telecommunication",
      gpa: 8.7,
    },
  ],
};

const ViewStudents = () => {
  const { degreeId } = useParams();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    reg_no: '',
    email: '',
    job_title: '',
    job_location: '',
    previous_company: '',
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [currentChart, setCurrentChart] = useState(0);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log('Fetching students for degreeId:', degreeId);
    if (!degreeId || isNaN(degreeId)) {
      console.error('Invalid degreeId:', degreeId);
      setErrorMessage('Invalid degree ID.');
      return;
    }
    const degreeStudents = mockStudents[degreeId] || [];
    console.log('Students for degree', degreeId, ':', degreeStudents);
    setStudents(degreeStudents);
    setFilteredStudents(degreeStudents);
  }, [degreeId]);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      student.reg_no.toLowerCase().includes(filters.reg_no.toLowerCase()) &&
      student.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      (filters.job_title ? (student.job_title || '').toLowerCase().includes(filters.job_title.toLowerCase()) : true) &&
      (filters.job_location ? (student.job_location || '').toLowerCase().includes(filters.job_location.toLowerCase()) : true) &&
      (filters.previous_company ? (student.previous_company || '').toLowerCase().includes(filters.previous_company.toLowerCase()) : true)
    );
    setFilteredStudents(filtered);
  }, [filters, students]);

  const initializeChart = (data, type, label, title, colors) => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type,
        data: {
          labels: data.labels,
          datasets: [{
            label,
            data: data.datasets[0].data,
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          animation: {
            duration: 1000,
            easing: 'easeInOutQuad',
          },
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: title, font: { size: 16 } },
          },
          ...(type === 'bar' && {
            scales: {
              y: { beginAtZero: true, ...(type === 'bar' && label === 'Average GPA' && { max: 10 }) },
            },
          }),
        },
      });
    }
  };

  useEffect(() => {
    if (showAnalytics && canvasRef.current) {
      const charts = [
        {
          type: 'pie',
          getData: () => {
            const jobStatusData = {
              employed: selectedStudent ? (selectedStudent.job_title ? 1 : 0) : filteredStudents.filter(s => s.job_title).length,
              unemployed: selectedStudent ? (selectedStudent.job_title ? 0 : 1) : filteredStudents.filter(s => !s.job_title).length,
            };
            return {
              labels: ['Employed', 'Unemployed'],
              datasets: [{ data: [jobStatusData.employed, jobStatusData.unemployed] }],
            };
          },
          label: 'Job Status',
          title: 'Job Status Distribution',
          colors: { background: ['#4f46e5', '#e5e7eb'], border: ['#3730a3', '#d1d5db'] },
        },
        {
          type: 'bar',
          getData: () => {
            if (selectedStudent) {
              return {
                labels: [selectedStudent.department],
                datasets: [{ data: [selectedStudent.gpa || 0] }],
              };
            }
            const departments = [...new Set(filteredStudents.map(s => s.department))];
            const gpaData = departments.map(dept => {
              const deptStudents = filteredStudents.filter(s => s.department === dept);
              return deptStudents.reduce((sum, s) => sum + (s.gpa || 0), 0) / (deptStudents.length || 1);
            });
            return {
              labels: departments,
              datasets: [{ data: gpaData }],
            };
          },
          label: 'Average GPA',
          title: selectedStudent ? 'GPA of Selected Student' : 'Average GPA by Department',
          colors: { background: '#8b5cf6', border: '#6d28d9' },
        },
        {
          type: 'bar',
          getData: () => {
            if (selectedStudent) {
              return {
                labels: [selectedStudent.graduation_year || 'Unknown'],
                datasets: [{ data: [1] }],
              };
            }
            const years = filteredStudents.map(s => s.graduation_year).filter(y => y);
            const yearCounts = {};
            years.forEach(year => {
              yearCounts[year] = (yearCounts[year] || 0) + 1;
            });
            const yearLabels = Object.keys(yearCounts).sort();
            return {
              labels: yearLabels,
              datasets: [{ data: yearLabels.map(year => yearCounts[year]) }],
            };
          },
          label: 'Students',
          title: selectedStudent ? 'Graduation Year of Selected Student' : 'Graduation Year Distribution',
          colors: { background: '#ec4899', border: '#db2777' },
        },
      ];

      const current = charts[currentChart];
      initializeChart(current.getData(), current.type, current.label, current.title, current.colors);
    }
  }, [showAnalytics, currentChart, filteredStudents, selectedStudent]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      reg_no: '',
      email: '',
      job_title: '',
      job_location: '',
      previous_company: '',
    });
  };

  const openModal = (student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  const toggleAnalytics = () => {
    setShowAnalytics(prev => !prev);
    setCurrentChart(0);
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  };

  const switchChart = () => {
    setCurrentChart(prev => (prev + 1) % 3);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-800">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50 bg-opacity-90 md:rounded-tl-3xl overflow-y-auto max-h-screen relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%2280%22 height%3D%2280%22 viewBox%3D%220 0 80 80%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg fill%3D%22none%22 fill-rule%3D%22evenodd%22%3E%3Cg fill%3D%22%23a5b4fc%22 fill-opacity%3D%220.3%22%3E%3Cpath d%3D%22M40 48a8 8 0 100-16 8 8 0 000 16zm0 16a8 8 0 100-16 8 8 0 000 16zM8 48a8 8 0 100-16 8 8 0 000 16zm64 0a8 8 0 100-16 8 8 0 000 16z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pt-12 md:pt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-900 tracking-tight drop-shadow-md flex items-center gap-3">
              <UserIcon className="h-9 w-9 text-indigo-600 animate-pulse" />
              Students for Degree ID {degreeId}
            </h1>
            <button
              onClick={toggleAnalytics}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg flex items-center gap-2 transform hover:scale-105"
            >
              {showAnalytics ? 'Hide Analytics' : 'View Analytics'}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>
          {/* Filter Box */}
          <div className="bg-white/95 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-xl mb-6 border-2 border-purple-500 transition-all duration-200 relative z-10">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-900 flex items-center mb-4 drop-shadow-sm">
              <MagnifyingGlassIcon className="mr-2 h-6 w-6 text-purple-500" /> Filter Students
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'name', label: 'Name', placeholder: 'Filter by Name', icon: UserIcon },
                { name: 'reg_no', label: 'Registration No', placeholder: 'Filter by Reg No', icon: IdentificationIcon },
                { name: 'email', label: 'Email', placeholder: 'Filter by Email', icon: EnvelopeIcon },
                { name: 'job_title', label: 'Job Title', placeholder: 'Filter by Job Title', icon: BriefcaseIcon },
                { name: 'job_location', label: 'Job Location', placeholder: 'Filter by Job Location', icon: MapPinIcon },
                { name: 'previous_company', label: 'Previous Company', placeholder: 'Filter by Previous Company', icon: BuildingOfficeIcon },
              ].map(({ name, label, placeholder, icon: Icon }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                    <input
                      type="text"
                      name={name}
                      value={filters[name]}
                      onChange={handleFilterChange}
                      placeholder={placeholder}
                      className="w-full pl-10 pr-3 py-2 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 text-gray-900 placeholder-gray-400 transition-all duration-200 text-sm sm:text-base"
                      aria-label={placeholder}
                    />
                  </div>
                </div>
              ))}
              <div className="sm:col-span-2 md:col-span-3 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-purple-600 hover:text-purple-800 font-medium transition-all duration-200 text-sm sm:text-base flex items-center gap-2"
                  aria-label="Clear all filters"
                >
                  <ArrowPathIcon className="h-5 w-5" /> Clear Filters
                </button>
              </div>
            </div>
          </div>
          {errorMessage && (
            <div className="bg-red-500/90 text-white px-5 py-3 rounded-xl mb-6 backdrop-blur-md animate-pulse shadow-lg border border-red-400">
              {errorMessage}
            </div>
          )}
          <div className={`flex ${showAnalytics ? 'flex-col lg:flex-row gap-6' : ''}`}>
            <div className={`${showAnalytics ? 'lg:w-1/2' : 'w-full'} transition-all duration-500`}>
              {filteredStudents.length === 0 ? (
                <div className="text-center text-gray-600 text-lg font-medium bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border-2 border-purple-300 animate-fade-in">
                  No students available.
                </div>
              ) : (
                <div className="relative bg-white/90 p-4 sm:p-6 rounded-2xl shadow-2xl border-2 border-purple-400 bg-gradient-to-br from-white/70 to-purple-100/70 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-indigo-400/30 opacity-60"></div>
                  <div className="overflow-x-auto relative z-10">
                    <table className="min-w-full rounded-lg">
                      <thead>
                        <tr className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
                          <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base">Reg No</th>
                          <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base">Name</th>
                          <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base">Email</th>
                          <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base">Contact</th>
                          <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base">Year</th>
                          <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base">Graduation</th>
                          <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base">Job Title</th>
                          <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base">Location</th>
                          <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student) => (
                          <tr
                            key={student.reg_no}
                            className={`border-t border-purple-400/50 hover:bg-purple-100/50 transition-all duration-300 animate-slide-in ${selectedStudent?.reg_no === student.reg_no ? 'bg-indigo-100/80' : ''}`}
                            onClick={() => openModal(student)}
                          >
                            <td className="py-3 px-4 text-gray-800 text-sm sm:text-base">{student.reg_no}</td>
                            <td className="py-3 px-4 text-gray-800 text-sm sm:text-base">{student.name}</td>
                            <td className="py-3 px-4 text-gray-800 text-sm sm:text-base">{student.email}</td>
                            <td className="py-3 px-4 text-gray-800 text-sm sm:text-base">{student.contact}</td>
                            <td className="py-3 px-4 text-gray-800 text-sm sm:text-base">{student.studying_year}</td>
                            <td className="py-3 px-4 text-gray-800 text-sm sm:text-base">{student.graduation_year || '-'}</td>
                            <td className="py-3 px-4 text-gray-800 text-sm sm:text-base">{student.job_title || '-'}</td>
                            <td className="py-3 px-4 text-gray-800 text-sm sm:text-base">{student.job_location || '-'}</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={(e) => { e.stopPropagation(); openModal(student); }}
                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-sm font-medium shadow-md transform hover:scale-105"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            {showAnalytics && (
              <div className="lg:w-1/2 bg-white/95 p-6 rounded-2xl shadow-2xl border-2 border-indigo-300 animate-slide-in">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-indigo-900">Student Analytics</h2>
                  <button
                    onClick={switchChart}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md flex items-center gap-2 transform hover:scale-105"
                  >
                    Next Chart
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
                <div className="relative bg-gradient-to-br from-white/80 to-indigo-100/80 p-4 rounded-xl shadow-lg border border-indigo-200">
                  <canvas ref={canvasRef} className="max-h-80"></canvas>
                </div>
              </div>
            )}
          </div>
        </div>
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md">
            <div className="bg-white/95 p-4 sm:p-6 rounded-2xl max-w-md w-full shadow-2xl border-2 border-indigo-400 animate-scale-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 flex items-center gap-2">
                  <UserIcon className="h-6 w-6 text-indigo-600" />
                  Student Details
                </h2>
                <button onClick={closeModal} className="text-gray-600 hover:text-gray-800 transform hover:scale-110 transition-transform duration-200">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-2 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 p-4 rounded-xl border border-indigo-200 text-sm sm:text-base">
                <p className="flex items-center gap-2">
                  <IdentificationIcon className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold">Reg No:</span> {selectedStudent.reg_no}
                </p>
                <p className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold">Name:</span> {selectedStudent.name}
                </p>
                <p className="flex items-center gap-2">
                  <EnvelopeIcon className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold">Email:</span> {selectedStudent.email}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Contact:</span> {selectedStudent.contact}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Studying Year:</span> {selectedStudent.studying_year}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Graduation Year:</span> {selectedStudent.graduation_year || '-'}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Department:</span> {selectedStudent.department || '-'}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">GPA:</span> {selectedStudent.gpa || '-'}
                </p>
                <p className="flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold">Job Title:</span> {selectedStudent.job_title || '-'}
                </p>
                <p className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold">Job Location:</span> {selectedStudent.job_location || '-'}
                </p>
                <p className="flex items-center gap-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-indigo-600" />
                  <span className="font-semibold">Previous Company:</span> {selectedStudent.previous_company || '-'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-md transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewStudents;