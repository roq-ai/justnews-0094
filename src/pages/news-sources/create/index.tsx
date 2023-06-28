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
import { createNewsSource } from 'apiSdk/news-sources';
import { Error } from 'components/error';
import { newsSourceValidationSchema } from 'validationSchema/news-sources';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { NewsSourceInterface } from 'interfaces/news-source';

function NewsSourceCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: NewsSourceInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createNewsSource(values);
      resetForm();
      router.push('/news-sources');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<NewsSourceInterface>({
    initialValues: {
      source_name: '',
      editor_id: (router.query.editor_id as string) ?? null,
    },
    validationSchema: newsSourceValidationSchema,
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
            Create News Source
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="source_name" mb="4" isInvalid={!!formik.errors?.source_name}>
            <FormLabel>Source Name</FormLabel>
            <Input type="text" name="source_name" value={formik.values?.source_name} onChange={formik.handleChange} />
            {formik.errors.source_name && <FormErrorMessage>{formik.errors?.source_name}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'editor_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
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
  entity: 'news_source',
  operation: AccessOperationEnum.CREATE,
})(NewsSourceCreatePage);
