
import { Typography, Row, Col, Divider, Space } from 'antd';
import { LinkedinOutlined, GithubOutlined } from '@ant-design/icons';
import '../../components/home/home.css';
import FooterContent from '../../components/home/FooterContent';
import styles from './AboutPage.module.css';
import {
  ABOUT_PAGE_HEADER,
  STORY_SECTION,
  VISION_SECTION,
  TEAM_SECTION,
  TEAM_MEMBERS,
  TECH_SECTION,
  TECH_STACK,
  type TechStackLogo,
} from './constants';

const { Title, Paragraph, Text } = Typography;

function renderTechLogo(logo: TechStackLogo) {
  if (logo.kind === 'express') {
    return <Text className={styles.techExpressLabel}>ex</Text>;
  }

  if (logo.kind === 'zod') {
    return <Text className={styles.techZodLabel}>Z</Text>;
  }

  return (
    <img
      src={logo.src}
      className={styles.svgIcon}
      style={logo.filter ? { filter: logo.filter } : undefined}
      alt={logo.alt}
    />
  );
}

export default function AboutPage() {
  const StoryIcon = STORY_SECTION.Icon;
  const VisionIcon = VISION_SECTION.Icon;
  const TeamSectionIcon = TEAM_SECTION.Icon;
  const TechSectionIcon = TECH_SECTION.Icon;

  return (
    <div className={`${styles.pageWrapper} about-page`}>
      <div className="mainContent">
        <div className={styles.header}>
          <Title level={1} className={styles.mainTitle}>
            {ABOUT_PAGE_HEADER.title}{' '}
            <span className={styles.goldText}>{ABOUT_PAGE_HEADER.titleAccent}</span>
          </Title>
          <div className={styles.goldUnderline}></div>
          <Paragraph className={styles.subtitle}>{ABOUT_PAGE_HEADER.subtitle}</Paragraph>
        </div>

        <Row
          gutter={[{ xs: 16, sm: 20, lg: 24 }, { xs: 16, sm: 20, lg: 24 }]}
          align="stretch"
          className={styles.storyVisionRow}
        >
          <Col xs={24} lg={15}>
            <div className={styles.storyCard}>
              <div className={styles.cardContent}>
                <Space align="start" size={16}>
                  <div className={styles.iconBox}>
                    <StoryIcon />
                  </div>
                  <div>
                    <Text className={styles.cardLabel}>{STORY_SECTION.label}</Text>
                    <Title level={2} className={styles.cardTitle}>
                      {STORY_SECTION.title}
                    </Title>
                  </div>
                </Space>
                {STORY_SECTION.paragraphs.map((paragraph, index) => (
                  <Paragraph key={index} className={styles.descriptionText}>
                    {paragraph}
                  </Paragraph>
                ))}
              </div>
              <div
                className={styles.storyImage}
                style={{ backgroundImage: `url(${STORY_SECTION.image})` }}
              />
            </div>
          </Col>

          <Col xs={24} lg={9}>
            <div className={styles.visionCard}>
              <Space align="start" size={16}>
                <div className={styles.iconBox}>
                  <VisionIcon />
                </div>
                <div>
                  <Text className={styles.cardLabel}>{VISION_SECTION.label}</Text>
                  <Title level={2} className={styles.cardTitle}>
                    {VISION_SECTION.title}
                  </Title>
                </div>
              </Space>
              {VISION_SECTION.paragraphs.map((paragraph) => (
                <Paragraph key={paragraph.slice(0, 32)} className={styles.descriptionText}>
                  {paragraph}
                </Paragraph>
              ))}
              <div
                className={styles.visionImage}
                style={{ backgroundImage: `url(${VISION_SECTION.image})` }}
              />
            </div>
          </Col>
        </Row>

        <div className={styles.teamHeader}>
          <Space>
            <TeamSectionIcon className={styles.goldText} />
            <Text className={styles.cardLabel}>{TEAM_SECTION.label}</Text>
          </Space>
          <Title level={2} className={styles.cardTitle}>
            {TEAM_SECTION.title}
          </Title>
        </div>

        <Row gutter={[{ xs: 16, sm: 16, lg: 20 }, { xs: 16, sm: 16, lg: 20 }]} align="stretch" className={styles.teamRow}>
          {TEAM_MEMBERS.map((member) => (
            <Col key={member.id} xs={24} sm={12} lg={6}>
              <div className={styles.teamCard}>
                <img src={member.image} className={styles.avatar} alt={member.imageAlt} />
                <Title level={4} className={styles.memberName}>
                  {member.name}
                </Title>
                <Text className={styles.memberRole}>{member.role}</Text>
                <Divider className={styles.cardDivider} />
                <div className={styles.responsibilities}>
                  {member.responsibilities.map((responsibility) => {
                    const ResponsibilityIcon = responsibility.Icon;

                    return (
                      <div key={responsibility.label} className={styles.respItem}>
                        <ResponsibilityIcon />
                        <span>{responsibility.label}</span>
                      </div>
                    );
                  })}
                </div>
                <Space className={styles.socials} size={20}>
                  {member.socials?.linkedin ? (
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <LinkedinOutlined />
                    </a>
                  ) : (
                    <LinkedinOutlined />
                  )}
                  {member.socials?.github ? (
                    <a
                      href={member.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label={`${member.name} on GitHub`}
                    >
                      <GithubOutlined />
                    </a>
                  ) : (
                    <GithubOutlined />
                  )}
                </Space>
              </div>
            </Col>
          ))}
        </Row>

        <div className={styles.techSection}>
          <div className={styles.techHeader}>
            <div className={styles.iconBox}>
              <TechSectionIcon />
            </div>
            <div className={styles.techHeaderText}>
              <Text className={styles.cardLabel}>{TECH_SECTION.label}</Text>
              <Title level={2} className={styles.cardTitle}>
                {TECH_SECTION.title}
              </Title>
            </div>
          </div>

          <div className={styles.techStackRow}>
            {TECH_STACK.map((item) => (
              <div key={item.name} className={styles.techItem}>
                <div className={styles.techLogoBox}>{renderTechLogo(item.logo)}</div>
                <Text className={styles.techName}>{item.name}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <FooterContent />
      </div>
    </div>
  );
}
