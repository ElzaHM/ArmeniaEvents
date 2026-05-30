import { Tag, Typography } from 'antd';
import SearchBar from './SearchBar';
import { POPULAR_TAGS } from './mockData';
import { useTheme } from '../../hooks/useTheme'; // 1. Ներմուծիր useTheme-ը
import homePageBg from '../../assets/homePageBg.png'; // Մութ ռեժիմի նկարը
import homePageBgLight from '../../assets/eventPageLigthBg.png'; // 2. Ավելացրու լուսավոր ռեժիմի նկարը (ստեղծիր այս ֆայլը assets-ում)

import styles from './HeroSection.module.css';

export default function HeroSection() {
  const { mode } = useTheme(); // 3. Ստացիր ընթացիկ ռեժիմը

  // 4. Ընտրիր նկարը կախված ռեժիմից
  const bgImage = mode === 'light' ? homePageBgLight : homePageBg;

  return (
    <section 
      className={styles.hero} 
      style={{ backgroundImage: `url(${bgImage})` }} // 5. Օգտագործիր bgImage-ը
    >
      <div className={styles.overlay}>
        <div className={`homeSection ${styles.content}`}>
          <Typography.Title level={1} className={styles.title}>
            Discover Events in <span className={styles.highlight}>Armenia</span>
          </Typography.Title>
          <Typography.Paragraph className={styles.subtitle}>
            Find the best events, conferences, meetups, concerts and more around you.
          </Typography.Paragraph>

          <SearchBar />

          <div className={styles.tags}>
            {POPULAR_TAGS.map((tag) => (
              <Tag key={tag} className={styles.tag}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}




// import { Tag, Typography } from 'antd';

// import SearchBar from './SearchBar';
// import { POPULAR_TAGS } from './mockData';
// import HomePageBg from '../../assets/homePageBg.png'

// import styles from './HeroSection.module.css';

// // const HERO_IMAGE ={HomePageBg};

// export default function HeroSection() {
//   return (
//     <section className={styles.hero} style={{ backgroundImage: `url(${HomePageBg})` }}>
//       <div className={styles.overlay}>
//         <div className={`homeSection ${styles.content}`}>
//           <Typography.Title level={1} className={styles.title}>
//             Discover Events in <span className={styles.highlight}>Armenia</span>
//           </Typography.Title>
//           <Typography.Paragraph className={styles.subtitle}>
//             Find the best events, conferences, meetups, concerts and more around you.
//           </Typography.Paragraph>

//           <SearchBar />

//           <div className={styles.tags}>
//             {POPULAR_TAGS.map((tag) => (
//               <Tag key={tag} className={styles.tag}>
//                 {tag}
//               </Tag>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
