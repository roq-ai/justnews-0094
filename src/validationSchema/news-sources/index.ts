import * as yup from 'yup';

export const newsSourceValidationSchema = yup.object().shape({
  source_name: yup.string().required(),
  editor_id: yup.string().nullable(),
});
