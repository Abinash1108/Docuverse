// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Docuverse',
  tagline: 'A cool platform to create, edit, view AppDirect - PRE documentations',
  favicon: 'img/appdirect-logo-black-rgb.jpg',

  // Set the production url of your site here
  url: 'https://your-docusaurus-test-site.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'AppDirect', // Usually your GitHub org/user name.
  projectName: 'Docuverse', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/appdirect-logo-black-rgb.jpg',
      navbar: {
        hideOnScroll: true,
        logo: {
          alt: 'Docuverse',
          src: 'img/appdirect-developers-icon-08.svg',
        },
        items: [
          // left
          {
            label: 'Docs',
            to: 'docs/what-is-docuverse',
            position: 'left',
          },
          {
            label: 'Newsletter',
            to: 'newsletter/monthly',
            position: 'left',
          },
          //right
          {
            href: 'https://github.com/Abinash1108/Docuverse',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://github.com/AppDirect/teams/blob/master/teams/product-reliability-engineering/team.yaml',
            label: 'PRE Teams',
            position: 'right',
          }
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Community',
            items: [
              {
                label: 'AppDirect Stack Overflow',
                href: 'https://stackoverflowteams.com/c/appdirect/questions',
              },
              {
                label: 'Confluence',
                href: 'https://appdirect.jira.com/wiki/spaces/PSG/pages/218781836/Playbooks',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Documentation Center',
                to: 'https://ad.docs.appdirect.com/',
              },
              {
                label: 'AppDirect Tech Documentation',
                href: 'https://github.com/AppDirect/architecture/tree/master/docs',
              },
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;