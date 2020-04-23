export default {
  widgets: [
    {
      name: 'sanity-tutorials',
      options: {
        templateRepoId: 'sanity-io/sanity-template-gatsby-portfolio'
      }
    },
    {name: 'structure-menu'},
    {
      name: 'project-info',
      options: {
        __experimental_before: [
          {
            name: 'netlify',
            options: {
              description:
                'NOTE: Because these sites are static builds, they need to be re-deployed to see the changes when documents are published.',
              sites: [
                {
                  buildHookId: '5ea1c36a8f1e287551fd494a',
                  title: 'Sanity Studio',
                  name: 'sanity-gatsby-portfolio-studio-r3nz89kx',
                  apiId: '5c855fee-58e1-4f86-84a5-56982ff67821'
                },
                {
                  buildHookId: '5ea1c36a6f690f01728a3e46',
                  title: 'Portfolio Website',
                  name: 'sanity-gatsby-portfolio-web-98ut4q62',
                  apiId: '46c54a42-0fd4-45f1-a689-be8747732563'
                }
              ]
            }
          }
        ],
        data: [
          {
            title: 'GitHub repo',
            value: 'https://github.com/putneyc11/sanity-gatsby-portfolio',
            category: 'Code'
          },
          {
            title: 'Frontend',
            value: 'https://sanity-gatsby-portfolio-web-98ut4q62.netlify.app',
            category: 'apps'
          }
        ]
      }
    },
    {name: 'project-users', layout: {height: 'auto'}},
    {
      name: 'document-list',
      options: {title: 'Recent projects', order: '_createdAt desc', types: ['sampleProject']},
      layout: {width: 'medium'}
    }
  ]
}
