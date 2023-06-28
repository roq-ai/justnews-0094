import * as yup from 'yup';

export const newsCategoryValidationSchema = yup.object().shape({
  category_name: yup.string().required(),
  editor_id: yup.string().nullable(),
});
