import * as yup from 'yup';

export const clientPreferenceValidationSchema = yup.object().shape({
  client_id: yup.string().nullable(),
  news_category_id: yup.string().nullable(),
});
