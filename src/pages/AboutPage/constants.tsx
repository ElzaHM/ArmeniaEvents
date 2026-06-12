import type { ComponentType, ReactNode } from 'react';
import styles from './AboutPage.module.css';
import {
  TeamOutlined,
  RocketOutlined,
  BookOutlined,
  CodeOutlined,
  ApiOutlined,
  DatabaseOutlined,
  ShareAltOutlined,
  LayoutOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  LoginOutlined,
  SafetyOutlined,
  UserOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import cityTall from '../../assets/aboutBg.png';
import landscapeWide from '../../assets/signInImg.png';
import elzaImg from '../../assets/team/elza.png';
import lilitImg from '../../assets/team/lilit.png';
import martaImg from '../../assets/team/marta.png';
import hasmikImg from '../../assets/team/hasmik.png';

type IconComponent = ComponentType<{ className?: string }>;

export type TeamResponsibility = {
  Icon: IconComponent;
  label: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  responsibilities: TeamResponsibility[];
  socials?: {
    linkedin?: string;
    github?: string;
  };
};

export type TechStackLogo =
  | { kind: 'image'; src: string; alt: string; filter?: string }
  | { kind: 'express' }
  | { kind: 'zod' };

export type TechStackItem = {
  name: string;
  logo: TechStackLogo;
};

export const ABOUT_PAGE_HEADER = {
  label: 'About',
  title: 'Armenia',
  titleAccent: 'Events',
  subtitle:
    'Discover the story behind Armenia Events, the team, and the technology that powers it.',
} as const;

export const STORY_SECTION = {
  label: 'The Project',
  title: 'Our Story',
  image: cityTall,
  paragraphs: [
    <>
      <span className={styles.storyQuote}>&quot;Armenia Events&quot;</span> was born as the final
      graduation project of the <strong>AGBU Training Program</strong>. Our team of four built this
      platform from the ground up in just two intense weeks. Under the expert guidance of our
      instructor, <strong>Karen Asatryan</strong>, we transformed complex technical challenges into a
      seamless user experience.
    </>,
    <>
      What our platform does:
      <br />
      Users can instantly discover events filtered by category, location, and date. Moreover, we
      empower everyone to become an organizer; through our &ldquo;Create Event&rdquo; feature, you
      can easily publish your own events and reach thousands of people across Armenia.
    </>,
  ] as ReactNode[],
  Icon: BookOutlined,
};

export const VISION_SECTION = {
  label: 'Our Vision',
  title: 'Our Vision',
  image: landscapeWide,
  paragraphs: [
    'To become the primary gateway for locals, tourists, and expats to experience the rich tapestry of events that Armenia has to offer.',
    'We have built more than just a website; it is the most direct path to joining the vibrant social and professional pulse of Armenia.',
  ],
  Icon: RocketOutlined,
} as const;

export const TEAM_SECTION = {
  label: 'The Team',
  title: 'Meet Our Team',
  Icon: TeamOutlined,
} as const;

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'elza',
    name: 'Elza Hovhannisyan',
    role: 'Full Stack Developer & Team Lead',
    image: elzaImg,
    imageAlt: 'Elza',
    responsibilities: [
      { Icon: CodeOutlined, label: 'Events feature architecture' },
      { Icon: ApiOutlined, label: 'REST API integration' },
      { Icon: DatabaseOutlined, label: 'Backend services' },
      { Icon: ShareAltOutlined, label: 'Eventbrite import' },
      { Icon: TeamOutlined, label: 'Team coordination' },
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/elza-hovhannisyan-25a6b0233/',
      github: 'https://github.com/ElzaHM',
    },
  },
  {
    id: 'lilit',
    name: 'Lilit Hovhannisyan',
    role: 'UI/UX Designer & Frontend Developer',
    image: lilitImg,
    imageAlt: 'Lilit',
    responsibilities: [
      { Icon: LayoutOutlined, label: 'Full project design system' },
      { Icon: AppstoreOutlined, label: 'Create Event UI' },
      { Icon: BgColorsOutlined, label: 'About page design' },
      { Icon: DashboardOutlined, label: 'Contact page' },
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/lilit-hovhannisyan-729508211',
      github: 'https://github.com/hovhannisyanlil92-alt',
    },
  },
  {
    id: 'marta',
    name: 'Marta Hayrapetyan',
    role: 'Frontend Developer',
    image: martaImg,
    imageAlt: 'Marta',
    responsibilities: [
      { Icon: SafetyOutlined, label: 'Admin panel (full)' },
      { Icon: DashboardOutlined, label: 'Dashboard analytics' },
      { Icon: BgColorsOutlined, label: 'Glassmorphism theme' },
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/mh-marta-hayrapetyan/',
      github: 'https://github.com/Marta109',
    },
  },
  {
    id: 'hasmik',
    name: 'Hasmik Asatryan',
    role: 'Frontend Developer',
    image: hasmikImg,
    imageAlt: 'Hasmik',
    responsibilities: [
      { Icon: LoginOutlined, label: 'Login & registration flows' },
      { Icon: SafetyOutlined, label: 'Auth routing' },
      { Icon: UserOutlined, label: 'User management UI' },
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/hasmik-asatryan-572892258',
      github: 'https://asmikasatryan.github.io',
    },
  },
];

export const TECH_SECTION = {
  label: 'The Technology',
  title: 'Built With Modern Tools',
  Icon: CodeOutlined,
} as const;

export const TECH_STACK: TechStackItem[] = [
  {
    name: 'React 19',
    logo: {
      kind: 'image',
      src: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg',
      alt: 'React',
      filter:
        'invert(84%) sepia(29%) saturate(4920%) hue-rotate(174deg) brightness(103%) contrast(101%)',
    },
  },
  {
    name: 'TypeScript',
    logo: {
      kind: 'image',
      src: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/typescript.svg',
      alt: 'TypeScript',
    },
  },
  {
    name: 'Ant Design',
    logo: {
      kind: 'image',
      src: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      alt: 'Ant Design',
    },
  },
  {
    name: 'Supabase',
    logo: {
      kind: 'image',
      src: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/supabase.svg',
      alt: 'Supabase',
      filter:
        'invert(65%) sepia(85%) saturate(378%) hue-rotate(106deg) brightness(95%) contrast(92%)',
    },
  },
  {
    name: 'Express',
    logo: { kind: 'express' },
  },
  {
    name: 'Vite',
    logo: {
      kind: 'image',
      src: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vite.svg',
      alt: 'Vite',
    },
  },
  {
    name: 'React Query',
    logo: {
      kind: 'image',
      src: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/reactquery.svg',
      alt: 'React Query',
      filter:
        'invert(37%) sepia(93%) saturate(5427%) hue-rotate(345deg) brightness(101%) contrast(101%)',
    },
  },
  {
    name: 'Zod',
    logo: { kind: 'zod' },
  },
];
