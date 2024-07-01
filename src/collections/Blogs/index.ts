
import payload from 'payload'
import type { CollectionConfig } from 'payload/types'
import RichTextField from '../../fields/RichTextField'
import HorizontalRule from '../../fields/HorizontalRule'


export const Blogs: CollectionConfig = {
  slug: 'Blogs',
  admin: {
    useAsTitle: 'title',
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: '_status',
      type: 'select',
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'pending', label: 'Pending' }, // Thêm giá trị 'pending' vào enum
        { value: 'schedule', label: 'Schedule' },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'content',
      localized: true,
      type: 'richText',
      admin: {
        components: {
          Field: RichTextField,
        },
      },
    },
    {
      type: 'ui',
      name: 'divider',
      admin: {
        components: {
          Field: HorizontalRule,
        },
      },
    },
    {
      name: 'indexOrNoindex',
      label: 'Index or no index',
      type: 'checkbox',
    },
    {
      name: 'keywords',
      type: 'text',
      label: 'Keywords',
      hasMany: true,
      localized: true,
    },
    {
      name: 'visibility',
      type: 'select',
      label: 'Visibility',
      options: [
        {
          label: 'Public',
          value: 'public',
        },
        {
          label: 'Private',
          value: 'private',
        },
      ],
      defaultValue: 'public',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      label: 'Tags',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      // hooks: {
      //   beforeChange: [
      //     async ({ siblingData, value, operation, data }) => {
      //       if (operation === 'create') {
      //         const subscribers = payload.find({
      //           collection: 'subscribers',
      //           limit: 0, // Lấy tất cả các subscribers
      //         })
      //         const emailPromises = (await subscribers).docs.map(async subscriber => {
      //           const message = {
      //             to: subscriber.email,
      //             from: process.env.SMTP_USER,
      //             subject: 'New Page Added',
      //             text: `A new page named ${data.title} has been added.`,
      //           }
      //           await payload.sendEmail(message)
      //         })

      //         await Promise.all(emailPromises)
      //       }
      //       if (siblingData._status === 'published' && !value) {
      //         return new Date()
      //       }
      //       return value
      //     },
      //   ],
      // },
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      label: 'Featured Image',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'populatedAuthors',
      type: 'array',
      admin: {
        readOnly: true,
        disabled: true,
      },
      access: {
        update: () => false,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
  ],
}
