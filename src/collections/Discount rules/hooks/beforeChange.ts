// import { BeforeChangeHook } from "payload/dist/collections/config/types";




// export const beforeDiscountRuleChange: BeforeChangeHook = async ({ data, operation, originalDoc }) => {
//     const isUpdate = operation === 'update';
//     const isCreate = operation === 'create';
//     console.log(isUpdate);
//     if (isUpdate && originalDoc) {
//         // Remove the existing daysOfWeek entries related to this rule
//         for (const condition of originalDoc.conditions) {
//             if (condition.daysOfWeek && condition.daysOfWeek.length > 0) {
//                 await db('discount_rules_conditions_days_of_week')
//                     .where({ parent_id: condition.id })
//                     .del();
//             }
//         }
//     }

//     // Remove null fields in each condition
//     if (data.conditions && Array.isArray(data.conditions)) {
//         data.conditions = data.conditions.map(condition => {
//             return Object.fromEntries(
//                 Object.entries(condition).filter(([_, value]) => value !== null)
//             );
//         });

//         // Reinsert updated daysOfWeek entries if necessary
//         if (isUpdate) {
//             for (const condition of data.conditions) {
//                 if (condition.daysOfWeek && Array.isArray(condition.daysOfWeek)) {
//                     for (const day of condition.daysOfWeek) {
//                         await db('discount_rules_conditions_days_of_week').insert({
//                             parent_id: condition.id,
//                             day: day,
//                         });
//                     }
//                 }
//             }
//         }
//     }

//     if (isCreate) {
//         console.log('Creating a new document');
//     } else if (isUpdate) {
//         console.log('Updating an existing document');
//     }

//     return data;
// };

// export const beforeDiscountRuleDelete = async ({ req, id, originalDoc }) => {
//     // Xóa các bản ghi liên quan trong bảng con trước khi xóa bản ghi trong bảng chính
//     if (originalDoc && originalDoc.conditions) {
//         for (const condition of originalDoc.conditions) {
//             if (condition.daysOfWeek && condition.daysOfWeek.length > 0) {
//                 await db('discount_rules_conditions_days_of_week')
//                     .where({ parent_id: condition.id })
//                     .del();
//             }
//         }
//     }
// };
