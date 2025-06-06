export interface NewUser {
    name: string;
    profession: string;
    company?: string;
    address?: string;
    email?: string;
    phone?: string;
    website?: string;
    photo?: string;
    coverImage?: string;
    cv_url?: string;
    bio?: string;
    skills?: string[];
    years_of_experience?: number;
    specializations?: string[];
    languages?: string[];
    linkedIn?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
    personal_projects?: { title: string; description: string; link?: string }[];
    previous_positions?: { title: string; company: string; duration: string; description: string }[];
    education?: { degree: string; institution: string; year: string }[];
    projects?: { title: string; description: string; link?: string }[];
    certifications?: string[];
    awards?: string[];
  }

  export interface User extends NewUser {
    id: string;
    created_at: string;
    updated_at?: string;
  }