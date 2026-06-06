

import React from 'react';
import { Typography, Row, Col, Divider, Space } from 'antd';
import { 
  TeamOutlined, RocketOutlined, BookOutlined, CodeOutlined, ApiOutlined, 
  DatabaseOutlined, ShareAltOutlined, LayoutOutlined, AppstoreOutlined, 
  DashboardOutlined, LoginOutlined, SafetyOutlined, UserOutlined, 
  LinkedinOutlined, GithubOutlined, BgColorsOutlined 
} from '@ant-design/icons';
import '../../components/home/home.css';
import styles from './AboutPage.module.css';
import cityTall from '../../assets/aboutBg.png';
import landscapeWide from '../../assets/signInImg.png';
import elzaImg from '../../assets/team/elza.png';
import lilitImg from '../../assets/team/lilit.png';
import martaImg from '../../assets/team/marta.png';
import hasmikImg from '../../assets/team/hasmik.png';

const { Title, Paragraph, Text } = Typography;

export default function AboutPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className="homeSection">
        
        {/* --- Header --- */}
        <div className={styles.header}>
          <Title level={2} className={styles.aboutLabel}>About</Title>
          <Title level={1} className={styles.mainTitle}>Armenia <span className={styles.goldText}>Events</span></Title>
          <Paragraph className={styles.subtitle}>
            Discover the story behind Armenia Events, the team, and the technology that powers it.
          </Paragraph>
        </div>

        {/* --- Story & Vision (Equal Heights) --- */}
        <Row gutter={[24, 24]} align="stretch">
          <Col xs={24} lg={14}>
            <div className={styles.storyCard}>
              <div className={styles.cardContent}>
                <Space align="start" size={16}>
                  <div className={styles.iconBox}><BookOutlined /></div>
                  <div>
                    <Text className={styles.cardLabel}>The Project</Text>
                    <Title level={2} className={styles.cardTitle}>Our Story</Title>
                  </div>
                </Space>
                <Paragraph className={styles.descriptionText}>
                  Born as a final graduation project for the AGBU Training Program, Armenia Events was brought to life in just two weeks by a dedicated team of four. Our goal was to solve a common problem: the fragmentation of local events across countless social media pages and scattered websites.
                </Paragraph>
                <Paragraph className={styles.descriptionText}>
                  Unlike global platforms that treat Armenia as an afterthought, our mission is to provide an Armenia-first aggregation hub. We bring together tech meetups, cultural festivals, and business gatherings into one beautifully designed, searchable home.
                </Paragraph>
              </div>
              <div className={styles.storyImage} style={{ backgroundImage: `url(${cityTall})` }} />
            </div>
          </Col>
          <Col xs={24} lg={10}>
            <div className={styles.visionCard}>
              <Space align="start" size={16}>
                <div className={styles.iconBox}><RocketOutlined /></div>
                <div>
                  <Text className={styles.cardLabel}>Our Vision</Text>
                  <Title level={2} className={styles.cardTitle}>Our Vision</Title>
                </div>
              </Space>
              <Paragraph className={styles.descriptionText}>
                To become the primary gateway for locals, tourists, and expats to experience the rich tapestry of events that Armenia has to offer.
              </Paragraph>
              <Paragraph className={styles.descriptionText}>
                We are building more than a platform; we are building a community hub, powered by technology.
              </Paragraph>
              <div className={styles.visionImage} style={{ backgroundImage: `url(${landscapeWide})` }} />
            </div>
          </Col>
        </Row>

        {/* --- Meet Our Team --- */}
        <div className={styles.teamHeader}>
          <Space><TeamOutlined className={styles.goldText} /> <Text className={styles.cardLabel}>The Team</Text></Space>
          <Title level={2} className={styles.cardTitle}>Meet Our Team</Title>
        </div>

        <Row gutter={[20, 20]} align="stretch" className={styles.teamRow}>
          {/* ELZA */}
          <Col xs={24} sm={12} lg={6}>
            <div className={styles.teamCard}>
              <img src={elzaImg} className={styles.avatar} alt="Elza" />
              <Title level={4} className={styles.memberName}>Elza Hovhannisyan</Title>
              <Text className={styles.memberRole}>Full Stack Developer & Team Lead</Text>
              <Divider className={styles.cardDivider} />
              <div className={styles.responsibilities}>
                <div className={styles.respItem}><CodeOutlined /> <span>Events feature architecture</span></div>
                <div className={styles.respItem}><ApiOutlined /> <span>REST API integration</span></div>
                <div className={styles.respItem}><DatabaseOutlined /> <span>Backend services</span></div>
                <div className={styles.respItem}><ShareAltOutlined /> <span>Eventbrite import</span></div>
                <div className={styles.respItem}><TeamOutlined /> <span>Team coordination</span></div>
              </div>
              <Space className={styles.socials} size={20}><LinkedinOutlined /><GithubOutlined /></Space>
            </div>
          </Col>

          {/* LILIT */}
          <Col xs={24} sm={12} lg={6}>
            <div className={styles.teamCard}>
              <img src={lilitImg} className={styles.avatar} alt="Lilit" />
              <Title level={4} className={styles.memberName}>Lilit Hovhannisyan</Title>
              <Text className={styles.memberRole}>UI/UX Designer & Frontend Developer</Text>
              <Divider className={styles.cardDivider} />
              <div className={styles.responsibilities}>
                <div className={styles.respItem}><LayoutOutlined /> <span>Full project design system</span></div>
                <div className={styles.respItem}><AppstoreOutlined /> <span>Create Event UI</span></div>
                <div className={styles.respItem}><BgColorsOutlined /> <span>About page design</span></div>
                <div className={styles.respItem}><DashboardOutlined /> <span>Event page design</span></div>
              </div>
              <Space className={styles.socials} size={20}><LinkedinOutlined /><GithubOutlined /></Space>
            </div>
          </Col>

          {/* MARTA */}
          <Col xs={24} sm={12} lg={6}>
            <div className={styles.teamCard}>
              <img src={martaImg} className={styles.avatar} alt="Marta" />
              <Title level={4} className={styles.memberName}>Marta Hayrapetyan</Title>
              <Text className={styles.memberRole}>Frontend Developer</Text>
              <Divider className={styles.cardDivider} />
              <div className={styles.responsibilities}>
                <div className={styles.respItem}><SafetyOutlined /> <span>Admin panel (full)</span></div>
                <div className={styles.respItem}><DashboardOutlined /> <span>Dashboard analytics</span></div>
                <div className={styles.respItem}><BgColorsOutlined /> <span>Glassmorphism theme</span></div>
              </div>
              <Space className={styles.socials} size={20}><LinkedinOutlined /><GithubOutlined /></Space>
            </div>
          </Col>

          {/* HASMIK */}
          <Col xs={24} sm={12} lg={6}>
            <div className={styles.teamCard}>
              <img src={hasmikImg} className={styles.avatar} alt="Hasmik" />
              <Title level={4} className={styles.memberName}>Hasmik Asatryan</Title>
              <Text className={styles.memberRole}>Frontend Developer</Text>
              <Divider className={styles.cardDivider} />
              <div className={styles.responsibilities}>
                <div className={styles.respItem}><LoginOutlined /> <span>Login & registration flows</span></div>
                <div className={styles.respItem}><SafetyOutlined /> <span>Auth routing</span></div>
                <div className={styles.respItem}><UserOutlined /> <span>User management UI</span></div>
              </div>
              <Space className={styles.socials} size={20}><LinkedinOutlined /><GithubOutlined /></Space>
            </div>
          </Col>
        </Row>

        {/* --- Built With Modern Tools --- */}
        <div className={styles.techSection}>
          <div className={styles.techHeader}>
            <div className={styles.iconBox}><CodeOutlined /></div>
            <div className={styles.techHeaderText}>
              <Text className={styles.cardLabel}>The Technology</Text>
              <Title level={2} className={styles.cardTitle}>Built With Modern Tools</Title>
            </div>
          </div>

          <div className={styles.techStackRow}>
            {/* React */}
            <div className={styles.techItem}>
              <div className={styles.techLogoBox}>
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/react.svg" className={styles.svgIcon} style={{filter: 'invert(84%) sepia(29%) saturate(4920%) hue-rotate(174deg) brightness(103%) contrast(101%)'}} alt="React" />
              </div>
              <Text className={styles.techName}>React 19</Text>
            </div>
            {/* TS */}
            <div className={styles.techItem}>
              <div className={styles.techLogoBox}>
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/typescript.svg" className={styles.svgIcon} alt="TypeScript" />
              </div>
              <Text className={styles.techName}>TypeScript</Text>
            </div>
            {/* AntD */}
            <div className={styles.techItem}>
              <div className={styles.techLogoBox}>
                <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" className={styles.svgIcon} alt="Ant Design" />
              </div>
              <Text className={styles.techName}>Ant Design</Text>
            </div>
            {/* Supabase */}
            <div className={styles.techItem}>
              <div className={styles.techLogoBox}>
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/supabase.svg" className={styles.svgIcon} style={{filter: 'invert(65%) sepia(85%) saturate(378%) hue-rotate(106deg) brightness(95%) contrast(92%)'}} alt="Supabase" />
              </div>
              <Text className={styles.techName}>Supabase</Text>
            </div>
            {/* Express */}
            <div className={styles.techItem}>
              <div className={styles.techLogoBox}><Text style={{color: 'white', fontWeight: 'bold', fontSize: '20px'}}>ex</Text></div>
              <Text className={styles.techName}>Express</Text>
            </div>
            {/* Vite */}
            <div className={styles.techItem}>
              <div className={styles.techLogoBox}>
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vite.svg" className={styles.svgIcon} alt="Vite" />
              </div>
              <Text className={styles.techName}>Vite</Text>
            </div>
            {/* Query */}
            <div className={styles.techItem}>
              <div className={styles.techLogoBox}>
                <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/reactquery.svg" className={styles.svgIcon} style={{filter: 'invert(37%) sepia(93%) saturate(5427%) hue-rotate(345deg) brightness(101%) contrast(101%)'}} alt="React Query" />
              </div>
              <Text className={styles.techName}>React Query</Text>
            </div>
            {/* Zod */}
            <div className={styles.techItem}>
              <div className={styles.techLogoBox}><Text style={{color: '#3068b7', fontWeight: 'bold', fontSize: '24px'}}>Z</Text></div>
              <Text className={styles.techName}>Zod</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}