// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Header } from './StyledComponents';
import { DeveloperActivityWithDayWise, ActivityMeta, TransformedData } from '../types';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DeveloperActivityWithDayWise[]>([]);
  const [activityMeta, setActivityMeta] = useState<ActivityMeta[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  useEffect(() => {
    fetchData().then((data) => {
      const parsedData = data.AuthorWorklog.rows.map((developer) => ({
        ...developer,
        totalActivity: developer.totalActivity.map((activity) => ({
          ...activity,
          value: parseInt(activity.value, 10), // Convert value to number
        })),
        dayWiseActivity: developer.dayWiseActivity.map((day) => ({
          ...day,
          items: {
            children: day.items.children.map((item) => ({
              ...item,
              count: parseInt(item.count, 10), // Convert count to number
            }))
          }
        }))
      }));

      setData(parsedData);
      setActivityMeta(data.AuthorWorklog.activityMeta);
      setSelectedMetrics(data.AuthorWorklog.activityMeta.map(meta => meta.label));
    });
  }, []);

  const handleMetricChange = (metric: string) => {
    setSelectedMetrics((prevMetrics) =>
      prevMetrics.includes(metric)
        ? prevMetrics.filter((m) => m !== metric)
        : [...prevMetrics, metric]
    );
  };

  const transformData = (): TransformedData[] => {
    return data.map((developer) => {
      const transformed: TransformedData = { name: developer.name };
      developer.totalActivity.forEach((activity) => {
        if (selectedMetrics.includes(activity.name)) {
          transformed[activity.name] = activity.value; // No type error here
        }
      });
      return transformed;
    });
  };

  return (
    <Container>
      <Header>Developer Activity Dashboard</Header>
      <div>
        {activityMeta.map((activity) => (
          <label key={activity.label}>
            <input
              type="checkbox"
              checked={selectedMetrics.includes(activity.label)}
              onChange={() => handleMetricChange(activity.label)}
            />
            {activity.label}
          </label>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={transformData()}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {activityMeta.filter(meta => selectedMetrics.includes(meta.label)).map((activity) => (
            <Bar key={activity.label} dataKey={activity.label} fill={activity.fillColor} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default Dashboard;
