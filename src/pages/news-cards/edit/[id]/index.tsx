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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getNewsCardById, updateNewsCardById } from 'apiSdk/news-cards';
import { Error } from 'components/error';
import { newsCardValidationSchema } from 'validationSchema/news-cards';
import { NewsCardInterface } from 'interfaces/news-card';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { NewsSourceInterface } from 'interfaces/news-source';
import { NewsCategoryInterface } from 'interfaces/news-category';
import { getNewsSources } from 'apiSdk/news-sources';
import { getNewsCategories } from 'apiSdk/news-categories';

function NewsCardEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<NewsCardInterface>(
    () => (id ? `/news-cards/${id}` : null),
    () => getNewsCardById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: NewsCardInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateNewsCardById(id, values);
      mutate(updated);
      resetForm();
      router.push('/news-cards');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<NewsCardInterface>({
    initialValues: data,
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
            Edit News Card
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'news_card',
  operation: AccessOperationEnum.UPDATE,
})(NewsCardEditPage);
