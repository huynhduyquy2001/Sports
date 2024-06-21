// Products Collection
import { CollectionConfig } from 'payload/types';

const Products: CollectionConfig = {
  slug: 'products',
  admin: {useAsTitle: 'name'},
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
        name: 'isSync',
        type: 'checkbox',
        defaultValue: true,
        admin: {
            description: 'Whether the product is sync',
        },
    },
    {
      name: 'inventory',
      type: 'number',
      required: true,
    },
    {
        name: 'owner',
        type: 'relationship',
        relationTo: 'partners',
        hasMany: false,
        admin: {
            allowCreate: false
        }
    },
  ],
};

export default Products;