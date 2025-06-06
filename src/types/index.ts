export interface Project {
  title: string;
  description: string;
  link?: string;
}

export interface Position {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface User {
  id: string;
  name: string;
  profession: string;
  company?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  photo: string;
  coverImage?: string;
  cv_url?: string;
  bio?: string;
  linkedIn?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  skills: string[];
  years_of_experience?: number;
  specializations: string[];
  languages: string[];
  certifications: string[];
  awards: string[];
  personal_projects: Project[];
  previous_positions: Position[];
  education: Education[];
  projects: Project[];
  created_at: string;
}

export interface NewUser extends Omit<User, 'id' | 'created_at'> {}