const products = require('./src/data/products')

exports.createPages = async ({actions, reporter}) => {
  const {createPage} = actions

  products.forEach(product => {
    const path = `/shop/${product.slug}/`
    reporter.info(`Creating product page: ${path}`)
    createPage({
      path,
      component: require.resolve('./src/templates/product.js'),
      context: {slug: product.slug}
    })
  })
}
