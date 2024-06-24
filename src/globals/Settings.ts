import type { GlobalConfig } from 'payload/types'
import { admins } from '../collections/access/admins'


export const Settings: GlobalConfig = {
  slug: 'settings',
  typescript: {
    interface: 'General Settings',
  },
  graphQL: {
    name: 'Settings',
  },
  access: {
    read: () => true,
    update: admins,
  },
  fields: [
    {
      name: 'novu',
      type: 'group',
      label: 'Novu',
      fields: [
        {
          name: 'apiKey',
          type: 'text',
          label: 'API key',
        },

      ]
    },
    {
      name: 'googleMapsApiKey',
      type: 'text',
      required: true,
    },
  ]
}
