import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createNewsCard } from 'apiSdk/news-cards';
import { Error } from 'components/error';
import { newsCardValidationSchema } from 'validationSchema/news-cards';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { NewsSourceInterface } from 'interfaces/news-source';
import { NewsCategoryInterface } from 'interfaces/news-category';
import { getNewsSources } from 'apiSdk/news-sources';
import { getNewsCategories } from 'apiSdk/news-categories';
import { NewsCardInterface } from 'interfaces/news-card';

function NewsCardCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: NewsCardInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createNewsCard(values);
      resetForm();
      router.push('/news-cards');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<NewsCardInterface>({
    initialValues: {
      summary: '',
      photo: '',
      link: '',
      news_source_id: (router.query.news_source_id as string) ?? null,
      news_category_id: (router.query.news_category_id as string) ?? null,
    },
    validationSchema: newsCardValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create News Card
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="summary" mb="4" isInvalid={!!formik.errors?.summary}>
            <FormLabel>Summary</FormLabel>
            <Input type="text" name="summary" value={formik.values?.summary} onChange={formik.handleChange} />
            {formik.errors.summary && <FormErrorMessage>{formik.errors?.summary}</FormErrorMessage>}
          </FormControl>
          <FormControl id="photo" mb="4" isInvalid={!!formik.errors?.photo}>
            <FormLabel>Photo</FormLabel>
            <Input type="text" name="photo" value={formik.values?.photo} onChange={formik.handleChange} />
            {formik.errors.photo && <FormErrorMessage>{formik.errors?.photo}</FormErrorMessage>}
          </FormControl>
          <FormControl id="link" mb="4" isInvalid={!!formik.errors?.link}>
            <FormLabel>Link</FormLabel>
            <Input type="text" name="link" value={formik.values?.link} onChange={formik.handleChange} />
            {formik.errors.link && <FormErrorMessage>{formik.errors?.link}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<NewsSourceInterface>
            formik={formik}
            name={'news_source_id'}
            label={'Select News Source'}
            placeholder={'Select News Source'}
            fetcher={getNewsSources}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.source_name}
              </option>
            )}
          />
          <AsyncSelect<NewsCategoryInterface>
            formik={formik}
            name={'news_category_id'}
            label={'Select News Category'}
            placeholder={'Select News Category'}
            fetcher={getNewsCategories}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.category_name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'news_card',
  operation: AccessOperationEnum.CREATE,
})(NewsCardCreatePage);
