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
import { createClientPreference } from 'apiSdk/client-preferences';
import { Error } from 'components/error';
import { clientPreferenceValidationSchema } from 'validationSchema/client-preferences';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { ClientInterface } from 'interfaces/client';
import { NewsCategoryInterface } from 'interfaces/news-category';
import { getClients } from 'apiSdk/clients';
import { getNewsCategories } from 'apiSdk/news-categories';
import { ClientPreferenceInterface } from 'interfaces/client-preference';

function ClientPreferenceCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ClientPreferenceInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createClientPreference(values);
      resetForm();
      router.push('/client-preferences');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ClientPreferenceInterface>({
    initialValues: {
      client_id: (router.query.client_id as string) ?? null,
      news_category_id: (router.query.news_category_id as string) ?? null,
    },
    validationSchema: clientPreferenceValidationSchema,
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
            Create Client Preference
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<ClientInterface>
            formik={formik}
            name={'client_id'}
            label={'Select Client'}
            placeholder={'Select Client'}
            fetcher={getClients}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
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
  entity: 'client_preference',
  operation: AccessOperationEnum.CREATE,
})(ClientPreferenceCreatePage);
