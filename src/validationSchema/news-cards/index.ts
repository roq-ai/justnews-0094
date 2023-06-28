import * as yup from 'yup';

export const newsCardValidationSchema = yup.object().shape({
  summary: yup.string().required(),
  photo: yup.string(),
  link: yup.string().required(),
  news_source_id: yup.string().nullable(),
  news_category_id: yup.string().nullable(),
});
