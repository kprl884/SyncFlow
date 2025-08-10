import React, { useState, useMemo } from 'react';
import { mockSprints, mockTasks } from '../data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sprint } from '../types';

const ReportsPage: React.FC = () => {
  const [selectedSprintId, setSelectedSprintId] = useState<string>(mockSprints[mockSprints.length - 1].id);

  const velocityData = useMemo(() => {
    return mockSprints.map(sprint => {
      const completedPoints = mockTasks
        .filter(task => task.sprintId === sprint.id && task.status === 'Done' && task.storyPoints)
        .reduce((sum, task) => sum + (task.storyPoints || 0), 0);
      return { name: sprint.name, velocity: completedPoints };
    });
  }, []);

  const burndownData = useMemo(() => {
    const sprint = mockSprints.find(s => s.id === selectedSprintId);
    if (!sprint) return [];

    const sprintTasks = mockTasks.filter(t => t.sprintId === sprint.id);
    const totalStoryPoints = sprintTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
    
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const sprintDurationDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;
    
    const idealPointsPerDay = totalStoryPoints / (sprintDurationDays - 1);

    const data = [];
    for (let i = 0; i < sprintDurationDays; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const completedPointsOnDate = sprintTasks
            .filter(t => t.status === 'Done' && t.completedAt && new Date(t.completedAt) <= currentDate)
            .reduce((sum, task) => sum + (task.storyPoints || 0), 0);
        
        const actualRemaining = totalStoryPoints - completedPointsOnDate;
        const idealRemaining = Math.max(0, totalStoryPoints - (idealPointsPerDay * i));

        data.push({
            day: `Day ${i + 1}`,
            date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            'Ideal Burn': idealRemaining.toFixed(1),
            'Actual Burn': actualRemaining,
        });
    }

    return data;
  }, [selectedSprintId]);

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Velocity Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Team Velocity</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Total story points completed per sprint.</p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={velocityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                      backgroundColor: 'rgba(31, 41, 55, 0.8)',
                      borderColor: '#4b5563',
                      color: '#ffffff'
                  }}
                />
                <Legend />
                <Bar dataKey="velocity" fill="#4f46e5" name="Story Points"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Burndown Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
           <div className="flex flex-wrap justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sprint Burndown</h2>
               <div className="mt-2 sm:mt-0">
                  <label htmlFor="sprint-select" className="sr-only">Select Sprint</label>
                  <select 
                    id="sprint-select"
                    value={selectedSprintId}
                    onChange={(e) => setSelectedSprintId(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm"
                  >
                    {mockSprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
               </div>
           </div>
           <p className="text-gray-600 dark:text-gray-400 mb-6">Remaining story points over the course of the sprint.</p>
           <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={burndownData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                borderColor: '#4b5563',
                                color: '#ffffff'
                            }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="Ideal Burn" stroke="#8884d8" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="Actual Burn" stroke="#82ca9d" strokeWidth={2}/>
                    </LineChart>
                </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
