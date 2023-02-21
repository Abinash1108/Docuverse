import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'PRE Document Hub',
    Svg: require('@site/static/img/appdirect-logo-black-rgb.svg').default,
    description: (
      <>
        Docuverse is designed to help internal teams within AppDirect look for product topics, playbooks and articles.
      </>
    ),
  },
  {
    title: 'Some cool stuff here',
    Svg: require('@site/static/img/AD.svg').default,
    description: (
      <>
        
      </>
    ),
  },
  {
    title: 'About PRE',
    Svg: require('@site/static/img/engineering-PRE.svg').default,
    description: (
      <>
         Team - Readme goes here !!!
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
