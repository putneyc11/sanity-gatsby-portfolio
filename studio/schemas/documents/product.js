export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Signs', 'Wall Art', 'Kitchen', 'Home Decor', 'Furniture']
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'wood',
      title: 'Wood species',
      type: 'string'
    },
    {
      name: 'priceCents',
      title: 'Price (USD cents)',
      type: 'number',
      description: 'Stored in cents to match Stripe, e.g. 14500 = $145.00',
      validation: Rule => Rule.required().integer().positive()
    },
    {
      name: 'weightOz',
      title: 'Shipping weight (oz)',
      type: 'number',
      description: 'Used to generate the shipping label'
    },
    {
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string'
    },
    {
      name: 'lead',
      title: 'Short description',
      type: 'string'
    },
    {
      name: 'description',
      title: 'Full description',
      type: 'text'
    },
    {
      name: 'mainImage',
      title: 'Product photo',
      type: 'figure'
    },
    {
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean'
    }
  ],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'mainImage'}
  }
}
