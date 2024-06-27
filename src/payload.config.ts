import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload/config'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import Users from './collections/Users'
import TimeSlots from './collections/TimeSlots'
import Courts from './collections/Courts'
import Bookings from './collections/Bookings'
import Payments from './collections/Payments'
import Partners from './collections/Partners'
import { Media } from './collections/Media'
import PartnerSpecs from './collections/PartnerSpec'
import Products from './collections/Products'
import { Settings } from './globals/Settings'
import { Reviews } from './collections/Reviews'
import DiscountRules from './collections/Discount rules'
import BeforeDashboard from './components/BeforeDashboard'
import Business from './collections/Business'
import { Plans } from './collections/Plans'
import { Subscribers } from './collections/Subscribers'



export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    components: {
      beforeDashboard: [BeforeDashboard],
    },
  },
  editor: lexicalEditor({}),
  collections: [Users, TimeSlots, Courts, Bookings, Payments, Partners, Media, PartnerSpecs, Products, Reviews, DiscountRules, Business, Plans, Subscribers],
  globals: [Settings],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  cors: [
    'http://localhost:3000', // Your front-end application
    'https://teknix-sport-2.onrender.com', // Your front-end application
  ],

  plugins: [payloadCloud()],
  db: postgresAdapter({
    idType: 'uuid',
    pool: {
      connectionString: process.env.DATABASE_URI,

    },
  }),
})
