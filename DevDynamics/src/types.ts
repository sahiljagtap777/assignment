// src/types.ts
export interface Activity {
  name: string;
  value: number; // Ensure value type is number
}

export interface DeveloperActivity {
  name: string;
  totalActivity: Activity[];
}

export interface ActivityMeta {
  label: string;
  fillColor: string;
}

export interface DayWiseActivityItem {
  count: number;
  label: string;
  fillColor: string;
}

export interface DayWiseActivity {
  date: string;
  items: {
    children: DayWiseActivityItem[];
  };
}

export interface DeveloperActivityWithDayWise extends DeveloperActivity {
  dayWiseActivity: DayWiseActivity[];
}

export interface AuthorWorklog {
  activityMeta: ActivityMeta[];
  rows: DeveloperActivityWithDayWise[];
}

export interface APIData {
  AuthorWorklog: AuthorWorklog;
}

export interface TransformedData {
  name: string;
  [key: string]: string | number;
}