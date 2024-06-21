import { CollectionConfig } from 'payload/types';

const DiscountRules: CollectionConfig = {
    slug: 'discount-rules',
    labels: {
        singular: 'Discount Rule',
        plural: 'Discount Rules',
    },
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'discountType',
            type: 'group',
            label: 'Discount Type',
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    label: 'Rule Name',
                },
                {
                    name: 'description',
                    type: 'textarea',
                    required: false,
                    label: 'Description',
                },
                {
                    name: 'discountType',
                    type: 'select',
                    required: true,
                    label: 'Discount Type',
                    options: [
                        {
                            label: 'Percentage',
                            value: 'percentage',
                        },
                        {
                            label: 'Fixed Amount',
                            value: 'fixed',
                        },

                        {
                            label: 'Fixed Amount Per Product',
                            value: 'fixedPerProduct',
                        },
                        {
                            label: 'Freeship',
                            value: 'freeship',
                        },
                    ],
                },
                {
                    name: 'discountValue',
                    type: 'number',
                    required: true,
                    label: 'Discount Value',
                },
                {
                    name: 'maximumAmount',
                    type: 'number',
                    required: false,
                    label: 'Maximum Amount',
                },
                {
                    name: 'enable',
                    type: 'checkbox',
                    required: true,
                    label: 'Enable',
                },
                {
                    name: 'startDate',
                    type: 'date',
                    label: 'Start Date',
                    admin: {
                        date: {
                            pickerAppearance: 'dayOnly',
                        },
                    },
                },
                {
                    name: 'endDate',
                    type: 'date',
                    label: 'End Date',
                    admin: {
                        date: {
                            pickerAppearance: 'dayOnly',
                        },
                    },
                },
            ],
        },
        {
            name: 'conditions',
            type: 'array',
            label: 'Conditions',
            fields: [
                {
                    name: 'conditionType',
                    type: 'select',
                    required: true,
                    label: 'Condition Type',
                    options: [
                        {
                            label: 'Cart total',
                            value: 'cart_total',
                        },
                        {
                            label: 'Cart item quantity',
                            value: 'cart_item_quantity',
                        },
                        {
                            label: 'Products',
                            value: 'products',
                        },
                        {
                            label: 'Date',
                            value: 'date',
                        },
                        {
                            label: 'Dates of week',
                            value: 'dates_of_week',
                        },
                    ],
                },
                {
                    name: 'operator_cart',
                    type: 'select',
                    label: 'Operator',
                    options: [
                        {
                            label: 'Greater Than',
                            value: 'greater_than',
                        },
                        {
                            label: 'Less Than',
                            value: 'less_than',
                        },
                    ],
                    admin: {
                        condition: (_, siblingData) => {
                            return siblingData.conditionType === 'cart_total' || siblingData.conditionType === 'cart_item_quantity';
                        },
                    },
                },
                {
                    name: 'operator_products',
                    type: 'select',
                    label: 'Operator',
                    options: [
                        {
                            label: 'In List',
                            value: 'in_list',
                        },
                        {
                            label: 'Not In List',
                            value: 'not_in_list',
                        },
                    ],
                    admin: {
                        condition: (_, siblingData) => {
                            return siblingData.conditionType === 'products';
                        },
                    },
                },
                {
                    name: 'from_day',
                    type: 'date',
                    label: 'From Day',
                    admin: {
                        date: {
                            pickerAppearance: 'dayOnly',
                        },
                        condition: (_, siblingData) => {
                            return siblingData.conditionType === 'date';
                        },
                    },
                },
                {
                    name: 'to_day',
                    type: 'date',
                    label: 'To Day',
                    admin: {
                        date: {
                            pickerAppearance: 'dayOnly',
                        },
                        condition: (_, siblingData) => {
                            return siblingData.conditionType === 'date';
                        },
                    },
                },

                {
                    name: 'operator_dates_of_week',
                    type: 'select',
                    label: 'Operator',
                    options: [
                        {
                            label: 'In List',
                            value: 'in_list',
                        },
                        {
                            label: 'Not In List',
                            value: 'not_in_list',
                        },
                    ],
                    admin: {
                        condition: (_, siblingData) => {
                            return siblingData.conditionType === 'dates_of_week';
                        },
                    },
                },
                {
                    name: 'value',
                    type: 'text',
                    required: true,
                    label: 'Value',
                    admin: {
                        condition: (_, siblingData) => {
                            const type = siblingData.conditionType;
                            const operator = siblingData.operator_cart || siblingData.operator_products || siblingData.operator_date || siblingData.operator_dates_of_week;
                            if (type === 'cart_total' || type === 'cart_item_quantity') {
                                return ['equals', 'not_equals', 'greater_than', 'less_than'].includes(operator);
                            }
                            if (type === 'products' && ['in_list', 'not_in_list'].includes(operator)) {
                                return true;
                            }
                            if (type === 'date' && (operator === 'from_day' || operator === 'to_day')) {
                                return true;
                            }
                            return false;
                        },
                    },
                },
                {
                    name: 'productCodes',
                    type: 'array',
                    label: 'Product Codes',
                    fields: [
                        {
                            name: 'code',
                            type: 'text',
                            required: true,
                            label: 'Code',
                        },
                    ],
                    admin: {
                        condition: (_, siblingData) => {
                            return siblingData.conditionType === 'products' && ['in_list', 'not_in_list'].includes(siblingData.operator_products);
                        },
                    },
                },
                {
                    name: 'daysOfWeek',
                    type: 'select',
                    label: 'Days of Week',
                    hasMany: true,
                    options: [
                        {
                            label: 'Monday',
                            value: 'monday',
                        },
                        {
                            label: 'Tuesday',
                            value: 'tuesday',
                        },
                        {
                            label: 'Wednesday',
                            value: 'wednesday',
                        },
                        {
                            label: 'Thursday',
                            value: 'thursday',
                        },
                        {
                            label: 'Friday',
                            value: 'friday',
                        },
                        {
                            label: 'Saturday',
                            value: 'saturday',
                        },
                        {
                            label: 'Sunday',
                            value: 'sunday',
                        },
                    ],
                    admin: {
                        condition: (_, siblingData) => {
                            return siblingData.conditionType === 'dates_of_week' && ['in_list', 'not_in_list'].includes(siblingData.operator_dates_of_week);
                        },
                    },
                },
                {
                    name: 'logicalOperator',
                    type: 'select',
                    label: 'Logical Operator',
                    options: [
                        { label: 'AND', value: 'and' },
                        { label: 'OR', value: 'or' },
                    ],
                    defaultValue: 'and', // default to 'AND' if not specified
                }
            ],

        }


    ],

};

export default DiscountRules;
